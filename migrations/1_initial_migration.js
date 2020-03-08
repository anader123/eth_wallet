const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");
const UsdcTokenMock = artifacts.require("UsdcTokenMock");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  await deployer.deploy(UsdcTokenMock);
  const tokenMock = await DaiTokenMock.deployed();
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0x5E573d2374aebf5EC39F74B853f65c41d8B54141',
    '1000000000000000000000'
  )
  const tokenMock2 = await UsdcTokenMock.deployed();
  await tokenMock2.mint(
    '0x5E573d2374aebf5EC39F74B853f65c41d8B54141',
    '1000000000'
  )
};
