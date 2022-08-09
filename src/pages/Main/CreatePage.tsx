import { useState } from "react";
import { Button } from "components/Button";
import { encode } from "utils/crypto";
import { isKatakana, isNumString } from "utils/validation";
import { Flex } from "components/Flex";
import { LineIcon, LineShareButton } from "./LineShare";

const MAX_SENTENCE_LENGTH = 60;
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

  const isValid = () => {
    if (
      sentence.length > MAX_SENTENCE_LENGTH ||
      sentence.length === 0 ||
      answers.length === 0
    ) {
      return false;
    }
    const answersArr = answers.split("\n").filter((v) => v !== "");
    switch (answerType) {
      case "katakana":
        return answersArr.every(isKatakana);
      case "number":
        return answersArr.every(isNumString);
      default:
        return false;
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sentence">問題文 ({MAX_SENTENCE_LENGTH}字まで)</label>
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
      <Flex justifyContent="center">
        <Button
          color="red"
          width="middle"
          onClick={() => setURL(createURL())}
          disabled={!isValid()}
        >
          作成
        </Button>
      </Flex>
      <div
        style={{
          marginTop: "1rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </div>
      <Flex justifyContent="right" margin={{ t: 0.5 }}>
        {url && (
          <>
            <LineShareButton url={url} title="LINEで送る">
              <LineIcon size={30} round />
            </LineShareButton>
            <button
              className="non-style-button"
              style={{
                color: "gray",
                textDecoration: "underline",
                marginLeft: "1rem",
              }}
              onClick={() => navigator.clipboard.writeText(url)}
            >
              Copy
            </button>
          </>
        )}
      </Flex>
    </>
  );
};

export { CreatePage };
