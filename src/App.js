import React, { useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([
    { name: 'Choose Product', quantity: 'Choose Quantity' },
  ]);
  const [order, setOrder] = useState([]);

  const handleProductChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].name = value;
    setProducts(updatedProducts);
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    if (products.length < 8) {
      setProducts([
        ...products,
        { name: 'Choose Product', quantity: 'Choose Quantity' },
      ]);
    }
  };

  const showOrder = () => {
    const validOrder = products.filter(
      (product) => product.name !== 'Choose Product' && product.quantity !== 'Choose Quantity'
    );
    setOrder(validOrder);
  };

  const readOrder = () => {
    if (order.length === 0) {
      alert('Please add items to your order.');
      return;
    }
  
    const orderText = order.map((product) => `${product.name}: ${product.quantity}`).join(', ');
    fetch(`https://api.voicerss.org/?key=${process.env.REACT_APP_VOICERSS_API_KEY}&hl=en-us&src=${encodeURIComponent(orderText)}`)
      .then(response => response.blob())
      .then(blob => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      });
    alert(`Your order is: ${orderText}`);
  };
  

  return (
    <div className="container">
      <h1>Product Order List</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>
                <select value={product.name} onChange={(e) => handleProductChange(index, e.target.value)}>
                  <option value="Choose Product">Choose Product</option>
                  <option value="Pencil">Pencil</option>
                  <option value="Eraser">Eraser</option>
                  <option value="Pens">Pens</option>
                </select>
              </td>
              <td>
                <select value={product.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)}>
                  <option value="Choose Quantity">Choose Quantity</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </td>
              <td>
                <button onClick={() => setProducts(products.filter((_, i) => i !== index))} disabled={index === 0}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addProduct} disabled={products.length >= 8}>Add</button>
      <button onClick={showOrder}>Show Order</button>

      {order.length > 0 && (
        <div>
          <h2>Order Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={readOrder}>What is my Order?</button>
        </div>
      )}
    </div>
  );
}

export default App;
