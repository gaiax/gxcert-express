const createServer = require("gxcert-express");
const Common = require("ethereumjs-common").default;

// It returns Express App Object of GxCert.
function mainnet() {
  const common = Common.forCustomChain(
    "mainnet",
    {
      name: "matic-mainnet",
      chainId: 137,
      networkId: 137,
    },
    "petersburg"
  );
  return createServer(
    "https://rpc-mainnet.maticvigil.com",
    "<PLEASE PUT POLYGON CONTRACT ADDRESS>",
    "<PLEASE PUT POLYGON PRIVATE KEY>",
    common,
    [
      //Access-Control-Allow-Origin list
      "http://localhost:3000",
      "https://gaiax.github.io",
    ]
  );
}



