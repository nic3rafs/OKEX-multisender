import fs from "fs";
import path from "path";
import prompts from "prompts";
import prettyjson from "prettyjson";
import chalk from "chalk";
import * as dotenv from "dotenv";
import {
  questions,
  readFileAsArray,
  sleep,
  randomAmount,
  randomSleep,
  convertMsToTime,
} from "./src/utils.js";
import { withdraw, getWithdrawalFee } from "./src/okexApi.js";

dotenv.config();

const log = (msg) => {
  console.log(`[ ${chalk.green(convertMsToTime(Date.now()))} ] - ${msg}`);
};

const multisend = async (multisendConfig) => {
  try {
    const fee = await getWithdrawalFee(
      multisendConfig.coin,
      `${multisendConfig.coin}-${multisendConfig.chain}`
    );
    const addresses = await readFileAsArray("addresses.txt");
    for (const address of addresses) {
      const cleanedAddress = address.replace(/(\r\n|\n|\r)/gm, "");
      const amount = randomAmount(
        multisendConfig.minAmount,
        multisendConfig.maxAmount,
        6
      );
      try {
        const withdrawResponse = await withdraw(
          multisendConfig.coin,
          parseFloat(amount),
          "4",
          cleanedAddress,
          fee,
          `${multisendConfig.coin}-${multisendConfig.chain}`
        );

        if (withdrawResponse.code === "0") {
          log(
            `Successful withdraw ${amount} ${multisendConfig.coin} for (${cleanedAddress})`
          );
        }
      } catch (error) {
        console.log(`[Error] with (${cleanedAddress}) - ${error.message}`);
      }
      const sleepTime = randomSleep(
        multisendConfig.minTimeSleep,
        multisendConfig.maxTimeSleep
      );
      log(`Sleeping for ${sleepTime} ms `);
      await sleep(sleepTime);
    }
  } catch (error) {
    console.log(`[Error] - ${error.message}`);
  }
};

const main = async () => {
  let multisendConfig;
  if (process.argv[2] === "-c") {
    // Load configuration from file when -c flag is provided
    const configJson = fs.readFileSync("multisendConfig.json");
    multisendConfig = JSON.parse(configJson);
  } else {
    const questionsAnswers = await prompts(questions);
    multisendConfig = {
      coin: questionsAnswers.coinAndChain[0].trim().toUpperCase(),
      chain: questionsAnswers.coinAndChain[1].trim(),
      minAmount: parseFloat(questionsAnswers.amount[0].trim()),
      maxAmount: parseFloat(questionsAnswers.amount[1].trim()),
      // networkFee: parseFloat(questionsAnswers.networkFee),
      minTimeSleep: parseFloat(questionsAnswers.timeToSleep[0].trim()),
      maxTimeSleep: parseFloat(questionsAnswers.timeToSleep[1].trim()),
    };
  }

  console.log("\n" + prettyjson.render(multisendConfig) + "\n");
  const confirm = await prompts({
    type: "confirm",
    name: "value",
    message: "Do you want to continue?",
    initial: false,
  });

  if (confirm.value) {
    console.log("\nStarting...");
    multisend(multisendConfig);
  } else {
    process.exit(0);
  }
};

main();
