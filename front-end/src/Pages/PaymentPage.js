import React, { useContext, useEffect, useState } from 'react';
import TotalizingValuePayment from '../Components/TotalizingValuePayment/TotalizingValuePayment';
import { AuthContext } from '../Components/AuthContext';

function PaymentPage() {
  const { user } = useContext(AuthContext);
  const prefix = "priscylaStoreCartproducts_";
  const sufix = user;
  const storageIdentifier = prefix.concat(sufix);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem(storageIdentifier);
    if (storedProducts) {
      setCartData(JSON.parse(storedProducts));
    }
  }, [storageIdentifier]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Finalizar Pedido</h1>
      <TotalizingValuePayment data={cartData} />
    </div>
  );
}

export default PaymentPage;
