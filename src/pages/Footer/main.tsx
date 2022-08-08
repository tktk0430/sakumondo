import { Button } from "components/Button";
import { Flex } from "components/Flex";
import { Modal } from "components/Modal";
import gitIcon from "images/github.png";
import { useState } from "react";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Flex justifyContent="center" margin={{ t: 1 }}>
        <Button
          style={{ cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        >
          遊び方
        </Button>
      </Flex>
      <div className="external-links">
        <a
          href="https://github.com/tktk0430/sakumondo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={gitIcon} alt="github link" />
        </a>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{ content: { height: "18rem" } }}
      >
        <div className="red" style={{ fontSize: "2rem", textAlign: "center" }}>
          遊び方
        </div>
        <ol style={{ lineHeight: "1.5rem" }}>
          <li>パネルをタップして問題文の文字を開きます。</li>
          <li>
            クイズの答えが分かったら、解答欄に入力して「Answer」をタップしてください。
            3回まで解答できます。
          </li>
          <li>
            開かなかった文字数が得点になります。できるだけ文字を開けずにクイズに正解しましょう!
          </li>
        </ol>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            className="red-button"
            onClick={() => setIsModalOpen(false)}
            width="middle"
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { Footer };
