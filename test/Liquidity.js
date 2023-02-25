const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";
const USDC_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";

describe("LiquidityExamples", () => {
    let liquidityExamples;
    let accounts;
    let dai;
    let usdc;

    before(async () => {
        accounts = await ethers.getSigners(1);
    
        const LiquidityExamples = await ethers.getContractFactory(
          "LiquidityExamples"
        );
        liquidityExamples = await LiquidityExamples.deploy();
        await liquidityExamples.deployed();

        dai = await ethers.getContractAt("IERC20", DAI);
        usdc = await ethers.getContractAt("IERC20", USDC);

        // Unlock DAI and USDC whales
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI_WHALE],
        });
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE],
        });

        const daiWhale = await ethers.getSigner(DAI_WHALE);
        const usdcWhale = await ethers.getSigner(USDC_WHALE);
    
        // Send DAI and USDC to accounts[0]
        const daiAmount = 1000n * 10n ** 18n;
        const usdcAmount = 1000n * 10n ** 6n;
    
        const daiBal = await dai.balanceOf(daiWhale.address);
        const usdcBal = await dai.balanceOf(usdcWhale.address);
        console.log(daiBal, usdcBal, daiAmount, usdcAmount);
    
        expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount);
        expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount);
    
        await dai.connect(daiWhale).transfer(accounts[0].address, daiAmount);
        await usdc.connect(usdcWhale).transfer(accounts[0].address, usdcAmount);
    });
    
    it("mintNewPosition", async () => {
        const daiAmount = 100n * 10n ** 18n;
        const usdcAmount = 100n * 10n ** 6n;
    
        await dai
          .connect(accounts[0])
          .transfer(liquidityExamples.address, daiAmount);
        await usdc
          .connect(accounts[0])
          .transfer(liquidityExamples.address, usdcAmount);
    
        await liquidityExamples.mintNewPosition();
    
        console.log(
          "DAI balance after add liquidity",
          await dai.balanceOf(accounts[0].address)
        );
        console.log(
          "USDC balance after add liquidity",
          await usdc.balanceOf(accounts[0].address)
        );
      });
});