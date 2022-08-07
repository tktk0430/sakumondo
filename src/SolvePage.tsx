import { useEffect, useState } from "react";
import { initialQuestion } from "./const";
import { decode } from "./crypto";
import { Modal } from "./Modal";

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
  const [chars, setChars] = useState<
    { value: string; isOpen: boolean; isClicked: boolean }[]
  >([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerType, setAnswerType] =
    useState<keyof typeof ANSWER_TYPE_MAP>("");
  const [answer, setAnswer] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelMode, setPanelMode] =
    useState<keyof typeof PANEL_MODE_TRANSITION_MAP>("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const { sentence, answerType, answers } = JSON.parse(decode(q));
      setChars(
        sentence
          .split("")
          .map((value: string) => ({ value, isOpen: false, isClicked: false }))
      );
      setAnswerType(answerType);
      setAnswers(answers.split("\n"));
    } else {
      setChars(initialQuestion.sentence);
      setAnswerType(initialQuestion.answerType);
      setAnswers(initialQuestion.answers);
    }
  }, []);

  const openChar = (idx: number) => {
    const newChars = chars.map((v, i) =>
      i === idx ? { ...v, isOpen: true, isClicked: true } : v
    );
    setChars(newChars);
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

  const onCloseModal = () => {
    setIsModalOpen(false);
    if (isCorrect) {
      const newChars = chars.map((v) => ({ ...v, isOpen: true }));
      setChars(newChars);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    checkAnswer();
  };

  const swithPanelOpen = () => {
    if (panelMode === "all") {
      const newChars = chars.map((v) => ({ ...v, isOpen: v.isClicked }));
      setChars(newChars);
    } else {
      const newChars = chars.map((v) => ({ ...v, isOpen: true }));
      setChars(newChars);
    }
    setPanelMode((mode) => PANEL_MODE_TRANSITION_MAP[mode]);
  };

  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="red" style={{ fontSize: "2rem", textAlign: "center" }}>
          {isCorrect ? "正解！" : "不正解..."}
        </div>
        <div className="count-container">
          <span className="red" style={{ fontSize: "2rem" }}>
            {chars.filter((c) => !c.isClicked).length}
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
          {chars.filter((c) => !c.isClicked).length}
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
          onKeyDown={onEnter}
        />
        {isCorrect ? (
          <div className="post-button" onClick={swithPanelOpen}>
            パネル表示切替
          </div>
        ) : (
          <div className="post-button" onClick={checkAnswer}>
            Answer
          </div>
        )}
      </div>
    </>
  );
};

export { SolvePage };
