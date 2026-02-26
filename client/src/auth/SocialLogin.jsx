import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const SocialLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/apple`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success('Logged in');
      navigate('/');
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="social-login">
      <button onClick={handleGoogleLogin} className="btn-google">
        <img src="/google-icon.svg" alt="Google" /> Sign in with Google
      </button>
      <button onClick={handleAppleLogin} className="btn-apple">
        <img src="/apple-icon.svg" alt="Apple" /> Sign in with Apple
      </button>
      <hr />
      <form onSubmit={handleEmailLogin}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" className="btn-primary">Sign in with Email</button>
      </form>
    </div>
  );
};

export default SocialLogin;
