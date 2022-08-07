const EXAMPLE_SENTENCE =
  "『問題を作る』からmondo風の問題を自作できます。色々作ってね。ドラゴンボールの最終巻は何巻？";

export const initialQuestion = {
  sentence: EXAMPLE_SENTENCE.split(""),
  answerType: "number" as const,
  answers: ["42"],
};
