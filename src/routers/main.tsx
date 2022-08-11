import { Home } from "pages/Home";
import { Short } from "pages/Short";
import { Route, Routes } from "react-router-dom";

export const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="short" element={<Short />} />
    </Routes>
  );
};
