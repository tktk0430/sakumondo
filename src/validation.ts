export const isKatakana = (s: string) => {
  if (s === "") return false;
  return !!s.match(/^[ァ-ヶー　]+$/);
};

export const isNumString = (s: string) => {
  if (s === "") return false;
  return !isNaN(Number(s));
};
