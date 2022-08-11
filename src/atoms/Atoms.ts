import { atom } from "jotai";

const soundMap = {
  null: true,
  true: true,
  false: false,
};
const enableSound = String(
  localStorage.getItem("enableSound")
) as keyof typeof soundMap;
export const enableSoundAtom = atom(soundMap[enableSound]);
