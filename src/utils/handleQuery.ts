import { decode } from "./crypto";

const EXAMPLE_SENTENCE = "この問題の文字数は？";

export const initialQuestion = {
  sentence: EXAMPLE_SENTENCE.split(""),
  answerType: "number" as "number" | "katakana",
  answers: [String(EXAMPLE_SENTENCE.length)],
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
        answers: answers.split("\n"),
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
