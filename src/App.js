import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import styled from 'styled-components';
import CheckoutForm from './components/CheckoutForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import TestRunner from './components/TestRunner';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import RiskDisclosure from './components/pages/RiskDisclosure';
import TermsOfService from './components/pages/TermsOfService';
import RefundPolicy from './components/pages/RefundPolicy';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

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
    flex-direction: row;
    gap: 0.3rem;
    justify-content: space-between;
    margin-bottom: 1.5rem;
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
    min-width: unset;
    width: 32%;
    padding: 0.5rem;
    font-size: 0.75rem;
    white-space: nowrap;
    border-width: 1px;
  }
`;

const Table = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  overflow-x: auto;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    line-height: 1.2;
    min-height: 420px; /* Fixed height to prevent jumping */
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;
  min-width: 600px;

  @media (max-width: 768px) {
    min-width: unset;
    padding: 0.5rem;
    font-size: 0.6rem;
    text-align: center;
    gap: 0.25rem;
    
    > div {
      padding: 0 2px;
      white-space: nowrap;
    }
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
    min-width: unset;
    padding: 0.5rem;
    font-size: 0.65rem;
    gap: 0.25rem;
    min-height: 35px; /* Fixed height for rows */
    align-items: center;

    > div {
      white-space: nowrap;
      text-align: center;
      padding: 0 2px;
    }
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

  @media (max-width: 768px) {
    font-size: 0.5rem;
    padding: 0.5rem;
    margin: 1rem auto;
    width: fit-content;
    min-width: 200px;
    white-space: nowrap;
  }
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

  @media (max-width: 768px) {
    max-width: 200px;
    padding: 0.8rem;
    font-size: 0.7rem;
    white-space: nowrap;
  }
`;

const ChallengeContainer = styled(Container)`
  min-height: 100vh;
`;

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying admin access..." />;
  }

  return isAdmin ? children : <Navigate to="/admin" />;
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #1a1a1a;
  gap: 2rem;
`;

const LoadingLogo = styled.img`
  height: 60px;

  @media (max-width: 768px) {
    height: 48px;
  }
`;

const LoadingText = styled.div`
  color: #999;
  font-size: 1rem;
`;

function App() {
  const [selectedBalance, setSelectedBalance] = useState(50000);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAdminLogin = async () => {
      const adminUid = localStorage.getItem('adminUid');
      if (!adminUid) {
        setIsAdminLoggedIn(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', adminUid));
        setIsAdminLoggedIn(userDoc.exists() && userDoc.data().role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminLoggedIn(false);
      }
    };

    checkAdminLogin();
  }, []);

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

  const ChallengeContent = () => (
    <ChallengeContainer>
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
              <div>Leverage</div>
              <div>1:200</div>
              <div>1:200</div>
              <div>1:200</div>
            </TableRow>

            <TableRow>
              <div>Fast Pass</div>
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
    </ChallengeContainer>
  );

  if (isInitializing) {
    return (
      <LoadingContainer>
        <LoadingLogo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading Challenge" 
        />
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/risk" element={<RiskDisclosure />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <AdminRoute>
                <AdminDashboard onLogout={handleLogout} />
              </AdminRoute>
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />
        <Route path="/test" element={<TestRunner />} />
      </Routes>
    </Router>
  );
}

export default App; 