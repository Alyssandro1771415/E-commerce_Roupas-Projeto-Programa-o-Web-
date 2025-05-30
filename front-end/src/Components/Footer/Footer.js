import React from "react";
import "./Footer.css";
import logo from "../../images/black-logo.png"

function Footer() {

    return (

        <footer>
            <h4>Copyright 2023 PricylaStore</h4>
            <h4>Instagram: @pricylastore</h4>
            <h4>Phone Number: +55 (83)9650-0630</h4>
            <img src={logo} alt="Imagem de logo da loja"></img>
        </footer>

    );

}

export default Footer;
