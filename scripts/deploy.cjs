// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const hre = require("hardhat");
const { ethers } = hre;

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const dotenv = require("dotenv");
dotenv.config();
// eslint-disable-next-line no-undef

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Battleship = await ethers.getContractFactory("Battleship");
  const battleship = await Battleship.deploy();

  await battleship.waitForDeployment();

  console.log("Battleship Contract deployed to:", battleship.target);
  // console.log("Battleship Contract deployed to:", battleship.target);

  // await sleep({ seconds: 15 * 2 });

  // try {
  //   await run("verify:verify", {
  //     address: invoiceContact.address,
  //     constructorArguments: [],
  //   });
  //   console.log(
  //     "Invoice Contract deployed and verified to:",
  //     invoiceContact.address
  //   );
  // } catch (err) {
  //   console.error("Error verifying Contract. Reason:", err);
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  // eslint-disable-next-line no-undef
  process.exitCode = 1;
});
