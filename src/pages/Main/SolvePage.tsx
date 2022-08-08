import { useEffect, useMemo, useState } from "react";
import { Button } from "components/Button";
import { getResult, setResult } from "utils/localStorage";
import { Modal } from "components/Modal";
import { isKatakana, isNumString } from "utils/validation";
import { convertQueryToQuestion } from "utils/convertQueryToQuestion";
import { Flex } from "components/Flex";

const ANSWER_TYPE_MAP = {
  katakana: "カタカナ",
  number: "数字",
  "": "",
};

const PANEL_MODE_TRANSITION_MAP = {
  all: "only" as const,
  only: "all" as const,
};

const q = new URLSearchParams(window.location.search).get("q");
const result = getResult(q);
const question = convertQueryToQuestion(q);

const SolvePage = () => {
  const [answer, setAnswer] = useState("");
  const [clickedIndices, setClickedIndices] = useState(result.clickedIndices);
  const [submitCount, setSubmitCount] = useState(result.submitCount);
  const [isCorrect, setIsCorrect] = useState(result.isCorrect);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"all" | "only">("only");

  const clicked = useMemo(
    () => question.sentence.map((_, idx) => clickedIndices.includes(idx)),
    [clickedIndices]
  );

  useEffect(() => {
    if (q) setResult(q, { isCorrect, submitCount, clickedIndices });
  }, [isCorrect, submitCount, clickedIndices]);

  const openChar = (idx: number) => {
    if (isCorrect) return;
    setClickedIndices((old) => [...old, idx]);
  };

  const isOpen = (idx: number) => {
    if (isCorrect && panelMode === "all") {
      return true;
    }
    return clicked[idx];
  };

  const checkAnswer = () => {
    setSubmitCount((c) => c + 1);
    if (question.answers.includes(answer)) {
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
    switch (question.answerType) {
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
            {question.sentence.length - clickedIndices.length}
          </span>
          /{question.sentence.length}
        </div>
        <hr />
        <div style={{ color: "gray", textAlign: "center" }}>
          挑戦した回数：{submitCount}回
        </div>
        <Flex justifyContent="center" margin={{ t: 1 }}>
          <Button width="middle" color="red" onClick={onCloseModal}>
            {isCorrect ? "Close" : "Retry"}
          </Button>
        </Flex>
      </Modal>
      <div className="count-container">
        <span className="red" style={{ fontSize: "2rem" }}>
          {question.sentence.length - clickedIndices.length}
        </span>
        /{question.sentence.length}
      </div>
      <div className="char-box-container">
        {question.sentence.map((char, idx) => (
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
          <Button width="middle" color="red" onClick={swithPanelOpen}>
            パネル表示切替
          </Button>
        ) : (
          <>
            {question.answerType && (
              <div className="answer-note">
                {ANSWER_TYPE_MAP[question.answerType]}で
              </div>
            )}
            <input
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onEnter}
            />
            <Flex justifyContent="center">
              <Button
                width="middle"
                color="red"
                onClick={checkAnswer}
                disabled={!isValid()}
                margin={{ t: 0.5 }}
              >
                Answer
              </Button>
            </Flex>
          </>
        )}
      </div>
    </>
  );
};

export { SolvePage };
