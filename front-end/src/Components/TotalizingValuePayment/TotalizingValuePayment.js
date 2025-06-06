import React from 'react';

function TotalizingValuePayment({ data }) {
  const total = data.reduce((acc, product) => {
    const value = Number(product.product_value);
    return acc + value * product.quantity;
  }, 0);

  const containerStyle = {
    marginBottom: "25vh",
    marginTop: "25vh",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "1000px",
    marginLeft: "auto",
    marginRight: "auto"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem"
  };

  const thTdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    fontSize: "1rem"
  };

  const headerStyle = {
    ...thTdStyle,
    fontWeight: "bold",
    backgroundColor: "#f7f7f7"
  };

  const totalStyle = {
    textAlign: "right",
    marginTop: "1.5rem",
    fontSize: "1.25rem",
    fontWeight: "bold"
  };

  const buttonStyle = {
    marginTop: "2rem",
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ':hover': {
      backgroundColor: "#0056b3"
    }
  };

  const handlePayment = async () => {
    // Obter o token do localStorage
    const token = localStorage.getItem('authorization-token');
    
    if (!token) {
      alert('Você precisa estar logado para realizar o pagamento');
      return;
    }

    const items = data.map(product => ({
      id: product.id, // Adicionei o ID do produto que será necessário no backend
      title: product.product_name,
      quantity: product.quantity,
      unit_price: Number(product.product_value)
    }));

    try {
      const response = await fetch("http://localhost:5000/api/payment/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization-token": token // Incluindo o token no header
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }

      const result = await response.json();
      
      if (result.init_point) {
        window.location.href = result.init_point;
      } else if (result.sandbox_init_point) {
        // Para ambiente de desenvolvimento/sandbox
        window.location.href = result.sandbox_init_point;
      } else {
        alert("Erro: Link de pagamento não recebido");
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      alert(error.message || "Erro ao processar o pagamento.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Resumo do Pedido</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Produto</th>
            <th style={headerStyle}>Valor Unitário</th>
            <th style={headerStyle}>Quantidade</th>
            <th style={headerStyle}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => {
            const value = Number(product.product_value);
            return (
              <tr key={index}>
                <td style={thTdStyle}>{product.product_name}</td>
                <td style={thTdStyle}>R${value.toFixed(2)}</td>
                <td style={thTdStyle}>{product.quantity}</td>
                <td style={thTdStyle}>R${(value * product.quantity).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={totalStyle}>
        Total: R${total.toFixed(2)}
      </div>
      <div style={{ textAlign: "center" }}>
        <button 
          style={buttonStyle} 
          onClick={handlePayment}
          disabled={data.length === 0} // Desabilita se não houver produtos
        >
          Pagar
        </button>
      </div>
    </div>
  );
}

export default TotalizingValuePayment;