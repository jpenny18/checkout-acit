import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountsContainer = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .subtitle {
    color: #999;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
`;

const ChartCard = styled(Card)`
  grid-column: span 3;
  
  @media (max-width: 1024px) {
    grid-column: span 2;
  }

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const ObjectivesCard = styled(Card)`
  grid-column: span 1;
`;

const MetricsCard = styled(Card)`
  grid-column: span 2;

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const JournalCard = styled(Card)`
  grid-column: span 2;

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const Metric = styled.div`
  h4 {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.2rem;
    color: ${props => props.color || 'white'};
  }
`;

const ObjectivesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Objective = styled.div`
  h4 {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .value {
    font-size: 1rem;
    color: ${props => props.color || 'white'};
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #333;
    border-radius: 2px;
    margin-top: 0.5rem;
    overflow: hidden;

    .fill {
      height: 100%;
      width: ${props => props.progress || '0%'};
      background: ${props => props.barColor || '#ffc62d'};
      transition: width 0.3s ease;
    }
  }
`;

const Table = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.75rem;
  border-bottom: 1px solid #333;
  font-size: 0.8rem;
  color: #999;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.75rem;
  border-bottom: 1px solid #333;
  font-size: 0.8rem;

  &:last-child {
    border-bottom: none;
  }
`;

// Sample data for the chart
const chartData = [
  { date: '28 Feb', value: 83795.00 },
  { date: 'Mar 25', value: 83795.25 },
  { date: '02 Mar', value: 83795.50 },
  { date: '03 Mar', value: 83795.75 }
];

const LockOverlay = styled.div`
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
  padding: 1rem;

  svg {
    color: #ffc62d;
    width: 24px;
    height: 24px;
  }

  p {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    margin: 0;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.75rem;

    svg {
      width: 20px;
      height: 20px;
    }

    p {
      font-size: 0.8rem;
    }
  }
`;

const StartButton = styled.button`
  background: #ffc62d;
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #e6b229;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const RelativeCard = styled(Card)`
  position: relative;
  overflow: hidden;
`;

const MyAccounts = () => {
  const navigate = useNavigate();

  return (
    <AccountsContainer>
      <Grid>
        <RelativeCard>
          <h3>Balance</h3>
          <div className="value">$83,795.53</div>
          <div className="subtitle">Current Account Balance</div>
          <LockOverlay>
            <Lock />
            <p>Please start an ACI Challenge to see your account metrics</p>
            <StartButton onClick={() => navigate('/dashboard')}>
              Start ACI Challenge
            </StartButton>
          </LockOverlay>
        </RelativeCard>
        <RelativeCard>
          <h3>Equity</h3>
          <div className="value">$83,795.53</div>
          <div className="subtitle">Real-time Account Value</div>
          <LockOverlay />
        </RelativeCard>
        <RelativeCard>
          <h3>Win Rate</h3>
          <div className="value">0.00%</div>
          <div className="subtitle">Success Rate</div>
          <LockOverlay />
        </RelativeCard>
        <RelativeCard>
          <h3>Total Trades</h3>
          <div className="value">0</div>
          <div className="subtitle">Completed Trades</div>
          <LockOverlay />
        </RelativeCard>

        <RelativeCard as={ChartCard}>
          <h3>Account Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00ff9d" 
                dot={{ stroke: '#00ff9d', strokeWidth: 2, r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <LockOverlay />
        </RelativeCard>

        <RelativeCard as={ObjectivesCard}>
          <h3>Trading Objectives</h3>
          <ObjectivesList>
            <Objective progress="0%" barColor="#666">
              <h4>
                Minimum Trading Days
                <span>0/4 Days</span>
              </h4>
              <div className="progress-bar">
                <div className="fill" />
              </div>
            </Objective>
            <Objective color="#ff4444" progress="0%" barColor="#ff4444">
              <h4>
                Max Daily Loss
                <span>Limit: $5000.00</span>
              </h4>
              <div className="value">$0.00</div>
              <div className="progress-bar">
                <div className="fill" />
              </div>
            </Objective>
            <Objective color="#ff4444" progress="0%" barColor="#ff4444">
              <h4>
                Max Loss
                <span>5%</span>
              </h4>
              <div className="value">$5000.00</div>
              <div className="progress-bar">
                <div className="fill" />
              </div>
            </Objective>
            <Objective color="#00ff9d" progress="0%" barColor="#00ff9d">
              <h4>
                Profit Target
                <span>10%</span>
              </h4>
              <div className="value">$10000.00</div>
              <div className="progress-bar">
                <div className="fill" />
              </div>
            </Objective>
          </ObjectivesList>
          <LockOverlay />
        </RelativeCard>

        <RelativeCard as={MetricsCard}>
          <h3>Performance Metrics</h3>
          <MetricsGrid>
            <Metric color="#00ff9d">
              <h4>Average Profit</h4>
              <div className="value">$0.00</div>
            </Metric>
            <Metric color="#ff4444">
              <h4>Average Loss</h4>
              <div className="value">$0.00</div>
            </Metric>
            <Metric>
              <h4>Average RRR</h4>
              <div className="value">0.00</div>
            </Metric>
            <Metric color="#00ff9d">
              <h4>Expectancy</h4>
              <div className="value">$0.00</div>
            </Metric>
            <Metric>
              <h4>Profit Factor</h4>
              <div className="value">0.00</div>
            </Metric>
            <Metric>
              <h4>Total Volume</h4>
              <div className="value">0.00 Lots</div>
            </Metric>
          </MetricsGrid>
          <LockOverlay />
        </RelativeCard>

        <RelativeCard as={JournalCard}>
          <h3>Trading Journal</h3>
          <Table>
            <TableHeader>
              <div>Type</div>
              <div>Symbol</div>
              <div>Volume</div>
              <div>Profit</div>
              <div>Duration</div>
            </TableHeader>
            {/* Empty state - no trades yet */}
          </Table>
          <LockOverlay />
        </RelativeCard>
      </Grid>
    </AccountsContainer>
  );
};

export default MyAccounts; 