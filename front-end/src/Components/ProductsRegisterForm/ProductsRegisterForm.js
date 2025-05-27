import React, { useState } from 'react';
import './ProductsRegisterForm.css';


const ProductsRegisterForm = () => {
    const [productName, setProductName] = useState('');
    const [productValue, setProductValue] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productImage, setProductImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("image", productImage);
            formData.append("productName", productName);
            formData.append("productQuantity", productQuantity);
            formData.append("productValue", productValue);
    
            const response = await fetch("http://localhost:5000/api/product/registerProduct", {
                method: "POST",
                body: formData,
            });
        
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
    
            setProductName('');
            setProductValue('');
            setProductQuantity('');
            setProductImage(null);
    
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error);
        }
    };
    

    return (
        <div className="form-container">
            <h1>Página do Administrador</h1>
            <hr></hr>
            <h2>Cadastro de Produtos</h2>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data" className='form-products-register'>
                <label htmlFor="nome">Nome do Produto:</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />

                <label htmlFor="valor">Valor do Produto:</label>
                <input
                    type="text"
                    id="valor"
                    name="valor"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    required
                />

                <label htmlFor="Quantidade">Quantidade do Produto:</label>
                <input
                    type="text"
                    id="Quantidade"
                    name="Quantidade"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    required
                />

                <label htmlFor="imagem">Imagem do Produto:</label>
                <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />

                <button type="submit">CADASTRO DE PRODUTOS</button>

            </form>
        </div>
    );
};

export default ProductsRegisterForm;
