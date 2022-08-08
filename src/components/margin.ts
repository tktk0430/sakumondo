export type TMargin = { t?: number; r?: number; b?: number; l?: number };

export const marginStyle = (m?: TMargin) => ({
  marginTop: m && `${m.t}rem`,
  marginRight: m && `${m.r}rem`,
  marginBottom: m && `${m.b}rem`,
  marginLeft: m && `${m.l}rem`,
});
