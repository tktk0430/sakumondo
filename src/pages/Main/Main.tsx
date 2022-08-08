import { useState } from "react";
import { CreatePage } from "pages/Main/CreatePage";
import { SolvePage } from "pages/Main/SolvePage";
import { Button } from "components/Button";

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
      <Button
        color="green"
        width="full"
        onClick={() => setIsSolving(!isSolving)}
        margin={{ t: 2 }}
      >
        {isSolving ? "問題を作る" : "回答に戻る"}
      </Button>
    </>
  );
};

export { Main };
