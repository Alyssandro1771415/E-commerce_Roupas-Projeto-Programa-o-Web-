import React, { useContext, useEffect, useState } from 'react';
import TotalizingValuePayment from '../Components/TotalizingValuePayment/TotalizingValuePayment';
import { AuthContext } from '../Components/AuthContext';

function PaymentPage() {
  const { user } = useContext(AuthContext);
  const prefix = "priscylaStoreCartproducts_";
  const storageIdentifier = prefix.concat(user);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem(storageIdentifier);
    if (storedProducts) {
      setCartData(JSON.parse(storedProducts));
    }
  }, [storageIdentifier]);

  useEffect(() => {
    if (cartData.length > 0) {
      localStorage.setItem(storageIdentifier, JSON.stringify(cartData));
    } else {
      localStorage.removeItem(storageIdentifier);
    }
  }, [cartData, storageIdentifier]);

  const handleQuantityChange = (productName, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartData(prevCart => 
      prevCart.map(item => 
        item.product_name === productName 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const handleRemoveItem = (productName) => {
    setCartData(prevCart => prevCart.filter(item => item.product_name !== productName));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Finalizar Pedido</h1>
      <TotalizingValuePayment 
        data={cartData}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default PaymentPage;