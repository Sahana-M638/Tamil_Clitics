from flask import Flask, render_template, request
import unicodedata

app = Flask(__name__)

# Normalize helper (NFC)
def normalize_txt(s):
    return unicodedata.normalize("NFC", s.strip())

# UTF-8 display helper (FINAL & CORRECT)
def tamil_to_utf8_bytes_with_chars(text):
    lines = []
    for char in text:
        utf_bytes = char.encode("utf-8")
        hex_bytes = " ".join(f"{b:02X}" for b in utf_bytes)
        codepoint = f"U+{ord(char):04X}"
        lines.append(f"{char} → {hex_bytes}  ({codepoint})")
    return lines


def looks_like_verb_stem(candidate):
    if not candidate:
        return False

    last = candidate[-1]

    if last in ("ய்", "ு", "ி", "ை"):
        return True

    for ending in ("வு", "று", "டு", "து", "கிற", "கும்", "க்க"):
        if candidate.endswith(ending):
            return True

    return False


def detect_clitic(word):
    w = normalize_txt(word)
    n = len(w)

    if n <= 1:
        return "❌", None

    explicit_non_clitic_verbs = ("முடியும்", "செய்யும்", "போயும்", "வந்தும்", "போகும்", "கொள்ளும்")
    if any(w.endswith(v) for v in explicit_non_clitic_verbs):
        return "❌", None

    # 1) Question-type endings: "உமா", "யுமா"
    if w.endswith("உமா") or w.endswith("யுமா"):
        root = w[:-3] + "ு"
        if root:
            return "✅ ஆ", root

    # -------------------------------------------------------
    # ⭐ FIXED: Correct ‘யும்’ root (சட்டங்களையும் → சட்டங்களை)
    # -------------------------------------------------------
    if w.endswith("யும்") and n > 3:
        stem = w[:-3]               # remove 'யும்'

        # Rule: stem ending in "ா" → change to "ை"
        if stem.endswith("ா"):
            root = stem[:-1] + "ை"
        else:
            root = stem

        if looks_like_verb_stem(root):
            return "❌", None

        return "✅ உம்", root
    # -------------------------------------------------------

    # 3) Handle 'உம்', 'னும்', 'நும்'
    for suf in ("னும்", "நும்", "உம்"):
        if w.endswith(suf) and n > len(suf):

            if suf in ("னும்", "நும்"):
                root = w[:-3]
            else:
                root = w[:-2]

            if looks_like_verb_stem(root):
                return "❌", None

            if any(x in w for x in ("ம்மா", "அப்பா", "தாத்தா", "மாமா", "தங்கை")):
                return "❌", None

            return "✅ உம்", root

    # -------------------------------------------------------
    # ⭐ Logic for ஆக / ஆல் / இல் — pure pattern
    # -------------------------------------------------------
    if len(w) >= 2:
        last = w[-1]
        second_last = w[-2]

        if second_last == "ஆ" and last in ("க்", "க"):
            root = w[:-2]
            if not looks_like_verb_stem(root):
                return "✅ ஆக", root

        if second_last == "ஆ" and last in ("ல்", "ல"):
            root = w[:-2]
            if not looks_like_verb_stem(root):
                return "✅ ஆல்", root

        if second_last == "இ" and last in ("ல்", "ல"):
            root = w[:-2]
            if not looks_like_verb_stem(root):
                return "✅ இல்", root
    # -------------------------------------------------------

    # 4) Other clitics
    other_clitics = ["ஆல்", "ஆக", "இல்", "இன்", "ஐ", "ஓ", "ஆ"]

    for clitic in other_clitics:
        if w.endswith(clitic) and n > len(clitic):

            root = w[:-len(clitic)]

            if looks_like_verb_stem(root):
                return "❌", None

            if len(w) >= 3 and w[-3:] in ("ம்மா", "ப்பா", "த்தா", "க்கா"):
                return "❌", None

            return f"✅ {clitic}", root

    return "❌", None


@app.route("/", methods=["GET", "POST"])
def index():
    word_list = []
    tamil_sentence = ""
    if request.method == "POST":
        tamil_sentence = request.form.get("tamil_sentence", "").strip()
        words = tamil_sentence.split()
        for word in words:
            utf8_info = tamil_to_utf8_bytes_with_chars(word)
            result, root_word = detect_clitic(word)
            word_list.append({
                "word": word,
                "result": result,
                "root_word": root_word if root_word else "—",
                "utf8_info": utf8_info
            })
    return render_template("index.html", word_list=word_list, tamil_sentence=tamil_sentence)


if __name__ == "__main__":
    app.run(debug=True)
