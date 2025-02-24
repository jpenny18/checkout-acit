import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
`;

const GlobeWrapper = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
  animation: ${rotate} 20s linear infinite;
`;

const GlobeSphere = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 198, 45, 0.8), rgba(255, 198, 45, 0.4));
  box-shadow: 
    inset 0 0 50px rgba(255, 198, 45, 0.5),
    0 0 50px rgba(255, 198, 45, 0.2);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(45deg, transparent 40%, rgba(255, 198, 45, 0.8));
    filter: blur(5px);
  }
`;

const GridLines = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255, 198, 45, 0.3);
  
  &:nth-child(2) { transform: rotateX(60deg); }
  &:nth-child(3) { transform: rotateX(-60deg); }
  &:nth-child(4) { transform: rotateY(60deg); }
  &:nth-child(5) { transform: rotateY(-60deg); }
`;

const Globe = () => {
  return (
    <Container>
      <GlobeWrapper>
        <GlobeSphere />
        <GridLines />
        <GridLines />
        <GridLines />
        <GridLines />
        <GridLines />
      </GlobeWrapper>
    </Container>
  );
};

export default Globe; 