import { useState } from "react";
import { encode } from "./crypto";

const CreatePage = () => {
  const [sentence, setSentence] = useState("");
  const [answerType, setAnswerType] = useState("katakana");
  const [answers, setAnswers] = useState("");
  const [url, setURL] = useState("");

  const createURL = () => {
    const data = { sentence, answerType, answers };
    const encodePath = encode(data);
    return `${window.location.href.split("?")[0]}?q=${encodePath}`;
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sentence">問題文</label>
        <textarea
          id="sentence"
          className="create-input"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="answer-type">解答形式</label>
        <select
          id="answer-type"
          className="create-select"
          value={answerType}
          onChange={(e) => setAnswerType(e.target.value)}
        >
          <option value="katakana">カタカナ</option>
          <option value="number">数字</option>
        </select>
      </div>
      <div>
        <label htmlFor="answers">解答（複数ある場合は改行で区切る）</label>
        <textarea
          id="answers"
          className="create-input"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
        />
      </div>
      <div className="post-button" onClick={() => setURL(createURL())}>
        作成
      </div>
      <div>問題URL</div>
      <textarea
        className="create-input"
        value={url}
        disabled
        placeholder="ここにURLが生成されます"
      />
      <div style={{ display: "flex", justifyContent: "right" }}>
        {url && (
          <button
            className="non-style-button"
            style={{ color: "gray", textDecoration: "underline" }}
            onClick={() => navigator.clipboard.writeText(url)}
          >
            Copy
          </button>
        )}
      </div>
    </>
  );
};

export { CreatePage };
