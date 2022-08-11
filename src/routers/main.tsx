import { Main } from "pages/Main/Main";
import { Short } from "pages/Short";
import { Route, Routes } from "react-router-dom";

export const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="short/:key" element={<Short />} />
    </Routes>
  );
};
