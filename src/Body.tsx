import { useState } from "react";
import "./App.css";
import { CreatePage } from "./CreatePage";
import { SolvePage } from "./SolvePage";

const Body = () => {
  const [isSolving, setIsSolving] = useState(true);
  return (
    <>
      {isSolving ? <SolvePage /> : <CreatePage />}
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
