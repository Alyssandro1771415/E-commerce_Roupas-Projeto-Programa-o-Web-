import React, { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCards/ProductCard";
import "./background.css";
import Spinner from 'react-bootstrap/Spinner';
import CartLateralButton from "../Components/CartLateralButton/CartLateralButton";

function ShopPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Inicializando o estado products com o valor do localStorage
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem("priscylaStoreCartproducts");
    
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
    const existingProductIndex = products.findIndex(
      (product) => product.product_name === productData.product_name
    );

    let updatedProducts;

    if (existingProductIndex !== -1) {
      // Produto já existe, somar a quantidade
      updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += productData.quantity;
    } else {
      // Produto não existe, adicionar novo
      updatedProducts = [...products, productData];
    }

    setProducts(updatedProducts);
    console.log(updatedProducts);

    // Armazenar no localStorage
    localStorage.setItem("priscylaStoreCartproducts", JSON.stringify(updatedProducts));
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
