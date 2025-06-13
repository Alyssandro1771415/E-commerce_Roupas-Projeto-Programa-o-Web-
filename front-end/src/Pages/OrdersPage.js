import React, { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Form, Alert } from 'react-bootstrap';
import './background.css';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        // <-- CORREÇÃO: URL ajustada para a nova rota
        const response = await fetch("http://localhost:5000/api/admin/orders", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar pedidos');
        }

        const data = await response.json();
        if (data.orders && data.orders.length > 0) {
          console.log("INSPECIONANDO O PRIMEIRO PEDIDO RECEBIDO:", data.orders[0]);
      }
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // <-- CORREÇÃO: URL ajustada para a nova rota
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      const responseData = await response.json();
      
      setOrders(orders.map(order => 
        order.id === orderId ? responseData.data : order
      ));
      
      setFeedback({
        type: 'success',
        message: `Status do pedido atualizado com sucesso`
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message
      });
    }
    
    setTimeout(() => setFeedback(null), 3000);
  };


  const filteredOrders = statusFilter === 'all' 
  ? orders 
  : orders.filter(order => order.status === statusFilter);

const getStatusBadge = (status) => {
  switch (status) {
    case 'pendente': return <Badge bg="warning" text="dark">Pendente</Badge>;
    case 'processando': return <Badge bg="info">Processando</Badge>;
    case 'enviado': return <Badge bg="primary">Enviado</Badge>;
    case 'entregue': return <Badge bg="success">Entregue</Badge>;
    case 'cancelado': return <Badge bg="danger">Cancelado</Badge>;
    default: return <Badge bg="secondary">{status}</Badge>;
  }
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
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
  <div className="container py-5">
    <h1 className="mb-4">Gerenciamento de Pedidos</h1>
    
    {feedback && (
      <Alert variant={feedback.type} onClose={() => setFeedback(null)} dismissible>
        {feedback.message}
      </Alert>
    )}

    <div className="mb-4">
      <Form.Select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ width: '200px' }}
      >
        <option value="all">Todos os status</option>
        <option value="pendente">Pendente</option>
        <option value="processando">Processando</option>
        <option value="enviado">Enviado</option>
        <option value="entregue">Entregue</option>
        <option value="cancelado">Cancelado</option>
      </Form.Select>
    </div>

    {filteredOrders.length === 0 ? (
      <div className="col-12 text-center py-5">
        <h4>Nenhum pedido encontrado</h4>
      </div>
    ) : (
      <div className="row g-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="col-12"> {/* CORREÇÃO: usar order.id */}
            <Card className="shadow-sm" style={{ borderLeft: `5px solid ${getStatusColor(order.status)}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5>Pedido #{order.id}</h5> {/* CORREÇÃO: usar order.id */}
                    <div className="text-muted">Cliente: {order.User?.name || 'N/A'}</div> {/* CORREÇÃO: A inclusão do model User vem com U maiúsculo */}
                    <small className="text-muted">Data: {formatDate(order.createdAt)}</small>
                  </div>
                  <div className="text-end">
                    <div>{getStatusBadge(order.status)}</div>
                    <h5 className="mt-2">R$ {order.total.toFixed(2)}</h5>
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">Itens do Pedido:</h6>

                <ul className="list-unstyled">
                  {order.items && order.items.length > 0 ? (
                    order.items.map(item => (
                      <li key={item.id} className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <span className="fw-bold">{item.quantity}x</span> {item.Product?.productName || 'Produto não encontrado'}
                        </div>
                        <div className="text-muted">
                          R$ {item.price.toFixed(2)} (unid.)
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>Nenhum item encontrado para este pedido.</li>
                  )}
                </ul>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Form.Select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    size="sm"
                    style={{ width: '200px' }}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="processando">Processando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </div>
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
      case 'pendente': return '#ffc107';
      case 'processando': return '#0dcaf0';
      case 'enviado': return '#0d6efd';
      case 'entregue': return '#198754';
      case 'cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  }

export default AdminOrdersPage;