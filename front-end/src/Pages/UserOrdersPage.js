import React, { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Alert } from 'react-bootstrap';
import './background.css';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/orders/me", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar seus pedidos');

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
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
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        <Alert variant="danger">{error}</Alert>
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
        <div className="text-center py-5">
          <h4>Você ainda não fez nenhum pedido.</h4>
        </div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-lg-4 col-md-6 col-12 mb-4">
              <Card className="h-100 shadow-sm" style={{ borderLeft: `5px solid ${getStatusColor(order.order_status)}` }}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5>Pedido #{order.id}</h5>
                      <small className="text-muted">Data: {formatDate(order.order_date)}</small>
                    </div>
                    <div>{getStatusBadge(order.order_status)}</div>
                  </div>
                  <hr />
                  <h6 className="mb-3">Itens do Pedido:</h6>
                  <ul className="list-unstyled">
                    {order.items && order.items.length > 0 ? (
                      order.items.map(item => (
                        <li key={item.id} className="d-flex justify-content-between align-items-center mb-1">
                          <div>
                            <span className="fw-bold">{item.quantity}x</span> {item.Product?.productName || 'Produto'}
                          </div>
                          <div className="text-muted">R$ {item.Product?.value}</div>
                        </li>
                      ))
                    ) : (
                      <li>Nenhum item neste pedido.</li>
                    )}
                  </ul>
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
