import { useState } from "react";
import "./App.css";
import { CreatePage } from "./CreatePage";
import { SolvePage } from "./SolvePage";

const Body = () => {
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

export default Body;
