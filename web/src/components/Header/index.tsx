import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import "./style.css";
import logo from "../../assets/logo.svg";

const Header: React.FC = () => {
  return (
    <header>
      <img src={logo} alt="Logo Ecoleta" />
      <Link to="/">
        <FiArrowLeft />
        Voltar para home
      </Link>
    </header>
  );
};

export default Header;
