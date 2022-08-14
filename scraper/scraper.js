import dayjs from "dayjs";
import { encode } from "../src/utils/crypto";
const puppeteer = require("puppeteer");
const fs = require("fs");

var isSucceeded = false;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const INSTRUCTION_TO_ANSWER_TYPE = {
  カタカナで: "katakana",
  数字で: "number",
};
const hoge = async (date) => {
  console.log(date, "date");
  let result = null;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.url() === "https://mondo.quizknock.com/script.js") {
      const contents = fs.readFileSync("scraper/mondo.js", "utf-8");
      request.respond({
        status: 200,
        contentType: "application/javascript; charset=utf-8",
        body: contents,
      });
    } else {
      request.continue();
    }
  });

  page.on("console", (consoleObj) => {
    try {
      const json = JSON.parse(consoleObj.text());
      if (json.date === 0 || isSucceeded) return;
      isSucceeded = true;
      result = json;
    } catch {}
  });
  await page.goto(`https://mondo.quizknock.com/?date=${date}&indices=0`);
  await page.waitForTimeout(2000);

  await browser.close();
  return result;
};

const fuga = async (date) => {
  const result = await hoge(date);
  const question = result
    ? {
        sentence: result.question.join(""),
        answerType: INSTRUCTION_TO_ANSWER_TYPE[result.instruction],
        answers: result.answers.join("\n"),
      }
    : null;

  if (question) {
    console.log(date, result);
    const encoded = encode(question);
    return { [date]: encoded };
  }
  return {};
};

const piyo = async (start, end) => {
  const kakomon = JSON.parse(fs.readFileSync("scraper/kakomon.json", "utf-8"));
  const existingDays = Object.keys(kakomon);

  const startDate = dayjs(start);
  const endDate = dayjs(end);

  for (let date = startDate; date <= endDate; date = date.add(1, "day")) {
    const target = date.format("YYYY-MM-DD");
    if (target in existingDays) continue;
    const result = await fuga(target);
    await sleep(5000);
  }
};
piyo("2022-05-19", "2022-05-21");

//   page.on("response", async (response) => {
//     const url = response.url();
//     if (url === "https://mondo.quizknock.com/script.js") {
//       console.log("response!");
//       const body = await response.text();
//       fs.writeFile("scraper/mondo.js", body, (err) => {
//         if (err) throw err;
//         console.log("正常に書き込みが完了しました");
//       });
//     }
//   });
