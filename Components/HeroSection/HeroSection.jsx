import React, { useState, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./HeroSection.module.css";
import images from "../../assets";
import { Token, SearchToken } from "../index";

const HeroSection = ({accounts, tokenData}) => {
  //USESTATE
  const [openSetting, setOpenSetting] = useState(false);
  const [openToken, setOpenToken] = useState(false);
  const [openTokensTwo, setOpenTokensTwo] = useState(false);


  //TOKEN 1
  const [tokenOne, setTokenOne] = useState({
    name: "",
    image: "",
  });

  //TOKEN 2
  const [tokenTwo, setTokenTwo] = useState({
    name: "",
    image: "",
  });

  return (
    <div className={Style.HeroSection}>
      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
          <div className={Style.HeroSection_box_heading_img}>
            <Image
                src={images.close}
                alt="image"
                width={50}
                height={50}
                onClick={() => setOpenSetting(true)}
              />
          </div>
        </div>

        <div className={Style.HeroSection_box_input}>
          <input
              type="number"
              placeholder="0"
          />
          <button onClick={() => setOpenToken(true)}>
          <Image
              src={images.image || images.etherlogo}
              width={20}
              height={20}
              alt="ether"
            />
            {tokenOne.name || "ETH"}
            <small>9474</small>
          </button>
        </div>

        <div className={Style.HeroSection_box_input}>
          <input
              type="number"
              placeholder="0"
          />
          <button onClick={() => setOpenTokensTwo(true)}>
          <Image
              src={tokenTwo.image || images.etherlogo}
              width={20}
              height={20}
              alt="ether"
            />
            {tokenTwo.name || "ETH"}
            <small>9474</small>
          </button>
        </div>
        
        {accounts ? (
          <button
          className={Style.HeroSection_box_btn}
          >
          Connect Wallet
        </button>
        ):(
          <button
            onClick={() =>{} }
            className={Style.HeroSection_box_btn}
          >
            Swap
          </button>
        )}
      </div>
      
      {openSetting && <Token setOpenSetting={setOpenSetting} />}

      {openToken && (
        <SearchToken
          openToken={setOpenToken}
          tokens={setTokenOne}
          tokenData={tokenData}
        />
      )}

      {openTokensTwo && (
          <SearchToken
            openToken={setOpenTokensTwo}
            tokens={setTokenTwo}
            tokenData={tokenData}
          />
        )}

    </div>
  )

};

export default HeroSection