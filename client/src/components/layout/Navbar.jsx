import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import CartIcon from '../cart/CartIcon';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--primary)', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>APEX Digital</Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/shop" style={{ color: 'white' }}>Shop</Link>
        <CartIcon />
        {userInfo ? (
          <>
            {userInfo.isAdmin && <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>}
            <button onClick={logoutHandler} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
