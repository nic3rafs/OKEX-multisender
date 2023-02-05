import ccxt from "ccxt";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

//CONFIG
const coin = "BNB";
const network = "BSC";
const amount = 0.01;
const networkFee = 0.002

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

const main = async () => {
  const okex = new ccxt.okex(ccxtConfig);
  try {
    const addresses = await readFileAsArray("addresses.txt");
    for (const address of addresses) {
      try {
        const withdrawResponse = await okex.withdraw(coin, amount, address, {
          fee: networkFee,
          network: network,
          password: ccxtConfig.password,
        });

        if (withdrawResponse.info.wdId) {
          console.log(`Succesfull withdraw for (${address})`);
        }
      } catch (error) {
        console.log(`[Error] with (${address}) - ${error}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
main();
