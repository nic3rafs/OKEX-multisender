import ccxt from "ccxt";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

//CONFIG
const coin = "ETH"; // ETH for ETH
const network = "ETH"; // ETH for ETH, BSC for BinanceSmartChain
const networkFee = 0.00096;

const minTimeSleep = 10000; // time in milliseconds
const maxTimeSleep = 15000;

const minAmount = 0.01;
const maxAmount = 0.02;
const digitsAfterPeriod = 4; // How much digits to have after period in send amount
//================================================================

const ccxtConfig = {
  enableRateLimit: true,
  apiKey: process.env.OK_ACCESS_KEY,
  secret: process.env.OKEX_SECRET_KEY,
  password: process.env.OK_ACCESS_PASSPHRASE,
};

const readFileAsArray = async (fileName) => {
  try {
    const fileContent = await fs.promises.readFile(fileName, "utf-8");
    console.log(`File ${fileName} is read successfully.\n`);
    return fileContent.split("\n");
  } catch (error) {
    console.error(`Error reading file ${fileName}: ${error}`);
    return null;
  }
};
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function randomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(digitsAfterPeriod);
}
function randomSleep(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const main = async () => {
  const okex = new ccxt.okex(ccxtConfig);

  try {
    const addresses = await readFileAsArray("addresses.txt");
    for (const address of addresses) {
      const amount = randomAmount(minAmount, maxAmount);
      try {
        const withdrawResponse = await okex.withdraw(coin, amount, address, {
          fee: networkFee,
          network: network,
          password: ccxtConfig.password,
        });

        if (withdrawResponse.info.wdId) {
          console.log(`Succesfull withdraw ${amount}${coin} for (${address})`);
        }
      } catch (error) {
        console.log(`[Error] with (${address}) - ${error}`);
      }
      const sleepTime = randomSleep(minTimeSleep, maxTimeSleep);
      console.log(`Sleeping for ${sleepTime} ms `);
      await sleep(sleepTime);
    }
  } catch (error) {
    console.log(error);
  }
};
main();
