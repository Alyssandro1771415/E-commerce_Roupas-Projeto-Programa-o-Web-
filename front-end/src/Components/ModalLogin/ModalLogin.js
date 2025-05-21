import React, { useState, useContext } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from "../AuthContext.js";


import image from "../../images/loginBackImage.jpg";

const ModalLogin = () => {
    const { user, login, logout } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLoginClick = async () => {
        const email = document.getElementById('formBasicUsername').value;
        const password = document.getElementById('formBasicPassword').value;

        const success = await login(email, password);
        if (success) {
            handleClose();
        } else {
            document.getElementById("loginError").style.display = "inline";
        }
    };

    return (
        <div>
            {user ? (
                <Button type="button" variant="danger" onClick={logout}>
                    LogOut
                </Button>
            ) : (
                <Button variant="primary" onClick={handleShow}>
                    Login
                </Button>
            )}

            <Modal show={show} onHide={handleClose} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingRight: "0px",
                    }}
                >
                    <Form style={{ opacity: "93%", background: "white" }}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control type="text" placeholder="Digite seu nome de usuário" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="Digite sua senha" />
                        </Form.Group>
                        <p id="loginError">Login ou senha Incorretos!</p>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleLoginClick}>
                        Entrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalLogin;
