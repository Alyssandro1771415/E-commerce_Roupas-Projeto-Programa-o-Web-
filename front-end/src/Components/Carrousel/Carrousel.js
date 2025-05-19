import React, { useEffect, useState } from "react";
import images1 from "../../images/banner1.png";
import images2 from "../../images/banner2.png";
import images3 from "../../images/banner3.png";

function Carrousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRadioChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="slider" id="img">
      {[0, 1, 2].map((index) => (
        <input
          key={index}
          className="input_check"
          id={`input${index + 1}`}
          name="slide"
          type="radio"
          checked={index === currentSlide}
          onChange={() => handleRadioChange(index)}
        />
      ))}

      <div className="slider-content">
        <img src={images1} className="slider-item" alt="Banner 1" />
        <img src={images2} className="slider-item" alt="Banner 2" />
        <img src={images3} className="slider-item" alt="Banner 3" />
      </div>
    </section>
  );
}

export default Carrousel;
