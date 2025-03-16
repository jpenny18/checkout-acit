import React from 'react';
import styled from 'styled-components';
import { Lock } from 'lucide-react';

const PayoutsContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  p {
    color: #999;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 0.8rem;
    }
  }
`;

const Table = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    overflow-x: auto;
    background: #222;
    
    &::-webkit-scrollbar {
      height: 4px;
      background: #1a1a1a;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
    }

    scrollbar-width: thin;
    scrollbar-color: #333 #1a1a1a;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 120px 100px 120px 100px;
    position: sticky;
    left: 0;
    top: 0;
    z-index: 2;
    font-size: 0.75rem;
    padding: 0.75rem 1rem;
    width: max-content;

    > div {
      text-align: left;
      white-space: nowrap;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333;
  background-color: #222;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #2a2a2a;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 120px 100px 120px 100px;
    font-size: 0.75rem;
    padding: 0.75rem 1rem;
    width: max-content;

    > div {
      text-align: left;
      white-space: nowrap;
    }
  }
`;

const StatusBadge = styled.span`
  background: rgba(0, 255, 157, 0.1);
  color: #00ff9d;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const InvoiceSection = styled.div`
  position: relative;
`;

const InvoiceLockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 2;
  backdrop-filter: blur(4px);
  border-radius: 12px;

  svg {
    color: #ffc62d;
    width: 32px;
    height: 32px;
    filter: none;
  }

  p {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
    filter: none;
  }
`;

const InvoiceForm = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #999;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  width: 100%;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  width: 100%;
  appearance: none;
  cursor: pointer;
`;

const Button = styled.button`
  background: #ffc62d;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
`;

const processTransactionData = () => {
  const methods = ['BTC', 'USDT', 'WIRE TRANSFER', 'PAYPAL', 'E-TRANSFER'];
  const entries = [];

  for (let i = 0; i < 5; i++) {
    const id = 'ACTR' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    const amount = Math.floor(Math.random() * (15000 - 300) + 300);
    const method = methods[Math.floor(Math.random() * methods.length)];

    entries.push({
      id,
      amount,
      method,
      status: 'Completed'
    });
  }

  return entries;
};

const getStoredTransactions = () => {
  const stored = localStorage.getItem('transactionHistory');
  if (stored) {
    const { data, timestamp } = JSON.parse(stored);
    const now = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    // If less than 24 hours have passed, return stored data
    if (now - timestamp < oneDayInMs) {
      return data;
    }
  }
  
  // Generate new data if no stored data or more than 24 hours old
  const newData = processTransactionData();
  localStorage.setItem('transactionHistory', JSON.stringify({
    data: newData,
    timestamp: new Date().getTime()
  }));
  return newData;
};

const Payouts = () => {
  const transactionHistory = React.useMemo(() => getStoredTransactions(), []);

  return (
    <PayoutsContainer>
      <Card>
        <Header>
          <h1>Payouts</h1>
          <p>View ACIT's recent successful transactions</p>
        </Header>

        <Table>
          <TableHeader>
            <div>Trader ID</div>
            <div>Amount</div>
            <div>Method</div>
            <div>Status</div>
          </TableHeader>
          {transactionHistory.map((transaction) => (
            <TableRow key={transaction.id}>
              <div>{transaction.id}</div>
              <div>${transaction.amount.toLocaleString()}</div>
              <div>{transaction.method}</div>
              <div><StatusBadge>{transaction.status}</StatusBadge></div>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Card>
        <Header>
          <h1>Request Withdrawal</h1>
          <p>Submit an invoice for your payout</p>
        </Header>

        <InvoiceSection>
          <InvoiceForm>
            <FormGroup>
              <Label>Amount</Label>
              <Input type="number" placeholder="Enter amount" />
            </FormGroup>

            <FormGroup>
              <Label>Payment Method</Label>
              <Select>
                <option value="">Select payment method</option>
                <option value="btc">Bitcoin (BTC)</option>
                <option value="usdt">USDT (TRC20)</option>
                <option value="wire">Wire Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="etransfer">E-Transfer</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Wallet Address / Account Details</Label>
              <Input type="text" placeholder="Enter your payment details" />
            </FormGroup>

            <Button type="submit">Submit Invoice</Button>
          </InvoiceForm>

          <InvoiceLockOverlay>
            <Lock />
            <p>Will become available on your withdrawal date</p>
          </InvoiceLockOverlay>
        </InvoiceSection>
      </Card>
    </PayoutsContainer>
  );
};

export default Payouts; 