import { decode } from "./crypto";

const EXAMPLE_SENTENCE =
  "『問題を作る』からmondo風の問題を自作できます。色々作ってね。ドラゴンボールの最終巻は何巻？";

export const initialQuestion = {
  sentence: EXAMPLE_SENTENCE.split(""),
  answerType: "number" as "number" | "katakana",
  answers: ["42"],
};

export const convertQueryToQuestion = (
  q: string | null
): typeof initialQuestion => {
  if (q) {
    try {
      const { sentence, answerType, answers } = JSON.parse(decode(q));
      return {
        sentence: sentence.split(""),
        answerType,
        answers,
      };
    } catch {
      return initialQuestion;
    }
  } else {
    return initialQuestion;
  }
};

export const isValidQuery = (q: string | null) => {
  if (q === null) return true;
  try {
    JSON.parse(decode(q));
    return true;
  } catch {
    return false;
  }
};
