const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
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
  page.on("console", (consoleObj) => {
    console.log(consoleObj.text());
    try {
      const json = JSON.parse(consoleObj.text());
      if (json.date === 0) return;
      console.log("日付", json.date);
      console.log("問題", json.question.join(""));
      console.log("形式", json.instruction);
      console.log("解答", json.answers.join(", "));
    } catch {}
  });
  await page.goto("https://mondo.quizknock.com/?date=2022-08-14&indices=0");
  //   await page.waitForSelector("#play-button");
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
