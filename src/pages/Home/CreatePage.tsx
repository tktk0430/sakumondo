import { useState } from "react";
import { Button } from "components/Button";
import { encode } from "utils/crypto";
import { isKatakana, isNumString } from "utils/validation";
import { Flex } from "components/Flex";
import { LineIcon, LineShareButton } from "./LineShare";
import { shortenURL } from "api/gas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "components/Modal";
import { toast } from "react-toastify";

const MAX_SENTENCE_LENGTH = 48;
const CreatePage = () => {
  const [sentence, setSentence] = useState("");
  const [answerType, setAnswerType] = useState("katakana");
  const [answers, setAnswers] = useState("");
  const [url, setURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [openURLModal, setOpenURLModal] = useState(false);

  const createURL = async () => {
    setLoading(true);
    try {
      const data = { sentence, answerType, answers };
      const encodePath = encode(data);
      const resp = await fetch(shortenURL, {
        method: "POST",
        body: JSON.stringify({ q: encodePath }),
      });
      const result = await resp.text();
      setOpenURLModal(true);
      return `${window.location.href.split("?")[0]}short?key=${result}`;
    } finally {
      setLoading(false);
    }
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

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    toast.info("URLをコピーしました");
  };

  const reset = () => {
    setSentence("");
    setAnswerType("katakana");
    setAnswers("");
    setURL("");
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Flex>
          <label htmlFor="sentence">問題文 ({MAX_SENTENCE_LENGTH}字まで)</label>
          {sentence.length > MAX_SENTENCE_LENGTH && (
            <div
              style={{
                justifyContent: "center",
                marginLeft: "0.5rem",
              }}
              className="red"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
              文字数が長すぎます！({sentence.length}/{MAX_SENTENCE_LENGTH})
            </div>
          )}
        </Flex>
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
      <Flex justifyContent="space-between">
        {url ? (
          <Button
            color="red"
            width="middle"
            onClick={async () => setOpenURLModal(true)}
          >
            共有する
          </Button>
        ) : (
          <Button
            color="red"
            width="middle"
            onClick={async () => setURL(await createURL())}
            disabled={!isValid() || loading}
          >
            {loading ? "作成中です..." : "作成"}
          </Button>
        )}
        <Button
          width="middle"
          className="red"
          style={{ border: "2px solid hsl(0deg 50% 50%)" }}
          onClick={reset}
        >
          リセット
        </Button>
      </Flex>

      <Modal isOpen={openURLModal} style={{ content: { height: "14rem" } }}>
        <div style={{ height: "100%" }}>
          <div
            className="red"
            style={{ fontSize: "2rem", textAlign: "center" }}
          >
            問題URL
          </div>
          <div style={{ textAlign: "center" }}>{url}</div>
          <hr />
          <Flex justifyContent="space-evenly" style={{ margin: "0 auto" }}>
            <LineShareButton url={url} title="LINEで送る">
              <LineIcon size="3rem" round />
            </LineShareButton>
            <button className="button-reset" onClick={onCopy}>
              <FontAwesomeIcon icon={faCopy} size="3x" />
            </button>
          </Flex>
          <Button
            color="red"
            width="middle"
            onClick={() => setOpenURLModal(false)}
            style={{ margin: "5px auto" }}
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { CreatePage };
