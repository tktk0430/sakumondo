import { useState } from "react";

const CreatePage = () => {
  const [sentence, setSentence] = useState("");
  const [answerType, setAnswerType] = useState("katakana");
  const [answers, setAnswers] = useState("");

  const createURL = () => {
    const data = { sentence, answerType, answers };
    console.log(data);
    console.log(window.location.origin);
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
      <div className="post-button" onClick={createURL}>
        作成
      </div>
    </>
  );
};

export { CreatePage };
