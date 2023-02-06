import prompts from "prompts";
import ccxt from "ccxt";
import * as dotenv from "dotenv";
import prettyjson from "prettyjson";
import chalk from "chalk";
dotenv.config();
import {
  questions,
  readFileAsArray,
  sleep,
  randomAmount,
  randomSleep,
  convertMsToTime,
} from "./utils.js";

const ccxtConfig = {
  enableRateLimit: true,
  apiKey: process.env.OKEX_ACCESS_KEY,
  secret: process.env.OKEX_SECRET_KEY,
  password: process.env.OKEX_ACCESS_PASSPHRASE,
};

export const log = (msg) => {
  console.log(`[ ${chalk.green(convertMsToTime(Date.now()))} ] - ${msg}`);
};

const multisend = async (multisendConfig) => {
  const okex = new ccxt.okex(ccxtConfig);

  try {
    const addresses = await readFileAsArray("addresses.txt");
    for (const address of addresses) {
      const amount = randomAmount(
        multisendConfig.minAmount,
        multisendConfig.maxAmount,
        multisendConfig.digitsAfterPeriod
      );
      try {
        const withdrawResponse = await okex.withdraw(
          multisendConfig.coin,
          amount,
          address,
          {
            fee: multisendConfig.networkFee,
            network: multisendConfig.network,
            password: ccxtConfig.password,
          }
        );

        if (withdrawResponse.info.wdId) {
          log(
            `Succesfull withdraw ${amount} ${multisendConfig.coin} for (${address})`
          );
        }
      } catch (error) {
        console.log(`[Error] with (${address}) - ${error}`);
      }
      const sleepTime = randomSleep(
        multisendConfig.minTimeSleep,
        multisendConfig.maxTimeSleep
      );
      log(`Sleeping for ${sleepTime} ms `);
      await sleep(sleepTime);
    }
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const questionsAnswers = await prompts(questions);
  const multisendConfig = {
    coin: questionsAnswers.coinAndChain[0].trim().toUpperCase(),
    chain: questionsAnswers.coinAndChain[1].trim().toUpperCase(),
    minAmount: +questionsAnswers.amount[0].trim(),
    maxAmount: +questionsAnswers.amount[1].trim(),
    networkFee: +questionsAnswers.networkFee,
    minTimeSleep: +questionsAnswers.timeToSleep[0].trim(),
    maxTimeSleep: +questionsAnswers.timeToSleep[1].trim(),
    digitsAfterPeriod: 4,
  };
  console.log('\n' + prettyjson.render(multisendConfig) + '\n');
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
