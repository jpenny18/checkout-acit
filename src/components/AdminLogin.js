import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user has admin role in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUid', userCredential.user.uid);
        onLogin();
      } else {
        await auth.signOut();
        setError('Unauthorized access. Admin privileges required.');
      }
    } catch (err) {
      setError('Invalid credentials or unauthorized access.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Admin Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </LoginButton>
      </LoginBox>
    </LoginContainer>
  );
}

export default AdminLogin; 