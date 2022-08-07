import { useEffect, useState } from "react";
import { Button } from "./Button";
import { initialQuestion } from "./const";
import { decode } from "./crypto";
import { Modal } from "./Modal";
import { isKatakana, isNumString } from "./validation";

const ANSWER_TYPE_MAP = {
  katakana: "カタカナ",
  number: "数字",
  "": "",
};

const PANEL_MODE_TRANSITION_MAP = {
  all: "only" as const,
  only: "all" as const,
};

const SolvePage = () => {
  const [chars, setChars] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerType, setAnswerType] =
    useState<keyof typeof ANSWER_TYPE_MAP>("");
  const [answer, setAnswer] = useState("");
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);
  const [submitCount, setSubmitCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelMode, setPanelMode] =
    useState<keyof typeof PANEL_MODE_TRANSITION_MAP>("only");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const { sentence, answerType, answers } = JSON.parse(decode(q));
      setChars(sentence.split(""));
      setAnswerType(answerType);
      setAnswers(answers.split("\n"));
    } else {
      setChars(initialQuestion.sentence);
      setAnswerType(initialQuestion.answerType);
      setAnswers(initialQuestion.answers);
    }
  }, []);

  const openChar = (idx: number) => {
    if (isCorrect) return;
    setClickedIndices((old) => [...old, idx]);
  };

  const isOpen = (idx: number) => {
    if (isCorrect && panelMode === "all") {
      return true;
    }
    return clickedIndices.includes(idx);
  };

  const checkAnswer = () => {
    setSubmitCount((c) => c + 1);
    if (answers.includes(answer)) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setIsModalOpen(true);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter" || !isValid()) return;
    checkAnswer();
  };

  const swithPanelOpen = () => {
    setPanelMode((mode) => PANEL_MODE_TRANSITION_MAP[mode]);
  };

  const isValid = () => {
    switch (answerType) {
      case "katakana":
        return isKatakana(answer);
      case "number":
        return isNumString(answer);
      default:
        return false;
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    if (isCorrect) setPanelMode("all");
  };

  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="red" style={{ fontSize: "2rem", textAlign: "center" }}>
          {isCorrect ? "正解！" : "不正解..."}
        </div>
        <div className="count-container">
          <span className="red" style={{ fontSize: "2rem" }}>
            {chars.length - clickedIndices.length}
          </span>
          /{chars.length}
        </div>
        <hr />
        <div style={{ color: "gray", textAlign: "center" }}>
          挑戦した回数：{submitCount}回
        </div>
        <div className="post-button" onClick={onCloseModal}>
          {isCorrect ? "Close" : "Retry"}
        </div>
      </Modal>
      <div className="count-container">
        <span className="red" style={{ fontSize: "2rem" }}>
          {chars.length - clickedIndices.length}
        </span>
        /{chars.length}
      </div>
      <div className="char-box-container">
        {chars.map((char, idx) => (
          <div className="char-box" key={idx}>
            {isOpen(idx) ? (
              <div className="char-box-inner open">{char}</div>
            ) : (
              <div
                onClick={() => openChar(idx)}
                className="char-box-inner closed"
                style={{ cursor: isCorrect ? "default" : "pointer" }}
              >
                {idx + 1}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        {isCorrect ? (
          <Button className="post-button" onClick={swithPanelOpen}>
            パネル表示切替
          </Button>
        ) : (
          <>
            {answerType && (
              <div className="answer-note">{ANSWER_TYPE_MAP[answerType]}で</div>
            )}
            <input
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onEnter}
            />
            <Button
              className="post-button"
              onClick={checkAnswer}
              disabled={!isValid()}
            >
              Answer
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export { SolvePage };
