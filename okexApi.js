import axios from "axios";
import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OKEX_ACCESS_KEY;
const secretKey = process.env.OKEX_SECRET_KEY;
const passphrase = process.env.OKEX_ACCESS_PASSPHRASE;

const getRequestHeaders = (method, requestPath, body = "") => {
  const timestamp = new Date().toISOString();
  const sign = createSignature(timestamp, method, requestPath, body);

  return {
    "OK-ACCESS-KEY": apiKey,
    "OK-ACCESS-SIGN": sign,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": passphrase,
    "Content-Type": "application/json",
  };
};

function createSignature(timestamp, method, requestPath, body = "") {
  const prehash = timestamp + method + requestPath + body;
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(prehash, secretKey)
  );
  return signature;
}

const getAccountBalance = async () => {
  const method = "GET";
  const requestPath = "/api/v5/asset/balances";
  const headers = getRequestHeaders(method, requestPath);

  try {
    const response = await axios.get("https://www.okex.com" + requestPath, {
      headers,
    });
    return response.data;
  } catch (error) {
    return console.error("Error:", error.response.data);
  }
};

const getSingleCurrencie = async (currency) => {
  const method = "GET";
  const requestPath = `/api/v5/asset/currencies?ccy=${currency}`;
  const headers = getRequestHeaders(method, requestPath);

  try {
    const response = await axios.get("https://www.okex.com" + requestPath, {
      headers,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return console.error("Error:", error.response.data);
  }
};

// const currency = await getSingleCurrencie("ETH");
// if (currency.code === "0") {
//   for (let item of currency.data) {
//     if (item.chain === "ETH-Arbitrum one") {
//       console.log(item);
//     }
//   }
// }
// getAccountBalance()

async function withdraw(
  ccy,
  amt,
  dest,
  toAddr,
  fee,
  chain,
  areaCode = "",
  clientId = ""
) {
  const method = "POST";
  const requestPath = "/api/v5/asset/withdrawal";
  const body = JSON.stringify({
    ccy,
    amt,
    dest,
    toAddr,
    fee,
    chain,
    areaCode,
    clientId,
  });

  const headers = getRequestHeaders(method, requestPath, body);

  try {
    const response = await axios.post(
      "https://www.okex.com" + requestPath,
      body,
      {
        headers,
      }
    );
    if (response.data.code === "0") {
      return response.data;
    }
  } catch (error) {
    return console.error("Error:", error.response.data);
  }
}

export { withdraw, getAccountBalance, getSingleCurrencie };
