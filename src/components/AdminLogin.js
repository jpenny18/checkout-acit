import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginBox = styled.div`
  background: #222;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #ffc62d;
  margin-bottom: 2rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }
`;

const LoginButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  width: 100%;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #e6b229;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-bottom: 1rem;
  text-align: center;
`;

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'jpenny' && password === 'jpenny1@') {
      localStorage.setItem('adminLoggedIn', 'true');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Admin Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleLogin}>
          Login
        </LoginButton>
      </LoginBox>
    </LoginContainer>
  );
}

export default AdminLogin; 