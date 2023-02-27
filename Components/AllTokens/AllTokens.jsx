import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./AllTokens.module.css";
import images from "../../assets";

const AllTokens = ({ allTokenList }) => {
    return (
      <div className={Style.AllTokens}>
        <div className={Style.AllTokens_box}>
          <div className={Style.AllTokens_box_header}>
            <p className={Style.hide}>#</p>
            <p>Token name</p>
            <p>Price</p>
            <p className={Style.hide}>Change</p>
            <p className={Style.hide}>
              TVL{" "}
              <small>
                <Image src={images.question} alt="img" width={15} height={15} />
              </small>{" "}
            </p>
            <p className={Style.hide}>
              <small>
                <Image src={images.arrowPrice} alt="img" width={15} height={15} />
              </small>{" "}
              Volume{" "}
              <small>
                <Image src={images.question} alt="img" width={15} height={15} />
              </small>{" "}
            </p>
          </div>
  
          {allTokenList.map((el, i) => (
            <div className={Style.AllTokens_box_list}>
              <p className={Style.hide}>{el.number}</p>
              <p className={Style.AllTokens_box_list_para}>
                <small>
                  <Image src={images.uniswap} alt="logo" width={25} height={25} />
                </small>
                <small>{el.name}</small>
                <small>{el.symbol}</small>
              </p>
              <p>{el.price}</p>
              <p className={Style.hide}>{el.change}</p>
              <p className={Style.hide}>{el.tvl}</p>
              <p className={Style.hide}>{el.volume}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default AllTokens;