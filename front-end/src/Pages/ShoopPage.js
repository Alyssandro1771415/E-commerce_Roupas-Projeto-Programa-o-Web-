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
  
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem("priscylaStoreCartproducts");;

    if (storedProducts) {
      return JSON.parse(storedProducts);
    }

    return [];
  });

  useEffect(() => {

    const productsData = [];

    const fetchData = async () => {
      try {

        const response = await fetch("http://localhost:5000/api/product/getProductDatas", {
          method: "GET"
        });

        if(!response.ok){
          console.log("Erro na consulta via front!");
        }

        const data = await response.json();

        for (const datas of data.productsWithImages) {

          try {
            productsData.push({
              product_name: datas.productName,
              product_value: datas.value,
              image: datas.imageUrl

            })
          } catch (error) {
            console.log("Erro ao carregar os dados!");
          }

        }

        setData(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados do Firestore:", error);
      }
    };

    fetchData();
  }, []); 

const addToCart = (productData) => {
  let updatedProducts = [];


  const prefix = "priscylaStoreCartproducts_";
  const sufix = user;
    
  const storageIdentifier = prefix.concat(sufix);

  setProducts([productData]);

  const stored = JSON.parse(localStorage.getItem(storageIdentifier)) || [];
    
  updatedProducts = [...stored];

  const existingProductIndex = updatedProducts.findIndex(
    (product, index) => index !== 0 && product.product_name === productData.product_name
  );

  if (existingProductIndex !== -1) {
    updatedProducts[existingProductIndex].quantity += productData.quantity;
  } else {
    updatedProducts.push(productData);
  }

  setProducts(updatedProducts.slice(1));

  localStorage.setItem(storageIdentifier, JSON.stringify(updatedProducts));
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
      <CartLateralButton data={products}></CartLateralButton>
  
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
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
  
}

export default ShopPage;
