import React from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

function TotalizingValuePayment({ data, onQuantityChange, onRemoveItem }) {
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
    const token = localStorage.getItem('authorization-token');
    
    if (!token) {
      alert('Você precisa estar logado para realizar o pagamento');
      return;
    }

    
    const body = {
      items: data.map(product => ({
        id: product.id,
        title: product.product_name,
        quantity: product.quantity,
        unit_price: Number(product.product_value)
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/payment/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization-token": token 
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }

      const result = await response.json();

      if (result.email) {
        // Limpa o carrinho do localStorage após o sucesso
        localStorage.removeItem(`priscylaStoreCartproducts_${result.email}`);
      }
      
      const paymentUrl = result.init_point || result.sandbox_init_point;
      if (paymentUrl) {
         window.open(paymentUrl, "_blank");
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
              <th style={headerStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => {
              const value = Number(product.product_value);
              return (
                <tr key={index}>
                  <td style={thTdStyle}>{product.product_name}</td>
                  <td style={thTdStyle}>R${value.toFixed(2)}</td>
                  <td style={thTdStyle}>
                    <IconButton 
                      size="small" 
                      onClick={() => onQuantityChange && onQuantityChange(product.product_name, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    {product.quantity}
                    <IconButton 
                      size="small" 
                      onClick={() => onQuantityChange && onQuantityChange(product.product_name, product.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </td>
                  <td style={thTdStyle}>R${(value * product.quantity).toFixed(2)}</td>
                  <td style={thTdStyle}>
                    <IconButton 
                      size="small" 
                      onClick={() => onRemoveItem && onRemoveItem(product.product_name)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </td>
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
            disabled={data.length === 0}
          >
            Pagar
          </button>
        </div>
      </div>
    );
}

export default TotalizingValuePayment;