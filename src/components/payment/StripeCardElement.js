import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PaymentProcessing from './PaymentProcessing';
import { Shield, Lock, CheckCircle2, CreditCard } from 'lucide-react';

const CardContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardFieldsContainer = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardField = styled.div`
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(26, 26, 26, 0.5);
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #ffc62d;
    box-shadow: 0 0 0 2px rgba(255, 198, 45, 0.2);
  }
`;

const CardFieldLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
`;

const TrustBadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: 0.8rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: #ffc62d;
  }
`;

const SecurePaymentBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 198, 45, 0.1);
  border: 1px solid rgba(255, 198, 45, 0.2);
  border-radius: 8px;
  padding: 0.6rem;
  margin-bottom: 1.25rem;
  color: #ffc62d;
  font-size: 0.85rem;
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const PayButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #e6b229;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 198, 45, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid #333;
  border-top: 2px solid #ffc62d;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#666',
      },
    },
    invalid: {
      color: '#ff4444',
      iconColor: '#ff4444',
    },
  },
};

const StripeCardElement = ({ 
  onSubscriptionComplete, 
  customerInfo, 
  selectedBalance, 
  priceId,
  amount,
  loading,
  setLoading
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    
    setProcessingPayment(true);
    setError(null);

    try {
      setLoading(true);
      
      // Create the subscription first
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerInfo,
          selectedBalance,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('No client secret returned from the server');
      }

      // Confirm the payment with the card element
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: `${customerInfo.firstName} ${customerInfo.lastName}`,
              email: customerInfo.email,
            },
          },
        }
      );

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Payment successful
      onSubscriptionComplete(data.subscriptionId);
      // Navigate to success page
      navigate('/dashboard/success');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setProcessingPayment(false);
      setLoading(false);
    }
  };

  return (
    <>
      {processingPayment && <PaymentProcessing />}
      <CardContainer>
        <form onSubmit={handleSubmit}>
          <SecurePaymentBanner>
            <Lock size={16} />
            Secure Payment Processing with Stripe
          </SecurePaymentBanner>
          
          <CardFieldsContainer>
            <div>
              <CardFieldLabel>Card Number</CardFieldLabel>
              <CardField>
                <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
              </CardField>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <CardFieldLabel>Expiry Date</CardFieldLabel>
                <CardField>
                  <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                </CardField>
              </div>
              
              <div>
                <CardFieldLabel>CVC</CardFieldLabel>
                <CardField>
                  <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                </CardField>
              </div>
            </div>
          </CardFieldsContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <TrustBadgesContainer>
            <TrustBadge>
              <Shield />
              256-bit SSL
            </TrustBadge>
            <TrustBadge>
              <CreditCard />
              PCI Compliant
            </TrustBadge>
            <TrustBadge>
              <CheckCircle2 />
              Secure
            </TrustBadge>
          </TrustBadgesContainer>
          
          <PayButton 
            type="submit" 
            disabled={!stripe || processingPayment}
          >
            {processingPayment ? (
              <LoadingSpinner />
            ) : (
              `Pay ${amount ? `$${amount}/month` : ''}`
            )}
          </PayButton>
        </form>
      </CardContainer>
    </>
  );
};

export default StripeCardElement;