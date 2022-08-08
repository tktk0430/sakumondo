import { useState } from "react";
import { CreatePage } from "pages/CreatePage";
import { SolvePage } from "pages/SolvePage";

const Main = () => {
  const [isSolving, setIsSolving] = useState(true);
  return (
    <>
      <div style={{ display: isSolving ? "block" : "none" }}>
        <SolvePage />
      </div>
      <div style={{ display: isSolving ? "none" : "block" }}>
        <CreatePage />
      </div>
      <div
        className="change-mode-button"
        onClick={() => setIsSolving(!isSolving)}
      >
        {isSolving ? "問題を作る" : "回答に戻る"}
      </div>
    </>
  );
};

export { Main };
