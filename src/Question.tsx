import { useState } from "react";

const EXAMPLE =
  "ポーカーの役の一つであり、手札のスートが全て同じの場合にできる役の名前は？";

const Question = () => {
  const [chars, setChars] = useState(
    EXAMPLE.split("").map((value) => ({ value, isOpen: false }))
  );

  const openChar = (idx: number) => {
    const newChars = chars.map((v, i) =>
      i === idx ? { ...v, isOpen: true } : v
    );
    setChars(newChars);
  };

  return (
    <>
      <div className="count-container">
        <span style={{ fontSize: 30 }}>
          {chars.filter((c) => !c.isOpen).length}
        </span>
        /{chars.length}
      </div>
      <div className="char-box-container">
        {chars.map((char, idx) => (
          <div className="char-box">
            {char.isOpen ? (
              <div className="char-box-inner open">{char.value}</div>
            ) : (
              <div
                onClick={() => openChar(idx)}
                className="char-box-inner closed"
              >
                {idx + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export { Question };
