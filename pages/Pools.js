import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import images from "../assets";
import Style from "../styles/Pools.module.css";

import { PoolAdd, PoolConnect } from "../Components/index";

const Pool = () => {
    return (
        <div className={Style.Pool}>
            <PoolAdd />
            {/* <PoolConnect /> */}

        </div>
    );
};

export default Pool;