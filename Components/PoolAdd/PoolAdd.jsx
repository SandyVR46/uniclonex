import React, { useState, useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import images from "../../assets";
import Style from "./PoolAdd.module.css";
import { Token, SearchToken } from "../../Components/index.js";

const PoolAdd = () => {
    const [openModel, setOpenModel] = useState(false);
    const [openTokenModel, setOpenTokenModel] = useState(false);
    const [active, setActive] = useState(1);
    const [openFee, setOpenFee] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const feePairs = [
        {
          fee: "0.05%",
          info: "Best for stable pairs",
          number: "0% Select",
        },
        {
          fee: "0.3%",
          info: "Best for stable pairs",
          number: "0% Select",
        },
        {
          fee: "1%",
          info: "Best for stable pairs",
          number: "0% Select",
        },
    ];

    const minPriceRange = (text) => {
        if (text == "+") {
            setMinPrice(minPrice + 1);
        } else if (text == "-"){
            setMinPrice(minPrice - 1);
        }
    };

    const maxPriceRange = (text) => {
        if (text == "+") {
            setMaxPrice(maxPrice + 1);
        } else if (text == "-") {
            setMaxPrice(maxPrice - 1);
        }
    };

    return (
        <div className={Style.PoolAdd}>
            <div className={Style.PoolAdd_box}>
                <div className={Style.PoolAdd_box_header}>
                    <div className={Style.PoolAdd_box_header_left}>
                        <Image
                        src={images.arrowLeft}
                        alt="image"
                        width={30}
                        height={30}
                        />
                    </div>
                    <div className={Style.PoolAdd_box_header_middle}>
                        <p>Add Liqudity</p>
                    </div>
                    <div className={Style.PoolAdd_box_header_right}>
                        <p>Clear All</p>
                        <Image
                            src={images.close}
                            alt="image"
                            width={50}
                            height={50}
                            onClick={() => setOpenModel(true)}
                        />
                       
                    </div>
                </div>

                {/* //SELECT PRICE RANGE */}
                <div className={Style.PoolAdd_box_price}>
                {/* //LEFT */}
                <div className={Style.PoolAdd_box_price_left}>
                    <h4>Select Pair</h4>
                    <div className={Style.PoolAdd_box_price_left_token}>
                        <div className={Style.PoolAdd_box_price_left_token_info}>
                            <p>
                                <Image
                                    src={images.etherlogo}
                                    alt="image"
                                    width={20}
                                    height={20}
                                />
                            </p>
                            <p>UNI</p>
                            <p>🡫</p>
                        </div>
                        <div
                            className={Style.PoolAdd_box_price_left_token_info}
                            onClick={() => setOpenTokenModel(true)}
                        >
                            <p>
                                <Image
                                src={images.etherlogo}
                                alt="image"
                                width={20}
                                height={20}
                                />
                            </p>
                            <p>WETH</p>
                            <p>🡫</p>
                        </div>
                    </div>

                    {/* FEE */}
                    <div className={Style.PoolAdd_box_price_left_fee}>
                        <div className={Style.PoolAdd_box_price_left_fee_left}>
                            <h4>Fee teir</h4>
                            <p>The % you will earn in fees</p>
                        </div>
                        {openFee ? (
                            <button onClick={() => setOpenFee(false)}>Hide</button>
                            ) : (
                                <button onClick={() => setOpenFee(true)}>Show</button>
                            )}  
                        </div>

                        {/* FEE LIST */}
                        {openFee && (
                            <div className={Style.PoolAdd_box_price_left_list}>
                                {feePairs.map((el, i) => (
                                    <div
                                    className={Style.PoolAdd_box_price_left_list_item}
                                    key={i + 1}
                                    onClick={() => setActive(i + 1)}
                                    >
                                    <div
                                        className={Style.PoolAdd_box_price_left_list_item_info}
                                    >
                                        <p>{el.fee}</p>
                                        <p>
                                            {active == i + 1 ? (
                                            <Image
                                                src={images.tick}
                                                alt="image"
                                                width={20}
                                                height={20}
                                            />
                                            ) : (
                                            ""
                                            )}
                                        </p>
                                        </div>

                                        <small>{el.info}</small>
                                        <p className={Style.PoolAdd_box_price_left_list_item_para}>
                                            {el.number}
                                        </p>
                                    </div>
                                ))}
                                </div>
                        )}

                        {/* //DEPOSIT AMOUNT */}
                        <div className={Style.PoolAdd_box_deposit}>
                         <h4>Deposit Amount</h4>

                         <div className={Style.PoolAdd_box_deposit_box}>
                            <input type="text" placeholder="0"/>
                            <div className={Style.PoolAdd_box_deposit_box_input}>
                                <p>
                                    <small>UNI</small>
                                    Uniswap
                                </p>
                                <p className={Style.PoolAdd_box_deposit_box_input_item}>
                                    Balance: 0.00
                                </p>
                            </div>
                        </div>

                        <div className={Style.PoolAdd_box_deposit_box}>
                            <input type="text" placeholder="0"/>
                            <div className={Style.PoolAdd_box_deposit_box_input}>
                                <p>
                                    <small>ETH</small>
                                    Ether
                                </p>
                                <p className={Style.PoolAdd_box_deposit_box_input_item}>
                                    Balance: 0.00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

          {/* RIGHT */}
          <div className={Style.PoolAdd_box_price_right}>
            <h4>Set Price Range</h4>
            <div className={Style.PoolAdd_box_price_right_box}>
              <p className={Style.PoolAdd_box_price_right_box_para}>
                Current Price: 41.1494  Testv4 per WETH 
              </p>
              <Image src={images.wallet} alt="wallet" height={80} width={80} />
              <h3>Your position will appear here.</h3>
           </div>

            {/* //PRICE RANGE */}

            <div className={Style.PoolAdd_box_price_right_range}>
              <div className={Style.PoolAdd_box_price_right_range_box}>
                <p>Min Price</p>
                <p
                  className={Style.PoolAdd_box_price_right_range_box_para}
                  onClick={(e) => minPriceRange(e.target.innerText)}
                >
                <small>-</small> {minPrice} <small>+</small>
                </p>
                <p>Test v4 per WETH</p>
              </div>

            {/* MAX */}

            
              <div className={Style.PoolAdd_box_price_right_range_box}>
                <p>Max Price</p>
                <p
                  className={Style.PoolAdd_box_price_right_range_box_para}
                  onClick={(e) => maxPriceRange(e.target.innerText)}
                >
                <small>-</small> {maxPrice} <small>+</small>
                </p>
                <p>Test v4 per WETH</p>
              </div>
            </div>

            {/* BUTTON */}

            <div className={Style.PoolAdd_box_price_right_button}>
              <button>Full Range</button>
            </div>
            <div className={Style.PoolAdd_box_price_right_amount}>
                <button>Enter a amount</button>
            </div>
        </div>
    </div>
</div>
                
{openModel && (
    <div className={Style.token}>
        <Token
            setOpenSetting={setOpenModel}/>
    </div>
)}
{openTokenModel && (
    <div className={Style.token}>
        <SearchToken
            tokenData="hey"
            openToken = {setOpenTokenModel}
        />
    </div>
)}

</div>

);
};

export default PoolAdd;