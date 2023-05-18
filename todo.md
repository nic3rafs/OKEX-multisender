        console.log(withdrawResponse);

        if (withdrawResponse.code === "0") {
          log(
            `Successful withdraw ${amount} ${multisendConfig.coin} for (${cleanedAddress})`
          );
        }

# Change 43 line, because of error
[Error] with (0xx383a44bxxxxxxxxxxxxxxxxx5701x5e ) - TypeError: Cannot read property 'code' of undefined
