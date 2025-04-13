import React, { useState } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardElement from './StripeCardElement';
import CryptoPayment from '../CryptoPayment';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const AccordionContainer = styled.div`
  margin-bottom: 2rem;
`;

const AccordionSection = styled.div`
  border: 1px solid #333;
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: #2a2a2a;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  gap: 1rem;
  
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

const AccordionBody = styled.div`
  max-height: ${props => props.active ? '400px' : '0'};
  overflow-y: ${props => props.active ? 'auto' : 'hidden'};
  transition: max-height 0.3s ease-in-out;
  
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

const AccordionContent = styled.div`
  padding: ${props => props.active ? '1.5rem' : '0 1.5rem'};
  transition: padding 0.3s;
  min-height: ${props => props.isCrypto ? '400px' : 'auto'};
`;

const DiscountBadge = styled.span`
  background: rgba(255, 198, 45, 0.2);
  color: #ffc62d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: auto;
`;

const PaymentAccordion = ({ 
  customerInfo, 
  selectedBalance, 
  onSubscriptionComplete, 
  orderId,
  subscriptionPrices 
}) => {
  const [activeMethod, setActiveMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Get the appropriate price for the selected balance
  const getMonthlyPrice = () => {
    return selectedBalance === 50000 ? 99 :
           selectedBalance === 100000 ? 149 : 249;
  };

  // Get the appropriate Stripe price ID for the selected balance
  const getPriceId = () => {
    return selectedBalance === 50000 ? process.env.REACT_APP_STRIPE_PRICE_ID_50K :
           selectedBalance === 100000 ? process.env.REACT_APP_STRIPE_PRICE_ID_100K :
           process.env.REACT_APP_STRIPE_PRICE_ID_200K;
  };

  return (
    <AccordionContainer>
      <AccordionSection>
        <AccordionHeader 
          active={activeMethod === 'card'}
          onClick={() => setActiveMethod('card')}
        >
          <RadioButton active={activeMethod === 'card'} />
          <PaymentMethod active={activeMethod === 'card'}>
            💳 Credit/Debit Card
          </PaymentMethod>
        </AccordionHeader>
        <AccordionBody active={activeMethod === 'card'}>
          <AccordionContent active={activeMethod === 'card'}>
            <Elements stripe={stripePromise}>
              <StripeCardElement 
                customerInfo={customerInfo}
                selectedBalance={selectedBalance}
                priceId={getPriceId()}
                amount={getMonthlyPrice()}
                onSubscriptionComplete={onSubscriptionComplete}
                loading={loading}
                setLoading={setLoading}
              />
            </Elements>
          </AccordionContent>
        </AccordionBody>
      </AccordionSection>

      <AccordionSection>
        <AccordionHeader 
          active={activeMethod === 'crypto'}
          onClick={() => setActiveMethod('crypto')}
        >
          <RadioButton active={activeMethod === 'crypto'} />
          <PaymentMethod active={activeMethod === 'crypto'}>
            ₿ Crypto Payment
          </PaymentMethod>
        </AccordionHeader>
        <AccordionBody active={activeMethod === 'crypto'}>
          <AccordionContent active={activeMethod === 'crypto'} isCrypto={true}>
            {activeMethod === 'crypto' && (
              <CryptoPayment 
                amount={getMonthlyPrice()} 
                onBack={() => {}} 
                orderId={orderId}
              />
            )}
          </AccordionContent>
        </AccordionBody>
      </AccordionSection>
    </AccordionContainer>
  );
};

export default PaymentAccordion; 