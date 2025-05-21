import React from "react";
import "./TotalizingValuePayment.css";

function TotalizingValuePayment() {
  return (
    <div className="totalizing-value-payment-container">
      <table className="payment-table">
        <thead>
          <tr>
            <th></th>
            <th>Nome do Produto</th>
            <th>Valor</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {/* Adicione linhas dinamicamente aqui, cada uma com uma chave única */}
        </tbody>
      </table>
    </div>
  );
}

export default TotalizingValuePayment;
