import React, { useState } from "react";
import "./ProductCard.css";

function ProductCard({ image, product_name, product_value, product_quantity, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity <= product_quantity-1) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  return (
    <div className="card">
      <img src={image} alt={product_name} />
      <h2>{product_name}</h2>
      <p>R$ {product_value}</p>
      <div className="quantity">
        <button className="btn-quantity btn-decrement" onClick={handleDecrement}>
          -
        </button>
        <input type="text" value={quantity} readOnly />
        <button className="btn-quantity btn-increment" onClick={handleIncrement}>
          +
        </button>
      </div>
      <button className="btn btn-add" onClick={() => addToCart({ product_name, product_value, image, quantity })}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

export default ProductCard;
