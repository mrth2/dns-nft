const hre = require("hardhat");

const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");

  const TLD = 'mrth2';
  const domainContract = await domainContractFactory.deploy(TLD);
  await domainContract.deployed();

  console.log("Contract deployed to: ", domainContract.address);

  const domain = 'dnsnft';
  // send transaction with value to mint domain
  let txn = await domainContract.register(domain, {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();

  const address = await domainContract.getAddress(domain);
  console.log(`Owner of domain ${domain}.${TLD}: `, address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();