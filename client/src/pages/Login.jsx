import React from 'react';
import SocialLogin from '../components/auth/SocialLogin';

const Login = () => {
  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h1>Sign In</h1>
      <SocialLogin />
      <p style={{ marginTop: '1rem' }}>
        New here? <a href="/register">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
