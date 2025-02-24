import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullScreen ? '100vh' : 'auto'};
  flex-direction: column;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid #333;
  border-top: 3px solid #ffc62d;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #999;
  font-size: 1rem;
`;

const LoadingSpinner = ({ size, text, fullScreen }) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerWrapper>
  );
};

export default LoadingSpinner; 