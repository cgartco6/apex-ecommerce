import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // Implement order placement
  };

  if (items.length === 0) {
    return <div>Your cart is empty. <Link to="/shop">Continue shopping</Link></div>;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <img src={item.image} alt={item.name} width="50" />
            <div>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => removeHandler(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <h2>Total: ${totalPrice.toFixed(2)}</h2>
      <button className="btn-primary" onClick={checkoutHandler}>Proceed to Checkout</button>
      <button className="btn-secondary" onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
};

export default Cart;
