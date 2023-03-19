import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";


//INTERNAL IMPORT
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithBooToken,
    connectingWithLIfeToken,
    connectingWithSingleSwapToken,
    connectingWithIWTHToken,
    connectingWithDAIToken,
    connectingWithUserStorageContract,
} from "../Utils/appFeatures";


import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import {addLiquidityExternal} from "../Utils/addLiquidity";
import {getLiquidityData} from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
    //USSTATE
    const [account, setAccount] = useState("");
    const [ether, setEther] = useState("");
    const [networkConnect, setNetworkConnect] = useState("");
    const [weth9, setWeth9] = useState("");
    const [dai, setDai] = useState("");

    const [tokenData, setTokenData] = useState([]);
    const [getAllLiquidity, setGetAllLiquidity] = useState([]);

    const addToken = [
        "0x6e0a5725dD4071e46356bD974E13F35DbF9ef367",
        "0xA9d0Fb5837f9c42c874e16da96094b14Af0e2784",
        "0x6B21b3ae41f818Fc91e322b53f8D0773d31eCB75",
    ];

    //FETCH DATA
    const fetchingData = async () => {
        try{
            // GET USER ACCOUNT
            const userAccount = await checkIfWalletConnected();
            setAccount(userAccount);
            // CREATE PROVIDER
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            
            // const yaho = await provider.getCode(address);
            // console.log(yaho);
           
            //CHECK Balance
            const balance = await provider.getBalance(userAccount);
            const convertBal = BigNumber.from(balance).toString();
            const ethValue = ethers.utils.formatEther(convertBal);
            setEther(ethValue);
            
            //GET NETWORK
            const newtork = await provider.getNetwork();
            setNetworkConnect(newtork.name);            
            // ALL TOKEN BALANCE AND DATA
            addToken.map(async (el, i)=>{
                // GETTING CONTRACT
                const contract = new ethers.Contract(el, ERC20, provider);
  
                // GETTING BALANCE OF TOKEN
                const userBalance = await contract.balanceOf(userAccount);
                const tokenLeft = BigNumber.from(userBalance).toString();
                const convertTokenBal = ethers.utils.formatEther(tokenLeft);
                //GET NAME AND SYMBOL

                const symbol = await contract.symbol();
                const name = await contract.name();

                tokenData.push({
                    name: name,
                    symbol: symbol,
                    tokenBalance: convertTokenBal,
                    tokenAddress: el,
                });
            });

            // //GET LIQUDITY
            const userStorageData = await connectingWithUserStorageContract();
            const userLiquidity = await userStorageData.getAllTransactions();
            console.log(userLiquidity);

            userLiquidity.map(async (el, i) => {
                const liquidityData = await getLiquidityData(
                  el.poolAddress,
                  el.tokenAddress0,
                  el.tokenAddress1
                );
        
                getAllLiquidity.push(liquidityData);
                console.log(getAllLiquidity);
              });
        }   catch(error){
            console.log(error);
        }
    };

    
    useEffect(()=>{
        fetchingData();
    }, []);

    //CREATE AND ADD LIQUIDITY
    const createLiquidityAndPool = async ({
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmmountOne,
        tokenAmmountTwo,
    }) => {
      try {
        console.log( tokenAddress0,
            tokenAddress1,
            fee,
            tokenPrice1,
            tokenPrice2,
            slippage,
            deadline,
            tokenAmmountOne,
            tokenAmmountTwo);
        //CREATE POOL
        const createPool = await connectingWithPoolContract(
            tokenAddress0,
            tokenAddress1,
            fee,
            tokenPrice1,
            tokenPrice2,
            {
            gasLimit: 500000,
            }
        );

        const poolAddress = createPool;
        // console.log(poolAddress);

        //CREATE LIQUIDITY
        const info = await addLiquidityExternal(
            tokenAddress0,
            tokenAddress1,
            poolAddress,
            fee,
            tokenAmmountOne,
            tokenAmmountTwo
        );
        console.log(info);

        //ADD DATA
        const userStorageData = await connectingWithUserStorageContract();

        const userLiqudity = await userStorageData.addToBlockchain(
            poolAddress,
            tokenAddress0,
            tokenAddress1
        );  
      } catch (error) {
        console.log(error);
      }
    };

    // SINGL SWAP TOKEN
    const singleSwapToken = async({token1, token2, swapAmount}) => {
        console.log(
            token1.tokenAddress.tokenAddress, 
            token2.tokenAddress.tokenAddress,
            swapAmount
            );
        try{
            let singleSwapToken;
            let weth;
            let dai;

            singleSwapToken = await connectingWithSingleSwapToken();
            weth = await connectingWithIWTHToken();
            dai = await connectingWithDAIToken();

            const decimals0 = 18;
            const inputAmount = swapAmount;
            const amountIn = ethers.utils.parseUnits(
                inputAmount.toString(),
                decimals0
            );

            console.log(amountIn);

            await weth.deposit({value:amountIn});
            await weth.approve(singleSwapToken.address, amountIn);

            // SWAP
          const transaction =  await singleSwapToken.swapExactInputSingle(
            token1.tokenAddress.tokenAddress, 
            token2.tokenAddress.tokenAddress,
            amountIn, 
            {
                gasLimit : 300000,
            });

            await transaction.wait()
            console.log(transaction);
            
            const balance = await dai.balanceOf(account);
            const transferAmount = BigNumber.from(balance).toString();
            const ethValue = ethers.utils.formatEther(transferAmount);
            setDai(ethValue);
            console.log("DAI balance:", ethValue);

        }catch(error){
            console.log(error);
        }
    };


    return (
        <SwapTokenContext.Provider 
        value={{
            singleSwapToken,
            connectWallet, 
            getPrice,
            swapUpdatePrice,
            createLiquidityAndPool,
            getAllLiquidity,
            account, 
            weth9, 
            dai, 
            networkConnect, 
            ether, 
            tokenData,
            }}>
          {children}
        </SwapTokenContext.Provider>
    );
};










































// import React, { useState, useEffect } from "react";
// import { ethers, BigNumber } from "ethers";
// import Web3Modal from "web3modal";
// import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";


// //INTERNAL IMPORT
// import {
//     checkIfWalletConnected,
//     connectWallet,
//     connectingWithBooToken,
//     connectingWithLIfeToken,
//     connectingWithSingleSwapToken,
//     connectingWithIWTHToken,
//     connectingWithDAIToken,
// } from "../Utils/appFeatures";

// import { IWETHABI } from "./constants";
// import ERC20 from "./ERC20.json";
// import { getPrice } from "../Utils/fetchingPrice";
// import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
// export const SwapTokenContext = React.createContext();

// export const SwapTokenContextProvider = ({ children }) => {
//     //USSTATE
//     const [account, setAccount] = useState("");
//     const [ether, setEther] = useState("");
//     const [networkConnect, setNetworkConnect] = useState("");
//     const [weth9, setWeth9] = useState("");
//     const [dai, setDai] = useState("");

//     const [tokenData, setTokenData] = useState([]);

//     const addToken = [
//         "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//         "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//         "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//         "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
//         "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
//         "0x6B175474E89094C44Da98b954EedeAC495271d0F",
//         "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
//         "0xe044814c9eD1e6442Af956a817c161192cBaE98F",
//         "0xaB837301d12cDc4b97f1E910FC56C9179894d9cf",
//         "0x4ff1f64683785E0460c24A4EF78D582C2488704f",
//     ];

//     //FETCH DATA
//     const fetchingData = async () => {
//         try{
//             // GET USER ACCOUNT
//             const userAccount = await checkIfWalletConnected();
//             setAccount(userAccount);
//             // CREATE PROVIDER
//             const web3modal = new Web3Modal();
//             const connection = await web3modal.connect();
//             const provider = new ethers.providers.Web3Provider(connection);
            
//             // const yaho = await provider.getCode(address);
//             // console.log(yaho);
           
//             //CHECK Balance
//             const balance = await provider.getBalance(userAccount);
//             const convertBal = BigNumber.from(balance).toString();
//             const ethValue = ethers.utils.formatEther(convertBal);
//             setEther(ethValue);
            
//             //GET NETWORK
//             const newtork = await provider.getNetwork();
//             setNetworkConnect(newtork.name);            
//             // ALL TOKEN BALANCE AND DATA
//             addToken.map(async (el, i)=>{
//                 // GETTING CONTRACT
//                 const contract = new ethers.Contract(el, ERC20, provider);
  
//                 // GETTING BALANCE OF TOKEN
//                 const userBalance = await contract.balanceOf(userAccount);
//                 const tokenLeft = BigNumber.from(userBalance).toString();
//                 const convertTokenBal = ethers.utils.formatEther(tokenLeft);
//                 //GET NAME AND SYMBOL

//                 const symbol = await contract.symbol();
//                 const name = await contract.name();

//                 tokenData.push({
//                     name: name,
//                     symbol: symbol,
//                     tokenBalance: convertTokenBal,
//                     tokenAddress: el,
//                 });
//             });

//             // WETH BALANCE
//             const wethContract = await connectingWithDAIToken();
//             const wethBal = await wethContract.balanceOf(userAccount);
//             const wethToken = BigNumber.from(wethBal).toString();
//             const convertwethTokenBal = ethers.utils.formatEther(wethToken);
//             setWeth9(convertwethTokenBal);

//             // DAI BALANCE
//             const daiContract = await connectingWithIWTHToken();
//             const daiBal = await daiContract.balanceOf(userAccount);
//             const daiToken = BigNumber.from(daiBal).toString();
//             const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
//             setDai(convertdaiTokenBal);   
//         }   catch(error){
//             console.log(error);
//         }
//     };

    
//     useEffect(()=>{
//         fetchingData();
//     }, []);

//     // SINGL SWAP TOKEN
//     const singleSwapToken = async({token1, token2, swapAmount}) => {
//         console.log(
//             token1.tokenAddress.tokenAddress, 
//             token2.tokenAddress.tokenAddress,
//             swapAmount
//             );
//         try{
//             let singleSwapToken;
//             let weth;
//             let dai;

//             singleSwapToken = await connectingWithSingleSwapToken();
//             weth = await connectingWithIWTHToken();
//             dai = await connectingWithDAIToken();

//             const decimals0 = 18;
//             const inputAmount = swapAmount;
//             const amountIn = ethers.utils.parseUnits(
//                 inputAmount.toString(),
//                 decimals0
//             );

//             console.log(amountIn);

//             await weth.deposit({value:amountIn});
//             await weth.approve(singleSwapToken.address, amountIn);

//             // SWAP
//           const transaction =  await singleSwapToken.swapExactInputSingle(
//             token1.tokenAddress.tokenAddress, 
//             token2.tokenAddress.tokenAddress,
//             amountIn, 
//             {
//                 gasLimit : 300000,
//             });

//             await transaction.waith()
//             console.log(transaction);
            
//             const balance = await dai.balanceOf(account);
//             const transferAmount = BigNumber.from(balance).toString();
//             const ethValue = ethers.utils.formatEther(transferAmount);
//             setDai(ethValue);
//             console.log("DAI balance:", ethValue);

//         }catch(error){
//             console.log(error);
//         }
//     };


//     return (
//         <SwapTokenContext.Provider 
//         value={{
//             singleSwapToken,
//             connectWallet, 
//             getPrice,
//             swapUpdatePrice,
//             account, 
//             weth9, 
//             dai, 
//             networkConnect, 
//             ether, 
//             tokenData}}>
//           {children}
//         </SwapTokenContext.Provider>
//     );
// };