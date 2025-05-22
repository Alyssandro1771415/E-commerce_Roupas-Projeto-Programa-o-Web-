import React, { useState } from "react";
import "./RegisterContainer.css";
import vetorImage from "../../images/vetor_imagem-removebg-preview.png";

function RegisterContainer() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = { name, lastName, email, password };

      const response = await fetch("http://localhost:5000/api/user/cadaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      setName("");
      setLastName("");
      setEmail("");
      setPassword("");

      if (data.message === "Usuário cadastrado com sucesso!") {
        setSuccessMessage(true);
        setErrorMessage(false);
      } else {
        setSuccessMessage(false);
        setErrorMessage(true);
      }
    } catch (error) {
      setSuccessMessage(false);
      setErrorMessage(true);
      console.error("Erro ao criar usuário: ", error);
    }
  };

  return (
    <nav id="register-container">
      <h1 className="title-section">Cadastre-se</h1>
      <img src={vetorImage} alt="Imagem ilustrativa para cadastro"></img>
      <form
        onSubmit={handleSubmit}
        action="https://gmail.us21.list-manage.com/subscribe/post?u=235973d1c044bf9fd0102b24b&amp;id=f9fcb5f333&amp;f_id=0046ebe1f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_self"
      >
        <div className="formContainer">
          <h3>Cadastre-se para receber novidades e promoções via e-mail!</h3>
          <input
            className="formInput"
            id="name"
            name="NAME"
            type="text"
            placeholder="Nome"
            value={name}
            onChange={handleNameChange}
            required
          ></input>
          <input
            className="formInput"
            id="lastName"
            name="LASTNAME"
            type="text"
            placeholder="Sobrenome"
            value={lastName}
            onChange={handleLastNameChange}
            required
          ></input>
          <input
            className="formInput"
            id="email"
            name="EMAIL"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
            required
          ></input>
          <input
            className="formInput"
            id="password"
            name="PASSWORD"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={handlePasswordChange}
            required
          ></input>
          <div id="text_entry" aria-hidden="true">
            <input
              type="text"
              name="b_235973d1c044bf9fd0102b24b_f9fcb5f333"
              tabIndex="-1"
              value=""
              readOnly
            ></input>
          </div>
          {successMessage && <h5 className="sucess-cadaster">Cadastro realizado com sucesso!</h5>}
          {errorMessage && <h5 className="cadaster-error">Erro ao realizar cadastro!</h5>}
          <input
            id="cadastro"
            type="submit"
            value="CADASTRE-SE"
          ></input>
        </div>
      </form>
    </nav>
  );
}

export default RegisterContainer;