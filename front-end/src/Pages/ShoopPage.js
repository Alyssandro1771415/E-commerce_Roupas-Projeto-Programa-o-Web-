import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../Components/ProductCards/ProductCard";
import "./background.css";
import Spinner from 'react-bootstrap/Spinner';
import CartLateralButton from "../Components/CartLateralButton/CartLateralButton";
import { AuthContext } from '../Components/AuthContext.js';

function ShopPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const prefix = "priscylaStoreCartproducts_";
  const sufix = user;
  const storageIdentifier = prefix.concat(sufix);
  
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem(storageIdentifier);
    return storedProducts ? JSON.parse(storedProducts) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/getProductDatas", {
          method: "GET"
        });

        if(!response.ok) {
          console.log("Erro na consulta via front!");
          return;
        }

        const data = await response.json();
        const productsData = Array.isArray(data.productsWithImages)
          ? data.productsWithImages
              .filter(prod => Number(prod.quantity) > 0)
              .map(datas => ({
                product_name: datas.productName,
                product_value: datas.value,
                quantity: datas.quantity,
                image: datas.imageUrl
              }))
          : [];

        setData(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados do Firestore:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    localStorage.setItem(storageIdentifier, JSON.stringify(products));
  }, [products, storageIdentifier]);

  const addToCart = (productData) => {
    setProducts(prevProducts => {
      const existingProductIndex = prevProducts.findIndex(
        product => product.product_name === productData.product_name
      );

      let updatedProducts;
      
      if (existingProductIndex !== -1) {
        updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: (updatedProducts[existingProductIndex].quantity || 1) + (productData.quantity || 1)
        };
      } else {
        updatedProducts = [...prevProducts, {
          ...productData,
          quantity: productData.quantity || 1
        }];
      }

      return updatedProducts;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100vw",
        flexWrap: "wrap",
      }}
      id="Page"
    >
      <CartLateralButton data={products} />
  
      {loading ? (
        <div style={{ margin: "50vh" }}>
          <Spinner style={{ width: "7vw", height: "7vw" }} animation="grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10vh", justifyContent: "center"}}>
          {data.map((item, index) => (
            <ProductCard
              key={index}
              image={item.image}
              product_name={item.product_name}
              product_value={item.product_value}
              product_quantity={item.quantity}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopPage;