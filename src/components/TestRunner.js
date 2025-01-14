import React, { useState } from 'react';
import styled from 'styled-components';
import { testPaymentFlows, testSinglePaymentFlow } from '../utils/testPaymentFlows';

const TestContainer = styled.div`
  padding: 2rem;
  background: #1a1a1a;
  color: white;
  border-radius: 8px;
`;

const TestButton = styled.button`
  background: #ffc62d;
  color: black;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  margin: 0.5rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #e6b229;
  }
`;

const TestSection = styled.div`
  margin: 1rem 0;
`;

const TestTitle = styled.h3`
  color: #ffc62d;
  margin-bottom: 1rem;
`;

const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      await testPaymentFlows();
    } catch (error) {
      console.error('Test suite failed:', error);
    }
    setIsRunning(false);
  };

  const runSingleTest = async (balance, paymentMethod, fastPass) => {
    setIsRunning(true);
    try {
      await testSinglePaymentFlow(balance, paymentMethod, fastPass);
    } catch (error) {
      console.error('Single test failed:', error);
    }
    setIsRunning(false);
  };

  return (
    <TestContainer>
      <TestTitle>Payment Flow Test Suite</TestTitle>
      
      <TestSection>
        <h4>Run All Tests</h4>
        <TestButton 
          onClick={runAllTests} 
          disabled={isRunning}
        >
          {isRunning ? 'Running Tests...' : 'Run All Test Cases'}
        </TestButton>
      </TestSection>

      <TestSection>
        <h4>Test Card Payments</h4>
        <div>
          <TestButton 
            onClick={() => runSingleTest(50000, 'card', false)}
            disabled={isRunning}
          >
            Test $50K Standard
          </TestButton>
          <TestButton 
            onClick={() => runSingleTest(50000, 'card', true)}
            disabled={isRunning}
          >
            Test $50K Fast Pass
          </TestButton>
        </div>
      </TestSection>

      <TestSection>
        <h4>Test Crypto Payments</h4>
        <div>
          <TestButton 
            onClick={() => runSingleTest(50000, 'crypto', false)}
            disabled={isRunning}
          >
            Test $50K Crypto
          </TestButton>
          <TestButton 
            onClick={() => runSingleTest(50000, 'crypto', true)}
            disabled={isRunning}
          >
            Test $50K Crypto + Fast Pass
          </TestButton>
        </div>
      </TestSection>

      <p style={{ marginTop: '1rem', color: '#999' }}>
        Open the browser console to see test results
      </p>
    </TestContainer>
  );
};

export default TestRunner; 