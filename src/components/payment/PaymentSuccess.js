import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  padding: 2rem;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.img`
  height: 60px;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  animation: scaleIn 0.5s ease-out;

  svg {
    width: 40px;
    height: 40px;
    color: #4caf50;
  }

  @keyframes scaleIn {
    from { 
      transform: scale(0);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Message = styled.p`
  color: #999;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  animation: slideUp 0.5s ease-out 0.2s forwards;
  opacity: 0;
`;

const DashboardButton = styled.button`
  background: #ffc62d;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  animation: slideUp 0.5s ease-out 0.4s forwards;
  opacity: 0;

  &:hover {
    background: #e6b229;
    transform: translateY(-2px);
  }
`;

const FooterText = styled.div`
  text-align: center;
  color: #666;
  margin-top: 2rem;
  font-size: 0.75rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  p {
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // Track Purchase event when page loads
  React.useEffect(() => {
    if (window.fbq) {
      // Get order details from URL params or local storage if available
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId') || 'unknown';
      const value = urlParams.get('value') || 0;
      const accountSize = urlParams.get('accountSize') || 0;

      window.fbq('track', 'Purchase', {
        content_name: `ACI Challenge - $${accountSize}`,
        content_category: 'Trading Challenge',
        value: parseFloat(value) || 0,
        currency: 'USD',
        order_id: orderId,
        contents: [{
          id: accountSize,
          quantity: 1
        }]
      });
    }
  }, []);

  return (
    <PageContainer>
      <SuccessContainer>
        <Logo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading"
        />
        <SuccessIcon>
          <Trophy />
        </SuccessIcon>
        <Title>Payment Successful!</Title>
        <Message>
          Thank you for joining ACI Trading Challenge. Your order has been confirmed 
          and we will process your account. You will receive an email with your account details shortly. We're excited to have you on board!
        </Message>
        <DashboardButton onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </DashboardButton>
      </SuccessContainer>

      <FooterText>
        <p>All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation, business recommendation, investment opportunity analysis or similar general recommendation regarding the trading of investment instruments. ACI only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. ACI companies do not act as a broker and do not accept any deposits. The offered technical solution for the ACI platforms and data feed is powered by liquidity providers.</p>
        <p>© 2025 - Copyright - ACI Trading LTD. All rights reserved.<br />
        <Link to="/privacy">Privacy policy</Link> • <Link to="/risk">Risk disclosure</Link> • <Link to="/terms">Terms of service</Link> • <Link to="/refund">Refund & dispute policy</Link></p>
      </FooterText>
    </PageContainer>
  );
};

export default PaymentSuccess; 