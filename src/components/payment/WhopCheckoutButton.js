import React from 'react';
import styled from 'styled-components';
import { ExternalLink, Shield, Lock, CheckCircle2 } from 'lucide-react';

const CheckoutContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.13);

  @media (max-width: 768px) {
    padding: 0.5rem 0.7rem;
  }
`;

const SecurePaymentBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 198, 45, 0.1);
  border: 1px solid rgba(255, 198, 45, 0.2);
  border-radius: 7px;
  padding: 0.37rem 0.7rem;
  margin-bottom: 0.8rem;
  color: #ffc62d;
  font-size: 0.77rem;
  font-weight: 500;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    font-size: 0.73rem;
    padding: 0.3rem 0.5rem;
  }
`;

const InfoText = styled.p`
  color: #999;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.83rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.78rem;
  }
`;

const DiscountNote = styled.div`
  background: rgba(50, 50, 50, 0.3);
  border: 1px solid #444;
  border-radius: 6px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  color: #999;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.4;

  strong {
    color: #ccc;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.6rem;
  }
`;

const CheckoutButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background-color: #ffc62d;
  color: black;
  padding: 0.79rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #e6b229;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(255, 198, 45, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 17px;
    height: 17px;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 0.72rem;
    font-size: 0.93rem;
  }
`;

const TrustBadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.7rem;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #999;
  font-size: 0.7rem;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc62d;
  }
`;

const WhopCheckoutButton = ({ selectedBalance, amount, discountCode }) => {
  // Get the appropriate Whop checkout link based on account size
  const getCheckoutLink = () => {
    switch(selectedBalance) {
      case 10000:
        return 'https://whop.com/checkout/plan_FTEahqmkkyXa2';
      case 25000:
        return 'https://whop.com/checkout/plan_yqfU5dvGSCg8p';
      case 50000:
        return 'https://whop.com/checkout/plan_uOtHjmWkhtD9d';
      case 100000:
        return 'https://whop.com/checkout/plan_HVx4n2ph08ZSK';
      case 200000:
        return 'https://whop.com/checkout/plan_Vrc9zHoqzLMMw';
      default:
        return 'https://whop.com/checkout/plan_uOtHjmWkhtD9d'; // Default to 50k
    }
  };

  return (
    <CheckoutContainer>
      <SecurePaymentBanner>
        <Lock size={14} />
        You will be redirected to complete your payment of ${amount}.
      </SecurePaymentBanner>

      {discountCode && (
        <DiscountNote>
          <strong>Apply code "{discountCode}"</strong> at checkout to receive your discount
        </DiscountNote>
      )}

      <CheckoutButton
        href={getCheckoutLink()}
        target="_blank"
        rel="noopener noreferrer"
      >
        Continue to Checkout
        <ExternalLink />
      </CheckoutButton>
    </CheckoutContainer>
  );
};

export default WhopCheckoutButton;
