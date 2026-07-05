function TamilKeyboard() {
  const [lastMei, setLastMei] = React.useState(null);

  const uyirList = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ"];
  const meiList = ["க்","ங்","ச்","ஞ்","ட்","ண்","த்","ந்","ப்","ம்","ய்","ர்","ல்","வ்","ழ்","ள்","ற்","ன்"];
  const granthaList = ["ஜ","ஷ","ஸ","ஹ","க்ஷ"];

  const uyirmeiMap = {
    "க்": ["க","கா","கி","கீ","கு","கூ","கெ","கே","கை","கொ","கோ","கௌ"],
    "ங்": ["ங","ஙா","ஙி","ஙீ","ஙு","ஙூ","ஙெ","ஙே","ஙை","ஙொ","ஙோ","ஙௌ"],
    "ச்": ["ச","சா","சி","சீ","சு","சூ","செ","சே","சை","சொ","சோ","சௌ"],
    "ஞ்": ["ஞ","ஞா","ஞி","ஞீ","ஞு","ஞூ","ஞெ","ஞே","ஞை","ஞொ","ஞோ","ஞௌ"],
    "ட்": ["ட","டா","டி","டீ","டு","டூ","டெ","டே","டை","டொ","டோ","டௌ"],
    "ண்": ["ண","ணா","ணி","ணீ","ணு","ணூ","ணெ","ணே","ணை","ணொ","ணோ","ணௌ"],
    "த்": ["த","தா","தி","தீ","து","தூ","தெ","தே","தை","தொ","தோ","தௌ"],
    "ந்": ["ந","நா","நி","நீ","நு","நூ","நெ","நே","நை","நொ","நோ","நௌ"],
    "ப்": ["ப","பா","பி","பீ","பு","பூ","பெ","பே","பை","பொ","போ","பௌ"],
    "ம்": ["ம","மா","மி","மீ","மு","மூ","மெ","மே","மை","மொ","மோ","மௌ"],
    "ய்": ["ய","யா","யி","யீ","யு","யூ","யெ","யே","யை","யொ","யோ","யௌ"],
    "வ்": ["வ","வா","வி","வீ","வு","வூ","வெ","வே","வை","வொ","வோ","வௌ"],
    "ர்": ["ர","ரா","ரி","ரீ","ரு","ரூ","ரெ","ரே","ரை","ரொ","ரோ","ரௌ"],
    "ல்": ["ல","லா","லி","லீ","லு","லூ","லெ","லே","லை","லொ","லோ","லௌ"],
    "ழ்": ["ழ","ழா","ழி","ழீ","ழு","ழூ","ழெ","ழே","ழை","ழொ","ழோ","ழௌ"],
    "ள்": ["ள","ளா","ளி","ளீ","ளு","ளூ","ளெ","ளே","ளை","ளொ","ளோ","ளௌ"],
    "ற்": ["ற","றா","றி","றீ","று","றூ","றெ","றே","றை","றொ","றோ","றௌ"],
    "ன்": ["ன","னா","னி","னீ","னு","னூ","னெ","னே","னை","னொ","னோ","னௌ"]
  };

  const keyStyle = {
    padding: "12px",
    fontSize: "22px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #7e57c2",
    backgroundColor: "#f3e5f5",
    margin: "4px",
    minWidth: "48px",
    textAlign: "center",
    fontFamily: "'Noto Sans Tamil','Latha','Nirmala UI','Arial Unicode MS',sans-serif",
    color: "#4a148c",
    fontWeight: "bold"
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "6px"
  };

  // insert into textarea
  const insertToTextarea = (txt) => {
    const ta = document.getElementById("tamilInput");
    ta.value += txt;
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {/* Uyir row */}
      <div style={rowStyle}>
        {uyirList.map((u, i) => (
          <button key={i} style={keyStyle} 
            onClick={(e) => {
              e.preventDefault();
              const ta = document.getElementById("tamilInput");
              if(lastMei && uyirmeiMap[lastMei]) {
                const combo = uyirmeiMap[lastMei][i];
                ta.value = ta.value.slice(0, -lastMei.length) + combo;
                setLastMei(null);
              } else {
                insertToTextarea(u);
              }
            }}>{u}</button>
        ))}
      </div>

      {/* Mei row */}
      <div style={rowStyle}>
        {meiList.map((m, i) => (
          <button key={i} style={keyStyle}
            onClick={(e) => { 
              e.preventDefault();
              insertToTextarea(m);
              setLastMei(m); 
            }}>{m}</button>
        ))}
      </div>

      {/* Grantha row */}
      <div style={rowStyle}>
        {granthaList.map((g, i) => (
          <button key={i} style={keyStyle}
            onClick={(e) => { 
              e.preventDefault();
              insertToTextarea(g);
            }}>{g}</button>
        ))}
      </div>

      {/* Special row: Space, Enter, Backspace, Clear */}
      <div style={rowStyle}>
        <button style={{...keyStyle, minWidth:"100px"}} onClick={(e) => {
          e.preventDefault();
          insertToTextarea(" ");
        }}>␣ Space</button>

        <button style={keyStyle} onClick={(e) => {
          e.preventDefault();
          const ta = document.getElementById("tamilInput");
          ta.value = ta.value + "\n";
        }}>↵ Enter</button>

        <button style={keyStyle} onClick={(e) => {
          e.preventDefault();
          const ta = document.getElementById("tamilInput");
          ta.value = ta.value.slice(0, -1);
        }}>⌫</button>

        <button style={keyStyle} onClick={(e) => {
          e.preventDefault();
          const ta = document.getElementById("tamilInput");
          ta.value = "";
          setLastMei(null);
        }}>❌</button>
      </div>
    </div>
  );
}
