import fs from "fs";

export const questions = [
  {
    type: "text",
    name: "coinAndChain",
    message: "What coin do you want to send, and what chain. E.g: BNB-BSC",
    separator: ",",
    validate: (coinAndChain) =>
      coinAndChain.split("-").length === 2
        ? true
        : "Coin and chain must be separated with '-', for example: ETH-ETH",
    format: (value) => value.split("-"),
  },
  {
    type: "text",
    name: "amount",
    message: "What is the minimum and maximum amount to send?",
    validate: (amount) =>
      amount.split("-").length === 2
        ? true
        : "Amount must two numbers separated with '-', for example: 0.1-0.2",
    format: (value) => value.split("-"),
  },
  {
    type: "text",
    name: "networkFee",
    message: "What is the current network fee on OKEX for withdrawing your coin?",
  },
  {
    type: "text",
    name: "timeToSleep",
    message: "What is the minimum and maximum time to sleep?",
    separator: "-",
    validate: (timeToSleep) =>
      timeToSleep.split("-").length === 2
        ? true
        : "Time to sleep must two numbers separated with '-', for example: 1000-2000",
    format: (value) => value.split("-"),
  },
];

export const readFileAsArray = async (fileName) => {
  try {
    const fileContent = await fs.promises.readFile(fileName, "utf-8");
    console.log(`File ${fileName} is read successfully.\n`);
    return fileContent.split("\n");
  } catch (error) {
    console.error(`Error reading file ${fileName}: ${error}`);
    return null;
  }
};

export const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const randomAmount = (min, max, digitsAfterPeriod) => {
  return (Math.random() * (max - min) + min).toFixed(digitsAfterPeriod);
};

export const randomSleep = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const convertMsToTime = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`;
};

export const log = (msg) => {
  console.log(`[ ${chalk.greenBright(convertMsToTime(Date.now()))} ] - ${msg}`);
};
