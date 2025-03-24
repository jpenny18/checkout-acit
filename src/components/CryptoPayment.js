import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import cryptoPaymentService, { simulatePayment } from '../services/cryptoPayment';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getCachedCryptoDiscountPercentage } from '../config/promotions';

const Container = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  border-radius: 8px;
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

const Title = styled.h2`
  color: white;
  margin-bottom: 2rem;
  text-align: center;
`;

const Amount = styled.div`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ffc62d;
`;

const CryptoOptionsGrid = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const CryptoOption = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  
  &:hover {
    border-color: #ffc62d;
  }
`;

const CryptoTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QRCode = styled.div`
  background: white;
  width: 150px;
  height: 150px;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 4px;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const AddressBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2a2a2a;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  
  input {
    background: transparent;
    border: none;
    color: white;
    flex: 1;
    padding: 0.5rem;
    
    &:focus {
      outline: none;
    }
  }
`;

const CopyButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #444;
  }
`;

const PaymentSentButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 2rem;
  
  &:hover {
    background-color: #e6b229;
  }
`;

const DiscountBadge = styled.div`
  background: rgba(255, 198, 45, 0.2);
  color: #ffc62d;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const PriceInfo = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #999;
`;

const RefreshButton = styled.button`
  background: transparent;
  border: none;
  color: #ffc62d;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PaymentStatus = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background: ${props => props.status === 'completed' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 198, 45, 0.1)'};
  color: ${props => props.status === 'completed' ? '#4caf50' : '#ffc62d'};
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

const TestButton = styled.button`
  background: #333;
  color: #ffc62d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #444;
  }
`;

const cryptoAddresses = {
  BTC: {
    address: 'bc1q4zs3mwhv50vgfp05pawdp0s2w8qfd0h824464u',
    name: 'Bitcoin'
  },
  ETH: {
    address: '0x54634008a757D262f0fD05213595dEE77a82026B',
    name: 'Ethereum'
  },
  USDT: {
    address: 'TLVMLJhSmWTTtitpeF5Gvv2j4avXVZ3EMd',
    name: 'USDT (TRC20)'
  }
};

