import React, { useEffect } from "react";
import "./InfosCarrousel.css";
import image1  from "../../images/fitness life 1.png"
import image2  from "../../images/fitness life 2.png"
import image3  from "../../images/fitness life 3.png"


function InfosCarrousel() {
  useEffect(() => {
    const infoSlider = document.getElementById("slider-content");
    const slides = document.querySelectorAll("#slider-content .slide");

    let idx = 0;

    function carrossel() {
      idx++;

      if (idx > slides.length - 1) {
        idx = 0;
      }

      infoSlider.style.transform = `translateX(${-idx * 33.3}%)`;
    }

    const intervalId = setInterval(carrossel, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section id="infos_carrossel">
      <div className="slider-content" id="slider-content">
        <div className="slide">
          <img src={image1} alt="Info Slide 1"></img>
          <div className="carrossel_card_text">
            <h2>Visite nosso instagram</h2>
            <p>Produtos que irão garantir seu estilo e conforto.</p>
          </div>
        </div>
        <div className="slide">
          <img src={image2} alt="Info Slide 2"></img>
          <div className="carrossel_card_text">
            <h2>Discrição</h2>
            <p>Produtos zero transparência e totalmente discretos.</p>
          </div>
        </div>
        <div className="slide">
          <img src={image3} alt="Info Slide 3"></img>
          <div className="carrossel_card_text">
            <h2>Não perca as novidades</h2>
            <p>Cadastre-se no nosso site e receba promoções e descontos via e-mail.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfosCarrousel;
