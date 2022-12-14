import React, { Fragment, useMemo, useState } from "react";
import { Button } from "components/Button";
import { getResult, setResultFor } from "utils/localStorage";
import { isKatakana, isNumString } from "utils/validation";
import { convertQueryToQuestion } from "utils/handleQuery";
import { Flex } from "components/Flex";
import { useAtom } from "jotai";
import { enableSoundAtom } from "atoms/Atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ANSWER_TYPE_MAP = {
  katakana: "カタカナ",
  number: "数字",
  "": "",
};

const PANEL_MODE_TRANSITION_MAP = {
  all: "only" as const,
  only: "all" as const,
};
new Audio(require("./sound/success.wav"));
new Audio(require("./sound/miss.wav"));

const SolvePage = () => {
  const q = new URLSearchParams(window.location.search).get("q");
  const result = getResult(q);
  const question = convertQueryToQuestion(q);
  const [answer, setAnswer] = useState(result.yourAnswer);
  const [clickedIndices, setClickedIndices] = useState(result.clickedIndices);
  const [submitCount, setSubmitCount] = useState(result.submitCount);
  const [isCorrect, setIsCorrect] = useState(result.isCorrect);
  const [panelMode, setPanelMode] = useState<"all" | "only">("all");
  const enableSound = useAtom(enableSoundAtom)[0];

  const clicked = useMemo(
    () => question.sentence.map((_, idx) => clickedIndices.includes(idx)),
    [clickedIndices, question.sentence]
  );

  const openChar = (idx: number) => {
    if (isCorrect) return;
    const newIndices = [...clickedIndices, idx];
    setClickedIndices(newIndices);
    setResultFor(q, "clickedIndices", newIndices);
  };

  const isOpen = (idx: number) => {
    if (isCorrect && panelMode === "all") {
      return true;
    }
    return clicked[idx];
  };

  const checkAnswer = () => {
    const newCount = submitCount + 1;
    setSubmitCount(newCount);
    setResultFor(q, "submitCount", submitCount + 1);
    if (question.answers.includes(answer)) {
      toast.success("🎉！正解！🎉");
      setIsCorrect(true);
      if (enableSound) new Audio(require("./sound/success.wav")).play();
      setResultFor(q, "yourAnswer", answer);
      setResultFor(q, "isCorrect", true);
    } else {
      toast.error(`不正解...(${newCount} Miss)`);
      setIsCorrect(false);
      if (enableSound) new Audio(require("./sound/miss.wav")).play();
    }
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

  return (
    <>
      <Flex
        justifyContent="center"
        margin={{ t: 1, b: 0.5 }}
        style={{ position: "relative" }}
      >
        <div>
          <span className="red" style={{ fontSize: "2rem" }}>
            {question.sentence.length - clickedIndices.length}
          </span>
          /{question.sentence.length}
        </div>
        {isCorrect && (
          <>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 3,
                textAlign: "right",
              }}
            >
              <div
                className="bg-green"
                style={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  width: "5rem",
                  borderRadius: "0.2rem",
                  height: "1.2rem",
                  lineHeight: "1.2rem",
                  fontWeight: "bolder",
                }}
              >
                CLEAR
              </div>
              <div>
                {submitCount === 1 ? (
                  <div style={{ color: "#918d40", fontWeight: "bold" }}>
                    No Miss !
                  </div>
                ) : (
                  <div>{submitCount - 1} Miss</div>
                )}
              </div>
            </div>
          </>
        )}
      </Flex>
      <div className="char-box-container">
        {question.sentence.map((char, idx) => (
          <Fragment key={idx}>
            {isOpen(idx) ? (
              <div className="char-box open">{char}</div>
            ) : (
              <div
                onClick={() => openChar(idx)}
                className="char-box closed"
                style={{ cursor: isCorrect ? "default" : "pointer" }}
              >
                {idx + 1}
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        {isCorrect ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem" }} className="red">
              A. {question.answers.join("、")}
            </div>
            <Flex justifyContent="center" margin={{ t: 0.5 }}>
              <Button
                width="middle"
                className="red"
                style={{ border: "2px solid hsl(0deg 50% 50%)" }}
                onClick={swithPanelOpen}
              >
                {panelMode === "all" ? "自分の結果を見る" : "全て開く"}
              </Button>
            </Flex>
          </div>
        ) : (
          <>
            {question.answerType && (
              <div className="answer-note">
                <FontAwesomeIcon icon={faTriangleExclamation} />{" "}
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
