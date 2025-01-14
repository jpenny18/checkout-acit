import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CheckoutForm from './components/CheckoutForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

const Container = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionHeader = styled.h2`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const BalanceSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const BalanceButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid ${props => props.selected ? '#ffc62d' : '#333'};
  background: ${props => props.selected ? '#ffc62d' : 'transparent'};
  color: ${props => props.selected ? '#000' : '#fff'};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Table = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;
  min-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #333;
  background-color: #222;
  min-width: 600px;
  
  &:hover {
    background-color: #2a2a2a;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HighlightedCell = styled.div`
  color: #ffc62d;
  font-weight: bold;
`;

const PromotionBanner = styled.div`
  background-color: rgba(255, 198, 45, 0.1);
  color: #ffc62d;
  padding: 1rem;
  margin: 2rem 0;
  border-radius: 4px;
  text-align: center;
`;

const StartButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  
  &:hover {
    background-color: #e6b229;
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

function App() {
  const [selectedBalance, setSelectedBalance] = useState(50000);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if we're on the admin route
  const isAdminRoute = window.location.pathname === '/admin';

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
  }, []);

  // Add initialization effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  const calculateValues = (balance) => {
    return {
      maxDailyLoss: balance * 0.06,
      maxLoss: balance * 0.12,
      profitTargetStep1: balance * 0.10,
      profitTargetStep2: balance * 0.05,
      refundableFee: balance === 50000 ? 400 : balance === 100000 ? 600 : 999
    };
  };

  const values = calculateValues(selectedBalance);

  const handleBack = () => {
    setShowCheckout(false);
  };

  if (isAdminRoute) {
    return isAdminLoggedIn ? (
      <AdminDashboard onLogout={handleLogout} />
    ) : (
      <AdminLogin onLogin={handleLogin} />
    );
  }

  if (isInitializing) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
        <div style={{ marginTop: '2rem', color: '#999' }}>Loading challenge conditions...</div>
      </Container>
    );
  }

  return (
    <Container>
      {!showCheckout ? (
        <>
          <Header>Challenge Conditions</Header>
          
          <SectionHeader>BALANCE</SectionHeader>
          <BalanceSection>
            {[50000, 100000, 200000].map(balance => (
              <BalanceButton
                key={balance}
                selected={selectedBalance === balance}
                onClick={() => setSelectedBalance(balance)}
              >
                ${balance.toLocaleString()}
              </BalanceButton>
            ))}
          </BalanceSection>

          <Table>
            <TableHeader>
              <div></div>
              <div>ACI CHALLENGE</div>
              <div>VERIFICATION</div>
              <div>ACI TRADER</div>
            </TableHeader>

            <TableRow>
              <div>Trading Period</div>
              <div>Unlimited</div>
              <div>Unlimited</div>
              <div>Unlimited</div>
            </TableRow>

            <TableRow>
              <div>Minimum Profitable Days</div>
              <div>4 Days</div>
              <div>4 Days</div>
              <div>X</div>
            </TableRow>

            <TableRow>
              <div>Maximum Daily Loss</div>
              <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
              <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
              <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
            </TableRow>

            <TableRow>
              <div>Maximum Loss</div>
              <div>${values.maxLoss.toLocaleString()} (12%)</div>
              <div>${values.maxLoss.toLocaleString()} (12%)</div>
              <div>${values.maxLoss.toLocaleString()} (12%)</div>
            </TableRow>

            <TableRow>
              <div>Profit Target</div>
              <div>${values.profitTargetStep1.toLocaleString()} (10%)</div>
              <div>${values.profitTargetStep2.toLocaleString()} (5%)</div>
              <div>X</div>
            </TableRow>

            <TableRow>
              <div>Speed Pass</div>
              <div>X</div>
              <HighlightedCell>YES</HighlightedCell>
              <div>X</div>
            </TableRow>

            <TableRow>
              <div>Refundable Fee</div>
              <HighlightedCell>${values.refundableFee}</HighlightedCell>
              <div>Free</div>
              <div>Refund</div>
            </TableRow>
          </Table>

          <PromotionBanner>
            SAVE 25% ON ALL CHALLENGES IF BOUGHT IN CRYPTO
          </PromotionBanner>

          <StartButton onClick={() => setShowCheckout(true)}>
            START ACI CHALLENGE
          </StartButton>
        </>
      ) : (
        <CheckoutForm 
          selectedBalance={selectedBalance} 
          onBack={handleBack}
        />
      )}
    </Container>
  );
}

export default App; 