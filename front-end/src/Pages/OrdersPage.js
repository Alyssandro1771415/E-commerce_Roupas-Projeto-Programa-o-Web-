import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../Components/AuthContext.js'; 
import Spinner from 'react-bootstrap/Spinner';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    console.log("OrdersPage useEffect - Início. Token:", token, "User:", user ? user : 'Usuário não definido');

    if (!token) {
      console.warn("OrdersPage: Condição !token VERDADEIRA. Configurando erro de login. Token atual:", token);
      setLoading(false);
      setError("Por favor, faça login para visualizar seus pedidos.");
      return; 
    }

    
    console.log("OrdersPage: Token encontrado. Preparando para buscar pedidos...");
    const fetchUserOrders = async () => {
      setLoading(true);
      setError(null);
      console.log("OrdersPage: fetchUserOrders - Buscando pedidos com token:", token);
      try {
        const response = await fetch("http://localhost:5000/api/order/history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("OrdersPage: fetchUserOrders - Resposta da API status:", response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Erro ao decodificar JSON da resposta de erro da API." }));
          console.error("OrdersPage: fetchUserOrders - Erro da API:", errorData);
          throw new Error(errorData.message || `Erro ao buscar pedidos: ${response.status}`);
        }

        const data = await response.json();
        console.log("OrdersPage: fetchUserOrders - Dados recebidos da API:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("OrdersPage: fetchUserOrders - Dados da API não são um array:", data);
          setError("Formato de dados inesperado recebido do servidor.");
          setOrders([]);
        }
      } catch (err) {
        console.error("OrdersPage: fetchUserOrders - Falha na busca:", err);
        setError(err.message || "Ocorreu um erro desconhecido ao buscar os pedidos.");
        setOrders([]);
      } finally {
        setLoading(false);
        console.log("OrdersPage: fetchUserOrders - Busca finalizada.");
      }
    };

    fetchUserOrders();

  }, [token, user]); // Dependências do useEffect

  const ordersPageStyle = {
    width: '100%',
    maxWidth: '960px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: '"Lato", sans-serif',
  };

  if (loading) {
    console.log("OrdersPage: Renderizando estado de Loading.");
    return (
      <div style={ordersPageStyle}>
        <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', marginTop: '50px', color: '#007bff' }}>
          <span className="visually-hidden">Carregando pedidos...</span>
        </Spinner>
        <p style={{ marginTop: '10px', color: '#555' }}>Carregando seus pedidos...</p>
      </div>
    );
  }

  if (error) {
    // Log para quando o componente renderiza o estado de erro.
    console.log("OrdersPage: Renderizando estado de Erro:", error);
    return (
      <div style={ordersPageStyle}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Meus Pedidos</h1>
        <div style={{ padding: '20px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px' }}>
          <p><strong>Erro:</strong> {error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    console.log("OrdersPage: Renderizando estado de 'Nenhum pedido'.");
    return (
      <div style={ordersPageStyle}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>Meus Pedidos</h1>
        <p style={{ fontSize: '1.1em', color: '#555' }}>Você ainda não realizou nenhum pedido.</p>
      </div>
    );
  }

  console.log("OrdersPage: Renderizando lista de pedidos. Quantidade:", orders.length);
  return (
    <div style={{...ordersPageStyle, textAlign: 'left'}}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Meus Pedidos</h1>
      {orders.map((order, orderIndex) => (
        <div key={order.id || `order-${orderIndex}`} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          marginBottom: '25px',
          padding: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.4em', color: '#555', margin: 0, fontWeight: '600' }}>
              Pedido #{order.id || `ID ${orderIndex + 1}`}
            </h2>
            <span style={{ fontSize: '0.9em', color: '#777' }}>
              Data: {order.orderDate ? new Date(order.orderDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Data Indisponível'}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>Itens do Pedido:</strong>
            {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
              <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '0' }}>
                {order.items.map((item, itemIndex) => (
                  <li key={item.Product?.id || item.productId || `item-${order.id || orderIndex}-${itemIndex}`} style={{
                    borderBottom: itemIndex < order.items.length - 1 ? '1px dashed #f0f0f0' : 'none',
                    padding: '12px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flexGrow: 1, marginRight: '10px' }}>
                      <span style={{ fontWeight: '500', color: '#444' }}>{item.Product?.productName || 'Produto Indisponível'}</span>
                      <span style={{ fontSize: '0.9em', color: '#777', marginLeft: '5px' }}> (Quantidade: {item.quantity || 0})</span>
                    </div>
                    <span style={{ fontWeight: '500', color: '#444', whiteSpace: 'nowrap' }}>
                      R$ {typeof item.Product?.value === 'number' && typeof item.quantity === 'number' ?
                          (item.Product.value * item.quantity).toFixed(2) :
                          'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777', fontStyle: 'italic', margin: '10px 0' }}>
                Nenhum item neste pedido ou itens não puderam ser carregados.
              </p>
            )}
          </div>

          <div style={{
            textAlign: 'right',
            fontSize: '1.2em',
            fontWeight: 'bold',
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid #f0f0f0',
            color: '#28a745'
          }}>
            Valor Total do Pedido: R$ {typeof order.totalOrderValue === 'number' ? order.totalOrderValue.toFixed(2) : '0.00'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
