import React, { useEffect, useState } from "react";

const brailleMap = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
  f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
  p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽",
  z: "⠵", " ": " ",
  0: "⠴", 1: "⠂", 2: "⠆", 3: "⠒", 4: "⠲",
  5: "⠢", 6: "⠖", 7: "⠶", 8: "⠦", 9: "⠔",
  ".": "⠲", ",": "⠂", "!": "⠖", "?": "⠦",
  "-": "⠤", ":": "⠱", ";": "⠰", "'": "⠄",
};

const Subtitles = ({ text = "Twin Alumany connects hearts and minds.", speed = 80 }) => {
  const [brailleText, setBrailleText] = useState("");

  useEffect(() => {
    const brailleConverted = text
      .toLowerCase()
      .split("")
      .map((char) => brailleMap[char] || "⍰");

    let i = 0;
    setBrailleText(""); // Reset when text changes

    const interval = setInterval(() => {
      setBrailleText((prev) => prev + brailleConverted[i]);
      i++;
      if (i >= brailleConverted.length-1) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="subtitle-container">
      <p className="braille-text">{brailleText}</p>

      <style jsx>{`
        .subtitle-container {
          font-family: 'Courier New', monospace;
          font-size: 1.6rem;
          padding: 1rem 2rem;
          background: #f8f8f8;
          border-radius: 10px;
          max-width: 700px;
          margin: 2rem auto;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .braille-text {
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          color: #333;
          animation: fadeIn 0.4s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Subtitles;
