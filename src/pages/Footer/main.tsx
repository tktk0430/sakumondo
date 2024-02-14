import { Button } from "components/Button";
import { Flex } from "components/Flex";
import { Modal } from "components/Modal";
import gitIcon from "images/github.png";
import twitterIcon from "images/twitter.png";
import { useState } from "react";

const isVisted = () => {
  const v = localStorage.getItem("isVisited");
  setTimeout(() => localStorage.setItem("isVisited", "true"), 500);
  return !!v;
};

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(!isVisted());

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
          href="https://forms.gle/Ev3L6eagYnhdsLPb7"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>バグ報告・機能追加要望など</span>
        </a>
        <Flex justifyContent="space-evenly">
          <a
            href="https://github.com/tktk0430/sakumondo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={gitIcon} alt="github link" height="32px" />
          </a>
          <a
            href="https://twitter.com/fibonaccci40"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitterIcon} alt="twitter link" height="32px" />
          </a>
        </Flex>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{ content: { height: "20rem" } }}
      >
        <div className="red" style={{ fontSize: "2rem", textAlign: "center" }}>
          遊び方
        </div>
        <ol style={{ lineHeight: "1.5rem" }}>
          <li>パネルをタップして問題文の文字を開きます。</li>
          <li>
            クイズの答えが分かったら、解答欄に入力して「Answer」をタップしてください。
          </li>
          <li>
            開かなかった文字数が得点になります。できるだけ文字を開けずにクイズに正解しましょう!
          </li>
        </ol>
        <hr />
        <h4 style={{ textAlign: "center" }}>お問合せ</h4>
        <div>
          当サイトは個人が運営するファンサイトであり、本家
          <a href="https://mondo.quizknock.com/">mondo</a>
          の運営元であるQuizKnock様とは一切関係ありません。
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            width="middle"
            color="red"
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { Footer };
