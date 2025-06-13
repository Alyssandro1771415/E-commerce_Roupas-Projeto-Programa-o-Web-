import React, { useState } from "react";
import "./ProductCard.css";

function ProductCard({ image, product_name, product_value, product_quantity, addToCart, currentQuantityInCart = 0 }) {
  const [quantity, setQuantity] = useState(1);

  const totalAfterAdd = quantity + currentQuantityInCart;
  const isMaxReached = totalAfterAdd > product_quantity;

  const handleIncrement = () => {
    if (!isMaxReached) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="card">
      <img src={image} alt={product_name} />
      <h2>{product_name}</h2>
      <p>R$ {product_value}</p>
      <div className="quantity">
        <button className="btn-quantity btn-decrement" onClick={handleDecrement}>-</button>
        <input type="text" value={quantity} readOnly />
        <button
          className="btn-quantity btn-increment"
          onClick={handleIncrement}
          disabled={totalAfterAdd >= product_quantity}
        >
          +
        </button>
      </div>
      <button
        className="btn btn-add"
        onClick={() => addToCart({ product_name, product_value, image, quantity })}
        disabled={isMaxReached}
      >
        {isMaxReached ? "Estoque máximo atingido" : "Adicionar ao Carrinho"}
      </button>
    </div>
  );
}


export default ProductCard;
