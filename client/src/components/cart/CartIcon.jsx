import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { totalQuantity } = useSelector((state) => state.cart);

  return (
    <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
      🛒
      {totalQuantity > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'red',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
        }}>
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
