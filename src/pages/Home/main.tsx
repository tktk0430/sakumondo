import { useState } from "react";
import { CreatePage } from "pages/Home/CreatePage";
import { SolvePage } from "pages/Home/SolvePage";
import { Button } from "components/Button";
import { isValidQuery } from "utils/handleQuery";
import { Flex } from "components/Flex";

const q = new URLSearchParams(window.location.search).get("q");

const Home = () => {
  const [isSolving, setIsSolving] = useState(true);
  return (
    <>
      <div style={{ display: isSolving ? "block" : "none" }}>
        {isValidQuery(q) ? (
          <SolvePage />
        ) : (
          <Flex justifyContent="center">不正なURLです</Flex>
        )}
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

export { Home };
