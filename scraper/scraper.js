import dayjs from "dayjs";
import { encode } from "../src/utils/crypto";
import fetch from "node-fetch";

const puppeteer = require("puppeteer");
const fs = require("fs");

const instructionToAnswerType = (instruction) => {
  if (instruction.includes("カタカナ")) {
    return "katakana";
  }
  if (instruction.includes("数字")) {
    return "number";
  }
  throw Error("未知の解答形式です");
};

const hoge = async (date) => {
  var isSucceeded = false;
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
        answerType: instructionToAnswerType(result.instruction),
        answers: result.answers.join("\n"),
      }
    : null;

  if (question) {
    const encoded = encode(question);
    return { [date]: encoded };
  } else {
    return {};
  }
};

export const piyo = async (start, end) => {
  const kakomon = JSON.parse(fs.readFileSync("scraper/kakomon.json", "utf-8"));
  const existingDays = Object.keys(kakomon);

  const startDate = dayjs(start);
  const endDate = end ? dayjs(end) : startDate;
  for (let date = startDate; date <= endDate; date = date.add(1, "day")) {
    const target = date.format("YYYY-MM-DD");
    if (existingDays.includes(target)) continue;
    console.log(target);
    const result = await fuga(target);
    Object.assign(kakomon, result);
  }
  fs.writeFileSync("scraper/kakomon.json", JSON.stringify(kakomon), () => {});
};

export const addTodaysQuestionToGAS = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  const question = await fuga(today);
  const addKakomonURL =
    "https://script.google.com/macros/s/AKfycbwm0TJOdZlRKIzousFzv130yI5lRlCUSZAeAzYtPiFCOdCQ3iFj932-Y_b55tRHinF9/exec";
  const firstResp = await fetch(addKakomonURL, {
    method: "POST",
    body: JSON.stringify(question),
  });
  await firstResp.text();
};

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
