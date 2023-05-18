# OKEX Multisend
OKEX Multisend is a Node.js script that allows you to withdraw a random amount of a certain cryptocurrency to multiple addresses.

## Requirements
- Node.js and npm ([link](https://nodejs.org/en/download/))
- An OKEX account with API credentials
- Addresses to send the coins to (saved in a addresses.txt file)

## Set Up
1. Clone the repository or download the script to your local machine
2. Go to script folder in terminal `cd path/to/folder`
3. Run `npm install` in the project folder to install the required dependencies
4. Create a `.env` file and add your API credentials as environment variables:
    ```
    OKEX_ACCESS_KEY=your_access_key
    OKEX_SECRET_KEY=your_secret_key
    OKEX_ACCESS_PASSPHRASE=your_access_passphrase
    ```
5. Create an `addresses.txt` file in the project folder and add the addresses you want to send the coins to, one per line
6. Start the script with `npm start` (You can also run with `npm run start:config` to run with premade configuration in **multisendConfig.json**)

## Running the Script
When you start the script, you will be prompted to answer a series of questions:
1. The name and chain of the coin you want to send (e.g. "**BNB-BSC**", "**ETH-ETH20**", "**ETH-Arbitrum one**", "**USDT-ETH**", etc. You can see them on OKEX)
2. The minimum and maximum amount you want to send (e.g. "**0.1-0.1**" for specified amount, "**0.01-0.05**" for random amount)
3. The minimum and maximum time to wait between withdrawals in millisends (e.g  "**5000-5000**" for speciefied time, "**1000-3000**" for random time)


Once you have answered all the questions, the script will display a configuration summary and ask for confirmation. If you confirm, the script will start sending the coins. The progress will be logged to the console, including the time, the address, and the amount sent.
([screenshot]("./public/screenshot.png))

### Note
Please make sure to understand the risks involved with sending cryptocurrency. Use this script at your own risk.