function CryptoPayment({ amount, onBack, orderId }) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Update initialization effect timing
  useEffect(() => {
    setIsInitializing(true);
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500); // Increased to 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const calculateCryptoAmount = useCallback((cryptoSymbol) => {
    try {
      return cryptoPaymentService.calculateCryptoAmount(amount, cryptoSymbol);
    } catch (err) {
      return null;
    }
  }, [amount]);

  useEffect(() => {
    const initializeService = async () => {
      try {
        await cryptoPaymentService.initialize();
        const prices = await cryptoPaymentService.fetchPrices();
        setPrices(prices);
        setIsLoading(false);
      } catch (error) {
        console.log('Service initialized with limited functionality');
        setIsLoading(false);
      }
    };

    initializeService();

    return () => {
      cryptoPaymentService.cleanup();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const newPrices = await cryptoPaymentService.fetchPrices();
        setPrices(newPrices);
        if (selectedCrypto && amount) {
          const amount = calculateCryptoAmount(selectedCrypto);
          setCryptoAmount(amount);
          const address = cryptoAddresses[selectedCrypto].address;
          await cryptoPaymentService.startPaymentListener(orderId, address, selectedCrypto, amount);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      if (orderId) {
        cryptoPaymentService.stopPaymentListener(orderId);
      }
    };
  }, [selectedCrypto, amount, orderId, calculateCryptoAmount]);

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const handleRefreshPrices = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Start payment listeners for each crypto address
    const startListeners = async () => {
      try {
        for (const [symbol, details] of Object.entries(cryptoAddresses)) {
          const cryptoAmount = calculateCryptoAmount(symbol);
          if (cryptoAmount) {
            try {
              await cryptoPaymentService.startPaymentListener(
                orderId,
                details.address,
                symbol,
                cryptoAmount
              );
            } catch (error) {
              console.warn(`Failed to start ${symbol} listener:`, error);
              // Continue with other listeners even if one fails
            }
          }
        }
      } catch (error) {
        console.error('Error starting payment listeners:', error);
        setError('Failed to start payment monitoring. Please refresh the page.');
      }
    };

    startListeners();

    // Listen for payment status changes
    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.status === 'completed') {
          setPaymentStatus('completed');
          setTimeout(() => {
            onBack();
          }, 3000);
        }
      }
    });

    return () => {
      // Cleanup listeners
      cryptoPaymentService.stopPaymentListener(orderId);
      unsubscribe();
    };
  }, [orderId, onBack, calculateCryptoAmount]);

  useEffect(() => {
    if (selectedCrypto && amount) {
      const cryptoAmount = calculateCryptoAmount(selectedCrypto);
      setCryptoAmount(cryptoAmount);
    }
  }, [selectedCrypto, amount, calculateCryptoAmount]);

  // Add test function
  const handleTestPayment = async () => {
    try {
      await simulatePayment(orderId, "BTC");
      console.log('Test payment initiated for order:', orderId);
    } catch (error) {
      console.error('Test payment error:', error);
      setError('Test payment failed. Please try again.');
    }
  };

  // Update the loading screen
  if (isInitializing) {
    return (
      <Container style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
        <PriceInfo style={{ marginTop: '2rem' }}>Initializing payment system...</PriceInfo>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={onBack}>← Back to Checkout</BackButton>
      
      <Title>Crypto Payment</Title>
      <DiscountBadge>{getCachedCryptoDiscountPercentage()}% Crypto Discount Applied</DiscountBadge>
      <Amount>${amount.toLocaleString()}</Amount>

      {error && (
        <PaymentStatus status="error">
          {error}
          <RefreshButton onClick={handleRefreshPrices}>
            Try Again
          </RefreshButton>
        </PaymentStatus>
      )}

      {loading ? (
        <>
          <LoadingSpinner />
          <PriceInfo>Loading crypto prices...</PriceInfo>
        </>
      ) : (
        <>
          <PriceInfo>
            Live Prices (updates every 30s):
            <RefreshButton onClick={handleRefreshPrices}>
              Refresh Prices
            </RefreshButton>
          </PriceInfo>

          <CryptoOptionsGrid>
            {Object.entries(cryptoAddresses).map(([crypto, details]) => {
              const cryptoAmount = calculateCryptoAmount(crypto);
              
              return (
                <CryptoOption key={crypto}>
                  <CryptoTitle>
                    {crypto === 'BTC' && '₿'}
                    {crypto === 'ETH' && 'Ξ'}
                    {crypto === 'USDT' && '₮'}
                    {details.name}
                    {prices[crypto] && (
                      <span style={{ color: '#999', marginLeft: 'auto', fontSize: '0.9rem' }}>
                        1 {crypto} = ${prices[crypto].toLocaleString()}
                      </span>
                    )}
                  </CryptoTitle>
                  
                  {cryptoAmount && (
                    <PriceInfo>
                      Send exactly: {cryptoAmount} {crypto}
                    </PriceInfo>
                  )}
                  
                  <QRCode>
                    <img 
                      src={cryptoPaymentService.generatePaymentQRCode(
                        details.address,
                        cryptoAmount,
                        crypto
                      )}
                      alt={`${crypto} QR Code`}
                    />
                  </QRCode>
                  
                  <AddressBox>
                    <input 
                      type="text" 
                      value={details.address} 
                      readOnly 
                    />
                    <CopyButton onClick={() => handleCopy(details.address)}>
                      {copiedAddress === details.address ? 'Copied!' : 'Copy'}
                    </CopyButton>
                  </AddressBox>
                </CryptoOption>
              );
            })}
          </CryptoOptionsGrid>
        </>
      )}

      {paymentStatus === 'completed' ? (
        <PaymentStatus status="completed">
          Payment Received! Redirecting...
        </PaymentStatus>
      ) : (
        <>
          <PaymentSentButton onClick={onBack}>
            I've Sent the Payment
          </PaymentSentButton>
          
          {process.env.NODE_ENV === 'development' && (
            <TestButton onClick={handleTestPayment}>
              Test Payment (Dev Only)
            </TestButton>
          )}
        </>
      )}
    </Container>
  );
}

export default CryptoPayment; 