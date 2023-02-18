import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";

//INTERNAL IMPORT
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithBooToken,
    connectingWithLIfeToken,
    connectingWithSingleSwapToken,
    connectingWithIWTHToken,
    connectingWithDAIToken,
} from "../Utils/appFeatures";

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

    const addToken = [
        "0x6533158b042775e2FdFeF3cA1a782EFDbB8EB9b1",
        "0x73C68f1f41e4890D06Ba3e71b9E9DfA555f1fb46",
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
                    
                });
            });

            // WETH BALANCE
            const wethContract = await connectingWithDAIToken();
            const wethBal = await wethContract.balanceOf(userAccount);
            const wethToken = BigNumber.from(wethBal).toString();
            const convertwethTokenBal = ethers.utils.formatEther(wethToken);
            setWeth9(convertwethTokenBal);

            // DAI BALANCE
            const daiContract = await connectingWithIWTHToken();
            const daiBal = await daiContract.balanceOf(userAccount);
            const daiToken = BigNumber.from(daiBal).toString();
            const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
            setDai(convertdaiTokenBal);

            
            
        }catch(error){
            console.log(error);
        }
    };

    
    useEffect(()=>{
        fetchingData();
    }, []);

    return (
        <SwapTokenContext.Provider 
        value={{connectWallet, account, weth9, dai, networkConnect, ether, tokenData}}>
          {children}
        </SwapTokenContext.Provider>
    );
};