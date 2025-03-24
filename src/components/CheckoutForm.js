import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CryptoPayment from './CryptoPayment';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getCachedCryptoDiscountMultiplier, getCachedCryptoDiscountPercentage } from '../config/promotions';

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

const PaymentMethodSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PaymentButton = styled.button`
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

const PlatformButton = styled(PaymentButton)``;

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

const TotalAmount = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: right;
  margin: 2rem 0;

  span {
    color: #ffc62d;
  }
`;

const CheckoutButton = styled.button`
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

const AddOnSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
`;

const AddOnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffc62d;
  color: black;
  font-size: 14px;
  cursor: help;
  margin-left: 0.5rem;
`;

const AddOnOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;

  input[type="checkbox"] {
    margin-top: 0.3rem;
  }
`;

const AddOnDescription = styled.div`
  color: #999;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

// Stripe payment links for different account sizes
const STRIPE_LINKS = {
  50000: {
    standard: process.env.REACT_APP_STRIPE_LINK_50K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_50K_FAST
  },
  100000: {
    standard: process.env.REACT_APP_STRIPE_LINK_100K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_100K_FAST
  },
  200000: {
    standard: process.env.REACT_APP_STRIPE_LINK_200K,
    fastPass: process.env.REACT_APP_STRIPE_LINK_200K_FAST
  }
};

function CheckoutForm({ selectedBalance, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('mt4');
  const [fastPassSelected, setFastPassSelected] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Add initialization effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const basePrice = selectedBalance === 50000 ? 400 : 
                   selectedBalance === 100000 ? 600 : 999;

  const finalAmount = (paymentMethod === 'crypto' 
    ? basePrice * (fastPassSelected ? 2 : 1) * getCachedCryptoDiscountMultiplier()
    : basePrice * (fastPassSelected ? 2 : 1));

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
        basePrice,
        finalAmount,
        platform: selectedPlatform,
        paymentMethod,
        cryptoDiscount: paymentMethod === 'crypto',
        fastPass: fastPassSelected,
        cryptoType: null // Set to null for both crypto and card payments initially
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
    console.log('Starting payment process...');
    console.log('Payment method:', paymentMethod);
    console.log('Selected balance:', selectedBalance);
    console.log('Fast pass:', fastPassSelected);

    const orderId = await saveOrderData();
    if (!orderId) {
      alert('There was an error processing your order. Please try again.');
      return;
    }

    setCurrentOrderId(orderId);
    console.log('Order ID:', orderId);

    if (paymentMethod === 'crypto') {
      setShowCryptoPayment(true);
    } else {
      const stripeLink = STRIPE_LINKS[selectedBalance][fastPassSelected ? 'fastPass' : 'standard'];
      console.log('Stripe link:', stripeLink);
      
      if (!stripeLink) {
        console.error('Payment link not found:', {
          selectedBalance,
          fastPassSelected,
          availableLinks: STRIPE_LINKS
        });
        alert('Payment link not found. Please try again or contact support.');
        return;
      }

      const finalUrl = `${stripeLink}?prefilled_email=${encodeURIComponent(formData.email)}&client_reference_id=${orderId}`;
      console.log('Final URL:', finalUrl);
      
      const isInIframe = window !== window.parent;
      console.log('Is in iframe:', isInIframe);
      
      if (isInIframe) {
        try {
          console.log('Attempting parent window redirect...');
          window.parent.location.href = finalUrl;
        } catch (e) {
          console.log('Parent redirect failed, opening new tab...', e);
          window.open(finalUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        console.log('Performing direct redirect...');
        window.location.href = finalUrl;
      }
    }
  };

  if (isInitializing) {
    return (
      <FormContainer style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
        <div style={{ marginTop: '2rem', color: '#999' }}>Loading checkout form...</div>
      </FormContainer>
    );
  }

  if (showCryptoPayment) {
    return <CryptoPayment 
      amount={finalAmount} 
      onBack={() => setShowCryptoPayment(false)}
      orderId={currentOrderId}
    />;
  }

  return (
    <FormContainer>
      <BackButton onClick={onBack}>← Back to Challenge Conditions</BackButton>
      
      <AccountCard>
        <AccountSize>${selectedBalance.toLocaleString()}</AccountSize>
        <AccountPrice>Base Price: ${basePrice.toLocaleString()}</AccountPrice>
      </AccountCard>

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

      <FormSection>
        <FormTitle>Payment Method</FormTitle>
        <PaymentMethodSection>
          <PaymentButton
            selected={paymentMethod === 'card'}
            onClick={() => setPaymentMethod('card')}
          >
            💳 Credit/Debit Card
          </PaymentButton>
          <PaymentButton
            selected={paymentMethod === 'crypto'}
            onClick={() => setPaymentMethod('crypto')}
          >
            ₿ Crypto (-{getCachedCryptoDiscountPercentage()}%)
          </PaymentButton>
        </PaymentMethodSection>
      </FormSection>

      <AddOnSection>
        <AddOnHeader>
          <FormTitle style={{ margin: 0 }}>Add-ons</FormTitle>
        </AddOnHeader>
        <AddOnOption>
          <input
            type="checkbox"
            id="fastPass"
            checked={fastPassSelected}
            onChange={(e) => setFastPassSelected(e.target.checked)}
          />
          <div>
            <label htmlFor="fastPass" style={{ color: '#fff', fontWeight: 'bold' }}>
              Fast Pass
              <InfoIcon title="Skip verification stage and move directly to funded stage after passing the first step">
                i
              </InfoIcon>
            </label>
            <AddOnDescription>
              Allows you to skip the verification stage and move on to the funded stage right after passing the first step. 
              It costs as much as your challenge account costs. Your crypto discount will still be applied.
            </AddOnDescription>
          </div>
        </AddOnOption>
      </AddOnSection>

      <TermsCheckbox>
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="terms">
          I have read and agree to the <a href="https://www.ascendantcapital.ca/disclaimer" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="https://www.ascendantcapital.ca/refundpolicy" target="_blank" rel="noopener noreferrer">Refund/Dispute Policy</a>
        </label>
      </TermsCheckbox>

      <TotalAmount>
        Total Amount: <span>${finalAmount.toLocaleString()}</span>
        {paymentMethod === 'crypto' && 
          <div style={{ fontSize: '0.9rem', color: '#999' }}>{getCachedCryptoDiscountPercentage()}% crypto discount applied</div>
        }
        {fastPassSelected &&
          <div style={{ fontSize: '0.9rem', color: '#999' }}>Fast Pass included</div>
        }
      </TotalAmount>

      <CheckoutButton 
        disabled={!isFormValid()} 
        onClick={handleContinueToPayment}
      >
        Continue to payment
      </CheckoutButton>
    </FormContainer>
  );
}

export default CheckoutForm; 