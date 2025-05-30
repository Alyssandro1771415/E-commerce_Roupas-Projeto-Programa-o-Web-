import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../Components/AuthContext.js'; 
import Spinner from 'react-bootstrap/Spinner';
import "./background.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, token } = useContext(AuthContext); 

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Por favor, faça login para visualizar seus pedidos.");
      return;
    }

    const fetchUserOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/order/history", { 
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao buscar pedidos: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error("Falha ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [token, user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
        <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Carregando pedidos...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', color: 'red' }}>
        <p><strong>Erro:</strong> {error}</p>
      </div>
    );
  }

  if (orders.length === 0 && !error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Meus Pedidos</h1>
        <p>Você ainda não realizou nenhum pedido.</p>
      </div>
    );
  }

  return (
    <div className="orders-page-container" style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Meus Pedidos</h1>
      {orders.map(order => (
        <div key={order.id} style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          marginBottom: '25px', 
          padding: '20px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.4em', color: '#555', margin: 0 }}>
              Pedido #{order.id}
            </h2>
            <span style={{ fontSize: '0.9em', color: '#777' }}>
              Data: {new Date(order.orderDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#333' }}>Itens do Pedido:</strong>
            {order.items && order.items.length > 0 ? (
              <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '10px' }}>
                {order.items.map(item => (
                  <li key={`${order.id}-${item.Product ? item.Product.id : item.productId}`} style={{
                    borderBottom: '1px dashed #f0f0f0', 
                    padding: '12px 0', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500', color: '#444' }}>{item.Product?.productName || 'Produto Indisponível'}</span>
                      <span style={{ fontSize: '0.9em', color: '#777' }}> (Quantidade: {item.quantity})</span>
                    </div>
                    <span style={{ fontWeight: '500', color: '#444' }}>
                      R$ {((item.Product?.value || 0) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777', fontStyle: 'italic' }}>Não foi possível carregar os itens deste pedido ou o pedido não possui itens.</p>
            )}
          </div>
          
          <div style={{ 
            textAlign: 'right', 
            fontSize: '1.2em', 
            fontWeight: 'bold', 
            marginTop: '20px', 
            paddingTop: '15px', 
            borderTop: '1px solid #f0f0f0',
            color: '#333'
          }}>
            Valor Total do Pedido: R$ {order.totalOrderValue ? order.totalOrderValue.toFixed(2) : '0.00'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;