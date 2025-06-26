// Header.js

import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import logo from "../../images/black-logo.png";
import ModalLogin from "../ModalLogin/ModalLogin";

import { AuthContext } from "../AuthContext.js";

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, admin } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header id="header">
      <nav id="nav" className={isMenuOpen ? 'active' : ''}>
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="Logo preta da Pricyla Store" />
          </Link>
        </div>
        <div className="hamburguer" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <ul id="menu">
          {
            user ? (
              <>
                <li><Link to="/" className="menu-item">HOME</Link></li>
                <li><Link to="/shoop" className="menu-item">COMPRE</Link></li>
                <li><Link to="/my-orders" className="menu-item">MEUS PEDIDOS</Link></li>
                {/* O link de pedidos para usuário comum foi removido por enquanto */}
                {/* <li><Link to="/orders" className="menu-item">PEDIDOS</Link></li> */}
                
                {/* ↓↓↓ CORREÇÃO AQUI ↓↓↓  */}
                {/* Agrupamos os links de administração juntos */}
                {admin && (
                  <>
                    <li><Link to="/AdministerPage" className="menu-item">CADASTRAR PRODUTOS</Link></li>
                    <li><Link to="/admin/orders" className="menu-item">GERENCIAR PEDIDOS</Link></li>
                  </>
                )}
              </>
            ) : (
              <>
                <li><Link style={{display: "none"}} to="/shoop" className="menu-item">COMPRE</Link></li>
                <li><Link style={{display: "none"}} to="/AdministerPage" className="menu-item">CADASTRO DE PRODUTOS</Link></li>
                <li><Link to="/" className="menu-item">HOME</Link></li>
                <li><a href="#register-container" className="menu-item">CADASTRE-SE</a></li>
              </>
            )
          }
          <li><ModalLogin /></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;