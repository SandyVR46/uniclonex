const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
  
    Shoaib = await ethers.getContractFactory("Shoaib");
    shoaib = await Shoaib.deploy();
  
    Rayyan = await ethers.getContractFactory("Rayyan");
    rayyan = await Rayyan.deploy();
  
    PopUp = await ethers.getContractFactory("PopUp");
    popUp = await PopUp.deploy();

   
    console.log("shoaibAddress=", `'${shoaib.address}'`);
    console.log("rayyanAddrss=", `'${rayyan.address}'`);
    console.log("popUpAddress=", `'${popUp.address}'`);
  }
  
  /*
    npx hardhat run --network localhost scripts/deployToken.js
    */
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });