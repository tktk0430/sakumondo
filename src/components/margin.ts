export type TMargin = { t?: number; r?: number; b?: number; l?: number };

export const marginStyle = (m?: TMargin) => {
  if (m === undefined) return {};
  return {
    marginTop: `${m.t}rem`,
    marginRight: `${m.r}rem`,
    marginBottom: `${m.b}rem`,
    marginLeft: `${m.l}rem`,
  };
};
