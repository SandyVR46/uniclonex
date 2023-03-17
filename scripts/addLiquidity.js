// Token addresses
shoaibAddress= "0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7";
rayyanAddrss= "0x6e0a5725dD4071e46356bD974E13F35DbF9ef367";        
popUpAddress= "0xA9d0Fb5837f9c42c874e16da96094b14Af0e2784";

SHO_RAY= '0x3342410229fc4591148Ee45c02De97fB02e5E3bd';

// Uniswap contract address
wethAddress= "0x773330693cb7d5D233348E25809770A32483A940";
factoryAddress= "0x52173b6ac069619c206b9A0e75609fC92860AB2A";      
swapRouterAddress= "0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae";   
nftDescriptorAddress= "0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D";
positionDescriptorAddress= "0xdB012DD3E3345e2f8D23c0F3cbCb2D94f430Be8C";
positionManagerAddress= "0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4";

const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
    Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
  
    // console.log(tickSpacing, fee, liquidity, slot0);
    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
}

async function main(){
    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;

    const ShoaibContract = new Contract(
        shoaibAddress,
        artifacts.Shoaib.abi,
        provider
    );
    const RayyanContract = new Contract(
        rayyanAddrss,
        artifacts.Rayyan.abi,
        provider
    );

    await ShoaibContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );
    await RayyanContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );
    
    const poolContract = new Contract(
        SHO_RAY,
        artifacts.UniswapV3Pool.abi,
        provider
    );
    
    const poolData = await getPoolData(poolContract);
    
    const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "Tether");
    const RayyanToken = new Token(31337, rayyanAddrss, 18, "Rayyan", "Rayyanoin");

    const pool = new Pool(
        ShoaibToken,
        RayyanToken,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
    );

    const position = new Position({
        pool: pool,
        liquidity: ethers.utils.parseUnits("1"),
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
    });
    
    // console.log(position);
    const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

    params = {
        token0: shoaibAddress,
        token1: rayyanAddrss,
        fee: poolData.fee,
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        provider
    );

    const tx = await nonfungiblePositionManager
        .connect(signer2)
        .mint(params, { gasLimit: "1000000" });
    const receipt = await tx.wait();
    console.log(receipt);
}

/*
  npx hardhat run --network localhost scripts/addLiquidity.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});