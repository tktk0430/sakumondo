import { CreatePage } from "pages/Home/CreatePage";
import { SolvePage } from "pages/Home/SolvePage";
import { Button } from "components/Button";
import { isValidQuery } from "utils/handleQuery";
import { Flex } from "components/Flex";
import { Link, useSearchParams } from "react-router-dom";

const MODE_MAPPER = {
  solve: "create",
  create: "solve",
};

const Home = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q");
  const mode = (params.get("mode") || "solve") as keyof typeof MODE_MAPPER;

  return (
    <>
      <div style={{ display: mode === "solve" ? "block" : "none" }}>
        {isValidQuery(q) ? (
          <SolvePage />
        ) : (
          <Flex justifyContent="center">不正なURLです</Flex>
        )}
      </div>
      <div style={{ display: mode === "create" ? "block" : "none" }}>
        <CreatePage />
      </div>
      <Button
        color="green"
        width="full"
        onClick={() =>
          setParams(
            q ? { q, mode: MODE_MAPPER[mode] } : { mode: MODE_MAPPER[mode] }
          )
        }
        margin={{ t: 2 }}
      >
        {mode === "solve" ? "問題を作る" : "回答に戻る"}
      </Button>
    </>
  );
};

export { Home };
