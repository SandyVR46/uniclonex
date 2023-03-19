import Web3Modal from "web3modal";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import { Contract, ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import ERC20 from "../Context/ERC20.json";

async function getPoolData(poolContract, tokenAddress1, tokenAddress2) {
  const [
    tickSpacing,
    fee,
    liquidity,
    slot0,
    factory,
    token0,
    token1,
    maxLiquidityPerTick,
  ] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.maxLiquidityPerTick(),
  ]);

  const web3modal = await new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);

  const token0Contract = new Contract(tokenAddress1, ERC20, provider);
  const token1Contract = new Contract(tokenAddress2, ERC20, provider);

  const { chainId } = await provider.getNetwork();

  //TOKEN0
  const token0Name = await token0Contract.name();
  const token0Symbol = await token0Contract.symbol();
  const token0Decimals = await token0Contract.decimals();
  const token0Address = await token0Contract.address;

  //TOKEN1
  const token1Name = await token1Contract.name();
  const token1Symbol = await token1Contract.symbol();
  const token1Decimals = await token1Contract.decimals();
  const token1Address = await token1Contract.address;

  const TokenA = new Token(
    chainId,
    token0Address,
    token0Decimals,
    token0Symbol,
    token0Name
  );

  const TokenB = new Token(
    chainId,
    token1Address,
    token1Decimals,
    token1Symbol,
    token1Name
  );

  const poolExample = new Pool(
    TokenA,
    TokenB,
    fee,
    slot0[0].toString(),
    liquidity.toString(),
    slot0[1]
  );

  return {
    factory: factory,
    token0: token0,
    token1: token1,
    maxLiquidityPerTick: maxLiquidityPerTick,
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity.toString(),
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    observationIndex: slot0[2],
    observationCardinality: slot0[3],
    observationCardinalityNext: slot0[4],
    feeProtocol: slot0[5],
    unlocked: slot0[6],
    poolExample,
  };
}

export const getLiquidityData = async (
  poolAddress,
  tokenAddress1,
  tokenAddress2
) => {
  const web3modal = await new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const poolContract = new Contract(poolAddress, UniswapV3Pool.abi, provider);
  const poolData = await getPoolData(
    poolContract,
    tokenAddress1,
    tokenAddress2
  );

  return poolData;
};