const INITIAL_RESULT = {
  isCorrect: false,
  clickedIndices: [] as number[],
  submitCount: 0,
};

const getAllResult = (): { [key: string]: typeof INITIAL_RESULT } => {
  const result = localStorage.getItem("result");
  return result ? JSON.parse(result) : {};
};

export const getResult = (key: string | null): typeof INITIAL_RESULT => {
  const allResult = getAllResult();
  if (key && key in allResult) {
    return allResult[key];
  }
  return INITIAL_RESULT;
};

export const setResult = (key: string, value: typeof INITIAL_RESULT) => {
  const allResult = getAllResult();
  const newResult = { ...allResult, [key]: value };
  localStorage.setItem("result", JSON.stringify(newResult));
};
