// Token addresses
shoaibAddress= '0x6D712CB50297b97b79dE784d10F487C00d7f8c2C';
rayyanAddrss= '0x04F339eC4D75Cf2833069e6e61b60eF56461CD7C';
popUpAddress= '0x3de00f44ce68FC56DB0e0E33aD4015C6e78eCB39';

// Uniswap contract address
wethAddress= '0x89372b32b8AF3F1272e2efb3088616318D2834cA';
factoryAddress= '0xB1c05b498Cb58568B2470369FEB98B00702063dA';
swapRouterAddress= '0x92A00fc48Ad3dD4A8b5266a8F467a52Ac784fC83';
nftDescriptorAddress= '0x2f8D338360D095a72680A943A22fE6a0d398a0B4';
positionDescriptorAddress= '0x21915b79E1d334499272521a3508061354D13FF0';
positionManagerAddress= '0x44863F234b137A395e5c98359d16057A9A1fAc55';


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
