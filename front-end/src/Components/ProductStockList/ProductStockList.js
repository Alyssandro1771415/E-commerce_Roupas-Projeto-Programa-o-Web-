import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Form, Button } from 'react-bootstrap';

function ProductStockList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authorization-token');
      const response = await fetch('http://localhost:5000/api/product/getProductDatas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar produtos');
      }
      const data = await response.json();
      setProducts(data.productsWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    setEditingValues(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleSaveStock = async (productId) => {
    const newQuantity = editingValues[productId];
    if (newQuantity === undefined || newQuantity < 0) return;

    try {
      const token = localStorage.getItem('authorization-token');
      const response = await fetch(`http://localhost:5000/api/product/stock/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: Number(newQuantity) })
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o estoque.');
      }

      alert('Estoque atualizado com sucesso!');
      setEditingValues(prev => {
        const newVals = { ...prev };
        delete newVals[productId];
        return newVals;
      });
      fetchProducts();
      
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="warning">{error}</Alert>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 className="text-center mb-4">Estoque Atual de Produtos</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#ID</th>
            <th>Nome do Produto</th>
            <th style={{ minWidth: '120px' }}>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.productName}</td>
              <td>
                <Form.Control 
                  type="number"
                  value={editingValues[product.id] ?? product.quantity}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  min="0"
                />
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleSaveStock(product.id)}
                  disabled={editingValues[product.id] === undefined}
                >
                  Salvar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductStockList;