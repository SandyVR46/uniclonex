import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";
var wethAddress;
var factoryAddress;
var swapRouterAddress;
var nftDescriptorAddress;
var positionDescriptorAddress;
var positionManagerAddress;

// Uniswap contract address
// wethAddress= "0x773330693cb7d5D233348E25809770A32483A940";
// factoryAddress= "0x52173b6ac069619c206b9A0e75609fC92860AB2A";      
// swapRouterAddress= "0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae";   
// nftDescriptorAddress= "0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D";
// positionDescriptorAddress= "0xdB012DD3E3345e2f8D23c0F3cbCb2D94f430Be8C";
// positionManagerAddress= "0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4";

wethAddress= '0x89372b32b8AF3F1272e2efb3088616318D2834cA';
factoryAddress= '0xB1c05b498Cb58568B2470369FEB98B00702063dA';
swapRouterAddress= '0x92A00fc48Ad3dD4A8b5266a8F467a52Ac784fC83';
nftDescriptorAddress= '0x2f8D338360D095a72680A943A22fE6a0d398a0B4';
positionDescriptorAddress= '0x21915b79E1d334499272521a3508061354D13FF0';
positionManagerAddress= '0x44863F234b137A395e5c98359d16057A9A1fAc55';

const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
    WETH9: require("../Context/WETH9.json"),
};

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
  
    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
}
  
export const addLiquidityExternal = async (
    tokenAddress1,
    tokenAddress2,
    poolAddress,
    poolFee,
    tokenAmount1,
    tokenAmount2
) => {
    const web3modal = await new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const accountAddress = await signer.getAddress();

    const token1Contract = new Contract(
        tokenAddress1,
        artifacts.WETH9.abi,
        provider
    );
    const token2Contract = new Contract(
        tokenAddress2,
        artifacts.WETH9.abi,
        provider
    );

    await token1Contract
    .connect(signer)
    .approve(
      positionManagerAddress,
      ethers.utils.parseEther(tokenAmount1.toString())
    );

    await token2Contract
    .connect(signer)
    .approve(
      positionManagerAddress,
      ethers.utils.parseEther(tokenAmount2.toString())
    );

    const poolContract = new Contract(
        poolAddress,
        artifacts.UniswapV3Pool.abi,
        provider
    );

  const { chainId } = await provider.getNetwork();

  //TOKEN1
  const token1Name = await token1Contract.name();
  const token1Symbol = await token1Contract.symbol();
  const token1Decimals = await token1Contract.decimals();
  const token1Address = await token1Contract.address;

  //TOKEN2
  const token2Name = await token2Contract.name();
  const token2Symbol = await token2Contract.symbol();
  const token2Decimals = await token2Contract.decimals();
  const token2Address = await token2Contract.address;

  const TokenA = new Token(
    chainId,
    token1Address,
    token1Decimals,
    token1Name,
    token1Symbol
  );
  const TokenB = new Token(
    chainId,
    token2Address,
    token2Decimals,
    token2Name,
    token2Symbol
  );

  const poolData = await getPoolData(poolContract);
  console.log(poolData);

  const pool = new Pool(
    TokenA,
    TokenB,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

  const position = new Position({
    pool: pool,
    liquidity: ethers.utils.parseEther("1"),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });

//   console.log(position);
  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

  const params = {
    token0: tokenAddress1,
    token1: tokenAddress2,
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
    recipient: accountAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  const tx = await nonfungiblePositionManager.connect(signer).mint(params, {
    gasLimit: "1000000",
  });
  const receipt = await tx.wait();
  return receipt;

};