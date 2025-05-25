import React, { useState, useContext } from "react";
import "./RegisterContainer.css";
import vetorImage from "../../images/vetor_imagem-removebg-preview.png";

import { AuthContext } from "../AuthContext";

function RegisterContainer() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    cpf: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    celular: "",
  });

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const { user } = useContext(AuthContext);

  if (user) {
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/user/cadaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
        cpf: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        celular: "",
      });

      setSuccessMessage(data.message === "Usuário cadastrado com sucesso!");
      setErrorMessage(data.message !== "Usuário cadastrado com sucesso!");
    } catch (error) {
      setSuccessMessage(false);
      setErrorMessage(true);
      console.error("Erro ao criar usuário: ", error);
    }
  };

  return (
    <nav id="register-container">
      <h1 className="title-section">Cadastre-se</h1>
      <img src={vetorImage} alt="Imagem ilustrativa para cadastro" />
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <h3>Cadastre-se para receber novidades e promoções via e-mail!</h3>

          <input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
          <input name="lastName" placeholder="Sobrenome" value={formData.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />
          <input name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
          <input name="rua" placeholder="Rua" value={formData.rua} onChange={handleChange} required />
          <input name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} required />
          <input name="complemento" placeholder="Complemento (opcional)" value={formData.complemento} onChange={handleChange} />
          <input name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} required />
          <input name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
          <input name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
          <input name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} required />
          <input name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} required />

          {successMessage && <h5 className="sucess-cadaster">Cadastro realizado com sucesso!</h5>}
          {errorMessage && <h5 className="cadaster-error">Erro ao realizar cadastro!</h5>}

          <input id="cadastro" type="submit" value="CADASTRE-SE" />
        </div>
      </form>
    </nav>
  );
}

export default RegisterContainer;
