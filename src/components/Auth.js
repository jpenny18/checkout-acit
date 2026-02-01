import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Button from './Button';

const Particles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 198, 45, 0.15);
  border-radius: 50%;
  animation: particleFloat 8s linear infinite;
  opacity: 0;

  ${[...Array(15)].map((_, i) => `
    &:nth-child(${i + 1}) {
      top: ${Math.random() * 100}%;
      right: -4px;
      animation-delay: ${Math.random() * 5}s;
      animation-duration: ${8 + Math.random() * 10}s;
    }
  `)}

  @keyframes particleFloat {
    0% {
      transform: translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateX(-100vw);
      opacity: 0;
    }
  }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const AuthCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
`;

const Logo = styled.img`
  height: 40px;
  margin: 0 auto 2rem;
  display: block;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #999;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.active ? '#ffc62d' : '#999'};
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.active ? '#ffc62d' : 'transparent'};
    transition: all 0.2s;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  &::placeholder {
    color: #666;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (isSignIn) {
        console.log('Auth: Signing in user with email:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Auth: User signed in with UID:', userCredential.user.uid);
        
        // Update lastActive timestamp on sign in
        try {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          console.log('Auth: Updating lastActive timestamp for user');
          await setDoc(userDocRef, {
            lastActive: new Date(),
            email: email // Ensure email is set
          }, { merge: true });
          console.log('Auth: User document updated successfully');
        } catch (firestoreError) {
          console.error('Auth: Error updating user document, creating new one:', firestoreError);
          // If user document doesn't exist in Firestore yet, create it
          const newUserData = {
            email: email,
            firstName: '',
            lastName: '',
            phone: '',
            createdAt: new Date(),
            lastActive: new Date(),
            role: 'user'
          };
          console.log('Auth: Creating new user document:', newUserData);
          await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
          console.log('Auth: New user document created successfully');
        }
      } else {
        const name = e.target.name.value;
        const phone = e.target.phone.value;
        console.log('Auth: Creating new user with email:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Auth: User created in Firebase Auth with UID:', userCredential.user.uid);
        
        // Store user data in Firestore
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          createdAt: new Date(),
          lastActive: new Date(),
          role: 'user'
        };
        
        console.log('Auth: Saving user data to Firestore:', userData);
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        console.log('Auth: User data saved successfully to Firestore');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth: Error during authentication:', err);
      console.error('Auth: Error code:', err.code);
      console.error('Auth: Error message:', err.message);
      
      // Display generic error messages instead of Firebase errors
      if (isSignIn) {
        setError('Email or password incorrect');
      } else {
        setError('Unable to create account. Please try again.');
      }
    }
  };

  return (
    <AuthContainer>
      <Particles>
        {[...Array(15)].map((_, i) => (
          <Particle key={i} />
        ))}
      </Particles>
      <AuthCard>
        <Logo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading Challenge" 
        />
        <Title>{isSignIn ? 'Welcome back' : 'Create your account'}</Title>
        <Subtitle>
          {isSignIn 
            ? 'Sign in to access your trading dashboard' 
            : 'Get started with ACI Trading Challenge'}
        </Subtitle>

        <Tabs>
          <Tab 
            active={isSignIn} 
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Tab>
          <Tab 
            active={!isSignIn} 
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Tab>
        </Tabs>

        <Form onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <Input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                required 
              />
              <Input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                required 
              />
            </>
          )}
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
          />
          <Input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" fullWidth>
            {isSignIn ? 'Sign In' : 'Create Account'}
          </Button>
        </Form>
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth; 