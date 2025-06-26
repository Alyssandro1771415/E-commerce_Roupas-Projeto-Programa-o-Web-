import React from "react";
import ProductsRegisterForm from "../Components/ProductsRegisterForm/ProductsRegisterForm";
import ProductStockList from "../Components/ProductStockList/ProductStockList";
import "./background.css";

function AdministrationPage() {
    return (
        <div id="Page" className="container-fluid py-5 px-md-5">
            
            <ProductsRegisterForm />

            <hr className="my-5" />

            <ProductStockList />

        </div>
    );
}

export default AdministrationPage;