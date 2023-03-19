// Token addresses
shoaibAddress= '0x6e0a5725dD4071e46356bD974E13F35DbF9ef367';
rayyanAddrss= '0xA9d0Fb5837f9c42c874e16da96094b14Af0e2784';
popUpAddress= '0x6B21b3ae41f818Fc91e322b53f8D0773d31eCB75';

// Uniswap contract address
wethAddress= '0x52173b6ac069619c206b9A0e75609fC92860AB2A';
factoryAddress= '0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae';
swapRouterAddress= '0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D';
nftDescriptorAddress= '0xdB012DD3E3345e2f8D23c0F3cbCb2D94f430Be8C';
positionDescriptorAddress= '0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4';
positionManagerAddress= '0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7';


const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { waffle } = require("hardhat");
const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL ="https://eth-mainnet.g.alchemy.com/v2/IAmRmpHdkfS07TF1PHTFdAQguR-hgCDO";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

// const provider = waffle.provider;

function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
      new bn(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    );
}

const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
);

const factory = new Contract(
    factoryAddress,
    artifacts.UniswapV3Factory.abi,
    provider
);

async function deployPool(token0, token1, fee, price) {
    const [owner] = await ethers.getSigners();
    await nonfungiblePositionManager
        .connect(owner)
        .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
            gasLimit: 5000000,
        });
    const poolAddress = await factory.connect(owner).getPool(token0, token1, fee);
    return poolAddress;
}
  
async function main() {
    const shoRay = await deployPool(
      shoaibAddress,
      rayyanAddrss,
      500,
      encodePriceSqrt(1, 1)
    );
  
    console.log("SHO_RAY=", `'${shoRay}'`);
}

/*
  npx hardhat run --network localhost scripts/deployPool.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
