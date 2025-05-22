import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { CartCheck } from 'react-bootstrap-icons'
import "./CartLateralButton.css";

function CartLateralButton(props) {
    const [lister, setLister] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        let total = 0;
        props.data.forEach((product) => {
            total += product.quantity * product.product_value;
        });
        setTotalValue(total);
    }, [props.data]);

    const toggleList = () => {
        setLister((prevLister) => !prevLister);
    };

    return (
        <div className="btn cart-button d-flex flex-column">
            <div className="list-items-button" onClick={toggleList}>
                <CartCheck />
                <i className="bi bi-arrow-bar-down arrow-down"></i>
                <span className="bi bi-cart-check-fill">Cart</span>
            </div>
            <div className={`list-items ${lister ? "" : "d-none"}`}>
                <hr />
                <ul>
                    {props.data.map((product, index) => (
                        <li key={index}>
                            <div className="d-flex flex-row">
                                <div className="packed-lunch d-flex">
                                    <img src={product.image} alt={product.product_name} />
                                    <div>
                                        <p>{product.product_name}</p>
                                        <p>
                                            <b>{product.quantity} x</b> {product.product_value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <hr className="divisory"></hr>
            <h5 className="totalValue">Total: R${totalValue}</h5>
            <Link to="/Payment" className="btn btn-success m-2 conclude menu-item">
                Concluir Pedido
            </Link>
        </div>
    );
}

export default CartLateralButton;
