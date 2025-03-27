const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
  await deployer.deploy(Voting);
  const votingInstance = await Voting.deployed();
  console.log("Contract deployed at:", votingInstance.address);
};
