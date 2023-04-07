import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../styles/Tokens.module.css";
import images from "../assets";
import { AllTokens } from "../Components/index";
// CONTEXT
import { SwapTokenContext } from "@/Context/SwapContext";

const Tokens = () => {
    const [allTokenList, setAllTokenList] = useState([
        {
          number: 1,
          image: images.etherlogo,
          name: "Ether",
          symbol: "ETH",
          price: "$12,345",
          change: "+ 234.5",
          tvl: "$7894.5M",
          volume: "$716.5 M",
        },
        {
          number: 2,
          image: images.etherlogo,
          name: "USDC Coin",
          symbol: "USDC",
          price: "$12,345",
          change: "+ 234.5",
          tvl: "$7894.5M",
          volume: "$716.5 M",
        },
        {
          number: 3,
          image: images.etherlogo,
          name: "Wrapped BTC",
          symbol: "WBTC",
          price: "$12,345",
          change: "+ 234.5",
          tvl: "$7894.5M",
          volume: "$716.5 M",
        },
        {
          number: 4,
          image: images.etherlogo,
          name: "Uniswap",
          symbol: "UNI",
          price: "$12,345",
          change: "+ 234.5",
          tvl: "$7894.5M",
          volume: "$716.5 M",
        },
      ]);
      const {topTokensList} = useContext(SwapTokenContext);

      const [copyAllTokenList, setCopyAllTokenList] = useState(allTokenList);
      const [search, setSearch] = useState("");
      const [searchItem, setSearchItem] = useState(search);

      const onHandleSearch = (value) => {
        const filteredTokens = allTokenList.filter(({ name }) =>
          name.toLowerCase().includes(value.toLowerCase())
        );
        if (filteredTokens.length === 0) {
            setAllTokenList(copyAllTokenList);
          } else {
            setAllTokenList(filteredTokens);
          }
        };

        const onClearSearch = () => {
            if (allTokenList.length && copyAllTokenList.length) {
              setAllTokenList(copyAllTokenList);
            }
          };
        
          useEffect(() => {
            const timer = setTimeout(() => setSearch(searchItem), 1000);
            return () => clearTimeout(timer);
          }, [searchItem]);
        
          useEffect(() => {
            if (search) {
              onHandleSearch(search);
            } else {
              onClearSearch();
            }
          }, [search]);

          return (
            <div className={Style.Tokens}>
              <div className={Style.Tokens_box}>
                <h2>Top tokens on Uniswap</h2>
                <div className={Style.Tokens_box_header}>
                  <div className={Style.Tokens_box_ethereum}>
                    <p>
                      <Image
                        src={images.etherlogo}
                        alt="ether"
                        width={20}
                        height={20}
                      />
                    </p>
                    <p>Ethereum</p>
                  </div>
                  <div className={Style.Tokens_box_search}>
                    <p>
                      <Image src={images.search} alt="image" width={20} height={20} />
                    </p>
                    <input
                      type="text"
                      placeholder="Filter tokens"
                      onChange={(e) => setSearchItem(e.target.value)}
                      value={searchItem}
                    />
                  </div>
                </div>
        
                <AllTokens allTokenList={topTokensList} />
              </div>
            </div>
          );
};

export default Tokens;