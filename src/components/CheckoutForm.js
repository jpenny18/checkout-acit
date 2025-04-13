import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getCachedCryptoDiscountPercentage } from '../config/promotions';
import PaymentAccordion from './payment/PaymentAccordion';
import { initApiHandler } from '../api/api-handler';

const FormContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #999;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  &::placeholder {
    color: #666;
  }

  &:invalid {
    border-color: #ff4444;
  }
`;

const AccountCard = styled.div`
  border: 2px solid #ffc62d;
  border-radius: 4px;
  padding: 1.5rem;
  text-align: center;
  background: rgba(255, 198, 45, 0.1);
  margin-bottom: 2rem;
`;

const AccountSize = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ffc62d;
  margin-bottom: 0.5rem;
`;

const AccountPrice = styled.div`
  font-size: 1.2rem;
  color: white;
`;

const PlatformSection = styled.div`
  margin: 2rem 0;
`;

const PlatformButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PlatformButton = styled.button`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#ffc62d' : '#333'};
  background: ${props => props.selected ? 'rgba(255, 198, 45, 0.1)' : 'transparent'};
  color: ${props => props.selected ? '#ffc62d' : '#fff'};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    border-color: #ffc62d;
  }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin: 2rem 0;
  line-height: 1.4;

  input {
    margin-top: 0.3rem;
  }

  label {
    color: #999;
    font-size: 0.9rem;
  }

  a {
    color: #ffc62d;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubscriptionNote = styled.div`
  background-color: rgba(255, 198, 45, 0.1);
  color: #999;
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  border: 1px solid rgba(255, 198, 45, 0.2);

  span {
    color: #ffc62d;
  font-weight: bold;
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

const BackButton = styled.button`
  background: transparent;
  color: #ffc62d;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContinueButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  
  &:hover {
    background-color: #e6b229;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

function CheckoutForm({ selectedBalance, onBack, values }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [selectedPlatform, setSelectedPlatform] = useState('mt5');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Initialize our simulated API handler
  useEffect(() => {
    initApiHandler();
  }, []);

  // Add initialization effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Get monthly price based on account size
  const getMonthlyPrice = () => {
    return selectedBalance === 50000 ? 99 :
           selectedBalance === 100000 ? 149 : 249;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phone && 
           termsAccepted;
  };

  const generateOrderId = () => {
    return 'ACI-' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  const saveOrderData = async () => {
    const orderId = generateOrderId();
    const orderData = {
      orderId,
      timestamp: new Date(),
      customerInfo: {
        ...formData
      },
      orderDetails: {
        accountSize: selectedBalance,
        basePrice: getMonthlyPrice(),
        finalAmount: getMonthlyPrice(),
        platform: selectedPlatform,
        paymentMethod: null, // Will be set during payment
        isSubscription: true,
        subscriptionInterval: 'month'
      },
      status: 'pending',
      paymentDetails: null
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving order:', error);
      return null;
    }
  };

  const handleContinueToPayment = async () => {
    const orderId = await saveOrderData();
    if (!orderId) {
      alert('There was an error processing your order. Please try again.');
      return;
    }

    setCurrentOrderId(orderId);
    setShowPaymentMethods(true);
  };

  const handleSubscriptionComplete = (subscriptionId) => {
    // Handle successful subscription
    console.log(`Subscription completed with ID: ${subscriptionId}`);
    
    // Redirect to success page or show success message
    // For now, just go back to challenge page
    onBack();
  };

  if (isInitializing) {
    return (
      <FormContainer style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
        <div style={{ marginTop: '2rem', color: '#999' }}>Loading checkout form...</div>
      </FormContainer>
    );
  }

  if (showPaymentMethods && currentOrderId) {
    return (
      <FormContainer>
        <BackButton onClick={() => setShowPaymentMethods(false)}>← Back to Information</BackButton>
        
        <AccountCard>
          <AccountSize>${selectedBalance.toLocaleString()}</AccountSize>
          <AccountPrice>Monthly Price: ${getMonthlyPrice()}/month</AccountPrice>
        </AccountCard>
        
        <FormTitle>Choose Payment Method</FormTitle>
        
        <PaymentAccordion 
          customerInfo={formData}
          selectedBalance={selectedBalance}
          onSubscriptionComplete={handleSubscriptionComplete}
          cryptoDiscountPercentage={getCachedCryptoDiscountPercentage()}
      orderId={currentOrderId}
        />
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <BackButton onClick={onBack}>← Back to Challenge Conditions</BackButton>
      
      <AccountCard>
        <AccountSize>${selectedBalance.toLocaleString()}</AccountSize>
        <AccountPrice>Monthly Price: ${getMonthlyPrice()}/month</AccountPrice>
      </AccountCard>

      <SubscriptionNote>
        <span>Subscription:</span> You are signing up for a monthly subscription. You can cancel anytime.
        Your card will be charged ${getMonthlyPrice()} per month until you cancel. Cancelling your subscription will immediately forfeit your account.
      </SubscriptionNote>

      <FormSection>
        <FormTitle>Contact Information</FormTitle>
        <InputGrid>
          <InputGroup>
            <Label>First Name *</Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Last Name *</Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              required
            />
          </InputGroup>
        </InputGrid>
        <InputGrid>
          <InputGroup>
            <Label>Email Address *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              required
            />
          </InputGroup>
        </InputGrid>
      </FormSection>

      <FormSection>
        <FormTitle>Trading Platform</FormTitle>
        <PlatformButtons>
          <PlatformButton
            selected={selectedPlatform === 'mt4'}
            onClick={() => setSelectedPlatform('mt4')}
          >
            MetaTrader 4
          </PlatformButton>
          <PlatformButton
            selected={selectedPlatform === 'mt5'}
            onClick={() => setSelectedPlatform('mt5')}
          >
            MetaTrader 5
          </PlatformButton>
        </PlatformButtons>
      </FormSection>

      <TermsCheckbox>
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="terms">
          I have read and agree to the <a href="https://www.ascendantcapital.ca/disclaimer" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="https://www.ascendantcapital.ca/refundpolicy" target="_blank" rel="noopener noreferrer">Refund/Dispute Policy</a>. I understand that I am signing up for a monthly subscription that will be automatically renewed until I cancel.
        </label>
      </TermsCheckbox>

      <ContinueButton 
        disabled={!isFormValid()} 
        onClick={handleContinueToPayment}
      >
        Continue to payment
      </ContinueButton>
    </FormContainer>
  );
}

export default CheckoutForm; 