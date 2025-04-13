import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Logo = styled.img`
  height: 60px;
  margin-bottom: 2rem;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #ffc62d;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 4px solid transparent;
    border-top-color: rgba(255, 198, 45, 0.3);
    border-radius: 50%;
    animation: ${spin} 2s linear infinite reverse;
  }
`;

const Text = styled.div`
  color: white;
  font-size: 1.2rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const PaymentProcessing = () => {
  return (
    <Container>
      <Logo 
        src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
        alt="ACI Trading"
      />
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      <Text>Payment Processing</Text>
    </Container>
  );
};

export default PaymentProcessing; 