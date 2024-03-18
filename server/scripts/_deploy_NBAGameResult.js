const hre = require("hardhat");

async function main() {
  
  const NBAResult = await hre.ethers.getContractFactory("NBAGameResult");
  const myContract = await NBAResult.deploy('0xa57f0cEd49bB1ed7327f950B12a8419cFD01855f', 'a8356f48569c434eaa4ac5fcb4db5cc0', 0);

  await myContract.deployed();

  console.log("CheckResult deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });