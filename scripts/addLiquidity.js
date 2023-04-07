// Token addresses
shoaibAddress= '0xF9c0bF1CFAAB883ADb95fed4cfD60133BffaB18a';
rayyanAddrss= '0xb830887eE23d3f9Ed8c27dbF7DcFe63037765475';
popUpAddress= '0x6f2E42BB4176e9A7352a8bF8886255Be9F3D2d13';

SHO_RAY= '0x3342410229fc4591148Ee45c02De97fB02e5E3bd';

// Uniswap contract address
wethAddress= '0x89372b32b8AF3F1272e2efb3088616318D2834cA';
factoryAddress= '0xB1c05b498Cb58568B2470369FEB98B00702063dA';
swapRouterAddress= '0x92A00fc48Ad3dD4A8b5266a8F467a52Ac784fC83';
nftDescriptorAddress= '0x2f8D338360D095a72680A943A22fE6a0d398a0B4';        
positionDescriptorAddress= '0x21915b79E1d334499272521a3508061354D13FF0';   
positionManagerAddress= '0x44863F234b137A395e5c98359d16057A9A1fAc55';

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