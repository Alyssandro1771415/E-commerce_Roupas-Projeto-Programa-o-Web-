import React from "react"
import "./WhatsappIcon.css"
import icon from "../../images/whatasapp logo.jpg"

function WhatasappIcon() {

    return (
        <div id="whatsapp-box">
            <a href="//wa.me/558396500630" target="_blank">
                <img id="whatsapp" src={icon} ></img>
            </a>
        </div>
    );

}

export default WhatasappIcon;