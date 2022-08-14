import React from 'react';
import "./styles/Header.css"
import logo from "../assets/logo.svg"
import categoriesIcon from "../assets/categories-icon.svg"

const Header = () => {
    return (
        <div className="header">
            <img src={logo} alt="" className="logo"/>
            <div className="categories">
                <p>Меню</p>
                <p>Напитки и десерты</p>
                <p>Акции</p>
            </div>
            <img src={categoriesIcon} className="categoriesIcon" alt=""/>
        </div>
    );
};

export default Header;