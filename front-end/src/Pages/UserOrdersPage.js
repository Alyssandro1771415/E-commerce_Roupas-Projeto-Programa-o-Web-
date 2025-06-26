import React, { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Alert } from 'react-bootstrap';
import './background.css';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('authorization-token');
    
    if (!token) {
      throw new Error('Você precisa estar logado para ver seus pedidos');
    }

    const response = await fetch("http://localhost:5000/api/user/orders", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      throw new Error('Erro ao carregar seus pedidos');
    }

    const data = await response.json();
    setOrders(data.orders);
  } catch (err) {
    setError(err.message);
    // Opcional: redirecionar para login se for erro 401
    if (err.message.includes('Sessão expirada')) {
      localStorage.removeItem('authorization-token');
      // window.location.href = '/login'; // Descomente se quiser redirecionar
    }
  } finally {
    setLoading(false);
  }
};

    fetchUserOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <Badge bg="warning" text="dark">Pendente</Badge>;
      case 'PAID': return <Badge bg="info">Pago</Badge>;
      case 'SHIPPED': return <Badge bg="primary">Enviado</Badge>;
      case 'DELIVERED': return <Badge bg="success">Entregue</Badge>;
      case 'CANCELED': return <Badge bg="danger">Cancelado</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.Product.value);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5 py-5">
      <br></br>
      <br></br>
      <br></br>
      <h1 className="mb-4">Meus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="col-12 text-center py-5">
          <h4>Você ainda não realizou nenhum pedido</h4>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-lg-6 col-md-8 col-12 mb-4 mx-auto">
              <Card 
                className="h-100 shadow-sm" 
                style={{ 
                  borderLeft: `5px solid ${getStatusColor(order.order_status)}`,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5>Pedido #{order.id}</h5>
                      <small className="text-muted">Data: {formatDate(order.order_date)}</small>
                    </div>
                    <div className="text-end">
                      <div>{getStatusBadge(order.order_status)}</div>
                      <div className="fw-bold mt-1">R$ {calculateTotal(order.items)}</div>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <>
                      <hr />
                      <h6 className="mb-3">Itens do Pedido:</h6>
                      <ul className="list-unstyled">
                        {order.items && order.items.length > 0 ? (
                          order.items.map(item => (
                            <li key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold">{item.quantity}x</span> {item.Product?.productName || 'Produto não encontrado'}
                              </div>
                              <div className="text-muted">
                                R$ {(item.Product?.value * item.quantity).toFixed(2)}
                              </div>
                            </li>
                          ))
                        ) : (
                          <li>Nenhum item encontrado para este pedido.</li>
                        )}
                      </ul>
                      <div className="d-flex justify-content-between mt-3 fw-bold">
                        <span>Total:</span>
                        <span>R$ {calculateTotal(order.items)}</span>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'PENDING': return '#ffc107';
    case 'PAID': return '#0dcaf0';
    case 'SHIPPED': return '#0d6efd';
    case 'DELIVERED': return '#198754';
    case 'CANCELED': return '#dc3545';
    default: return '#6c757d';
  }
}

export default UserOrdersPage;