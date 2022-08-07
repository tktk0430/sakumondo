import { useEffect, useState } from "react";
import { decode } from "./crypto";

const ANSWER_TYPE_MAP = {
  katakana: "カタカナ",
  number: "数字",
  "": "",
};

const SolvePage = () => {
  const [chars, setChars] = useState<{ value: string; isOpen: boolean }[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerType, setAnswerType] =
    useState<keyof typeof ANSWER_TYPE_MAP>("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const { sentence, answerType, answers } = JSON.parse(decode(q));
      setChars(
        sentence.split("").map((value: string) => ({ value, isOpen: false }))
      );
      setAnswerType(answerType);
      setAnswers(answers.split("\n"));
    }
  }, []);

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
          <div className="char-box" key={idx}>
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
      <div>
        {answerType && (
          <div className="answer-note">{ANSWER_TYPE_MAP[answerType]}で</div>
        )}
        <input
          className="answer-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="post-button">Answer</div>
      </div>
    </>
  );
};

export { SolvePage };
