import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

//IMPORT INTERNAL
import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index";



const NavBar = () => {
  const menuItems = [
    {
      name: "Swap",
      link: "/",
    },
    {
      name: "Tokens",
      link: "/",
    },
    {
      name: "Pools",
      link: "/",
    },
  ];
  //USESTATE
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);

  return(
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
      <div className={Style.NavBar_box_left}>
        {/*  LOGO IMAGE */}
        <div className={Style.NavBar_box_left_img}>
            <Image src={images.uniswap} alt="logo" width={50} height={50} />
        </div>
        {/* MENU ITEMS */}
        <div className={Style.NavBar_box_left_menu}>
          {menuItems.map((el, i) => (
                <Link 
                key={i + 1} 
                href={{ pathname: `${el.name}`, query: `${el.link}` }}>
                  <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
                  
                </Link>
            ))}
        </div>
      </div>
      <div className={Style.NavBar_box_right}>Right</div>
      </div>
    </div>
  )

};

export default NavBar