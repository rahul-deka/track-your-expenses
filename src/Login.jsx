import React, { useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await login(emailRef.current.value, passwordRef.current.value);
    navigate('/');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input ref={emailRef} placeholder="Email" required />
        <input ref={passwordRef} type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}