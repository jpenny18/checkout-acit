import React, { useState } from 'react';
import styled from 'styled-components';
import WhopCheckoutButton from './WhopCheckoutButton';
import CryptoPayment from '../CryptoPayment';

const PaymentContainer = styled.div`
  margin-bottom: 2rem;
`;

const PaymentSection = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #2a2a2a;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${props => props.active && `
    background-color: rgba(255, 198, 45, 0.1);
    border-bottom: 1px solid #333;
  `}
`;

const RadioButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.active ? '#ffc62d' : '#999'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ffc62d;
    display: ${props => props.active ? 'block' : 'none'};
  }
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#ffc62d' : 'white'};
`;

const PaymentBody = styled.div`
  max-height: ${props => props.active ? '600px' : '0'};
  overflow-y: ${props => props.active ? 'auto' : 'hidden'};
  transition: max-height 0.3s ease-in-out;
  padding: ${props => props.active ? '1.5rem' : '0 1.5rem'};
  
  /* Webkit scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #444;
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
`;

const PaymentAccordion = ({ 
  customerInfo, 
  selectedBalance, 
  onSubscriptionComplete, 
  orderId,
  subscriptionPrices,
  discountedAmount,
  originalAmount,
  discountCode
}) => {
  const [activeMethod, setActiveMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Get the appropriate one-time price for the selected balance
  const getOneTimePrice = () => {
    return discountedAmount || (selectedBalance === 10000 ? 99 :
           selectedBalance === 25000 ? 249 :
           selectedBalance === 50000 ? 399 :
           selectedBalance === 100000 ? 599 : 1199);
  };

  return (
    <PaymentContainer>
      <PaymentSection>
        <PaymentHeader 
          active={activeMethod === 'card'}
          onClick={() => setActiveMethod('card')}
        >
          <RadioButton active={activeMethod === 'card'} />
          <PaymentMethod active={activeMethod === 'card'}>
            💳 Credit/Debit Card
          </PaymentMethod>
        </PaymentHeader>
        <PaymentBody active={activeMethod === 'card'}>
          <WhopCheckoutButton 
            selectedBalance={selectedBalance}
            amount={getOneTimePrice()}
            discountCode={discountCode}
          />
        </PaymentBody>
      </PaymentSection>

      <PaymentSection>
        <PaymentHeader 
          active={activeMethod === 'crypto'}
          onClick={() => setActiveMethod('crypto')}
        >
          <RadioButton active={activeMethod === 'crypto'} />
          <PaymentMethod active={activeMethod === 'crypto'}>
            ₿ Crypto Payment
          </PaymentMethod>
        </PaymentHeader>
        <PaymentBody active={activeMethod === 'crypto'}>
          <CryptoPayment 
            amount={getOneTimePrice()} 
            onBack={() => {}} 
            orderId={orderId}
          />
        </PaymentBody>
      </PaymentSection>
    </PaymentContainer>
  );
};

export default PaymentAccordion; 