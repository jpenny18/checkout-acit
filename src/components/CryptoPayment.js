import React, { useState } from 'react';
import styled from 'styled-components';

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

function CryptoPayment({ amount, onBack }) {
  const [copiedAddress, setCopiedAddress] = useState('');

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const getQRCodeUrl = (address, crypto) => {
    // Encode the address to handle special characters
    const encodedAddress = encodeURIComponent(address);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedAddress}`;
  };

  return (
    <Container>
      <BackButton onClick={onBack}>← Back to Checkout</BackButton>
      
      <Title>Crypto Payment</Title>
      <DiscountBadge>25% Crypto Discount Applied</DiscountBadge>
      <Amount>${amount.toLocaleString()}</Amount>

      <CryptoOptionsGrid>
        {Object.entries(cryptoAddresses).map(([crypto, details]) => (
          <CryptoOption key={crypto}>
            <CryptoTitle>
              {crypto === 'BTC' && '₿'}
              {crypto === 'ETH' && 'Ξ'}
              {crypto === 'USDT' && '₮'}
              {details.name}
            </CryptoTitle>
            
            <QRCode>
              <img 
                src={getQRCodeUrl(details.address, crypto)}
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
        ))}
      </CryptoOptionsGrid>

      <PaymentSentButton onClick={onBack}>
        I've Sent the Payment
      </PaymentSentButton>
    </Container>
  );
}

export default CryptoPayment; 