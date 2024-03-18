require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  networks: {
    optimism: {
      url: "https://sepolia.optimism.io",
      accounts: [
        process.env.PRIVATE_KEY
      ]
    },
  },
  solidity: "0.8.24",
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
    libraries: './lib',
  },
  allowUnlimitedContractSize: true
};
