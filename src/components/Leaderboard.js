import React, { useState } from 'react';
import styled from 'styled-components';
import { Trophy } from 'lucide-react';

const LeaderboardContainer = styled.div`
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
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 8px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    svg {
      color: #ffc62d;
    }
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

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#ffc62d' : 'transparent'};
  color: ${props => props.active ? '#1a1a1a' : '#fff'};
  border: 2px solid ${props => props.active ? '#ffc62d' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    border-color: #ffc62d;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const TopTradersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TopTraderCard = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 198, 45, 0.2);
  position: relative;
  overflow: hidden;

  ${props => props.rank === 1 && `
    grid-column: 1 / -1;
    background: linear-gradient(135deg, rgba(255, 198, 45, 0.2), rgba(42, 42, 42, 0.5));
  `}

  ${props => props.rank === 2 && `
    @media (min-width: 769px) {
      grid-column: 1 / 2;
    }
  `}

  ${props => props.rank === 3 && `
    @media (min-width: 769px) {
      grid-column: 2 / 3;
    }
  `}

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RankBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch (props.rank) {
      case 1: return '#ffc62d';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#666';
    }
  }};
  color: ${props => props.rank === 1 ? '#1a1a1a' : '#fff'};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
`;

const TraderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Medal = styled.div`
  width: ${props => props.rank === 1 ? '64px' : '48px'};
  height: ${props => props.rank === 1 ? '64px' : '48px'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.rank === 1 ? '2.5rem' : '2rem'};

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
`;

const TraderDetails = styled.div`
  flex: 1;

  h3 {
    font-size: ${props => props.rank === 1 ? '1.5rem' : '1.2rem'};
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .country {
    color: #999;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
    .country {
      font-size: 0.8rem;
    }
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .label {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: ${props => props.rank === 1 ? '1.2rem' : '1rem'};
    font-weight: 600;
  }

  .gain {
    color: #00ff9d;
  }

  @media (max-width: 768px) {
    .label {
      font-size: 0.7rem;
    }
    .value {
      font-size: 0.9rem;
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
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 60px 160px 100px 100px 100px 100px 100px;
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
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
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
    grid-template-columns: 60px 160px 100px 100px 100px 100px 100px;
    font-size: 0.75rem;
    padding: 0.75rem 1rem;
    width: max-content;

    > div {
      text-align: left;
      white-space: nowrap;
    }
  }
`;

const CountryFlag = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
`;

const GainText = styled.span`
  color: #00ff9d;
  font-weight: 600;
`;

const Leaderboard = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [traders] = useState({
    '50000': [
      {
        rank: 1,
        name: 'Alexander Schmidt',
        country: { code: 'DE', flag: '🇩🇪' },
        profit: 32500,
        equity: 82500,
        gainPercentage: 65.0,
        accountSize: 50000
      },
      {
        rank: 2,
        name: 'James Wilson',
        country: { code: 'UK', flag: '🇬🇧' },
        profit: 24500,
        equity: 74500,
        gainPercentage: 49.0,
        accountSize: 50000
      },
      {
        rank: 3,
        name: 'Lucas Martin',
        country: { code: 'FR', flag: '🇫🇷' },
        profit: 21000,
        equity: 71000,
        gainPercentage: 42.0,
        accountSize: 50000
      },
      {
        rank: 4,
        name: 'Chan Tai Man',
        country: { code: 'HK', flag: '🇭🇰' },
        profit: 18500,
        equity: 68500,
        gainPercentage: 37.0,
        accountSize: 50000
      },
      {
        rank: 5,
        name: 'Muhammad Khan',
        country: { code: 'PK', flag: '🇵🇰' },
        profit: 15000,
        equity: 65000,
        gainPercentage: 30.0,
        accountSize: 50000
      },
      {
        rank: 6,
        name: 'Leonardo Rossi',
        country: { code: 'IT', flag: '🇮🇹' },
        profit: 12500,
        equity: 62500,
        gainPercentage: 25.0,
        accountSize: 50000
      },
      {
        rank: 7,
        name: 'Hans Weber',
        country: { code: 'CH', flag: '🇨🇭' },
        profit: 10000,
        equity: 60000,
        gainPercentage: 20.0,
        accountSize: 50000
      },
      {
        rank: 8,
        name: 'David Miller',
        country: { code: 'US', flag: '🇺🇸' },
        profit: 7500,
        equity: 57500,
        gainPercentage: 15.0,
        accountSize: 50000
      },
      {
        rank: 9,
        name: 'Antonio García',
        country: { code: 'ES', flag: '🇪🇸' },
        profit: 6000,
        equity: 56000,
        gainPercentage: 12.0,
        accountSize: 50000
      },
      {
        rank: 10,
        name: 'John Taylor',
        country: { code: 'CA', flag: '🇨🇦' },
        profit: 5000,
        equity: 55000,
        gainPercentage: 10.0,
        accountSize: 50000
      }
    ],
    '100000': [
      {
        rank: 1,
        name: 'Oliver Smith',
        country: { code: 'UK', flag: '🇬🇧' },
        profit: 68000,
        equity: 168000,
        gainPercentage: 68.0,
        accountSize: 100000
      },
      {
        rank: 2,
        name: 'Michael Jones',
        country: { code: 'US', flag: '🇺🇸' },
        profit: 52000,
        equity: 152000,
        gainPercentage: 52.0,
        accountSize: 100000
      },
      {
        rank: 3,
        name: 'Felix Fischer',
        country: { code: 'DE', flag: '🇩🇪' },
        profit: 43000,
        equity: 143000,
        gainPercentage: 43.0,
        accountSize: 100000
      },
      {
        rank: 4,
        name: 'Gabriel Dubois',
        country: { code: 'FR', flag: '🇫🇷' },
        profit: 35000,
        equity: 135000,
        gainPercentage: 35.0,
        accountSize: 100000
      },
      {
        rank: 5,
        name: 'Wong Siu Ming',
        country: { code: 'HK', flag: '🇭🇰' },
        profit: 28000,
        equity: 128000,
        gainPercentage: 28.0,
        accountSize: 100000
      },
      {
        rank: 6,
        name: 'Hassan Shah',
        country: { code: 'PK', flag: '🇵🇰' },
        profit: 22000,
        equity: 122000,
        gainPercentage: 22.0,
        accountSize: 100000
      },
      {
        rank: 7,
        name: 'Francesco Russo',
        country: { code: 'IT', flag: '🇮🇹' },
        profit: 18000,
        equity: 118000,
        gainPercentage: 18.0,
        accountSize: 100000
      },
      {
        rank: 8,
        name: 'José Martínez',
        country: { code: 'ES', flag: '🇪🇸' },
        profit: 15000,
        equity: 115000,
        gainPercentage: 15.0,
        accountSize: 100000
      },
      {
        rank: 9,
        name: 'Peter Mueller',
        country: { code: 'CH', flag: '🇨🇭' },
        profit: 12000,
        equity: 112000,
        gainPercentage: 12.0,
        accountSize: 100000
      },
      {
        rank: 10,
        name: 'William Brown',
        country: { code: 'CA', flag: '🇨🇦' },
        profit: 10000,
        equity: 110000,
        gainPercentage: 10.0,
        accountSize: 100000
      }
    ],
    '200000': [
      {
        rank: 1,
        name: 'Robert Brown',
        country: { code: 'US', flag: '🇺🇸' },
        profit: 134000,
        equity: 334000,
        gainPercentage: 67.0,
        accountSize: 200000
      },
      {
        rank: 2,
        name: 'Harry Jones',
        country: { code: 'UK', flag: '🇬🇧' },
        profit: 102000,
        equity: 302000,
        gainPercentage: 51.0,
        accountSize: 200000
      },
      {
        rank: 3,
        name: 'Maximilian Müller',
        country: { code: 'DE', flag: '🇩🇪' },
        profit: 84000,
        equity: 284000,
        gainPercentage: 42.0,
        accountSize: 200000
      },
      {
        rank: 4,
        name: 'Jules Moreau',
        country: { code: 'FR', flag: '🇫🇷' },
        profit: 72000,
        equity: 272000,
        gainPercentage: 36.0,
        accountSize: 200000
      },
      {
        rank: 5,
        name: 'Lau Ka Chun',
        country: { code: 'HK', flag: '🇭🇰' },
        profit: 60000,
        equity: 260000,
        gainPercentage: 30.0,
        accountSize: 200000
      },
      {
        rank: 6,
        name: 'Ali Ahmed',
        country: { code: 'PK', flag: '🇵🇰' },
        profit: 48000,
        equity: 248000,
        gainPercentage: 24.0,
        accountSize: 200000
      },
      {
        rank: 7,
        name: 'Alessandro Ferrari',
        country: { code: 'IT', flag: '🇮🇹' },
        profit: 36000,
        equity: 236000,
        gainPercentage: 18.0,
        accountSize: 200000
      },
      {
        rank: 8,
        name: 'Manuel González',
        country: { code: 'ES', flag: '🇪🇸' },
        profit: 30000,
        equity: 230000,
        gainPercentage: 15.0,
        accountSize: 200000
      },
      {
        rank: 9,
        name: 'Thomas Fischer',
        country: { code: 'CH', flag: '🇨🇭' },
        profit: 24000,
        equity: 224000,
        gainPercentage: 12.0,
        accountSize: 200000
      },
      {
        rank: 10,
        name: 'Robert Johnson',
        country: { code: 'CA', flag: '🇨🇦' },
        profit: 20000,
        equity: 220000,
        gainPercentage: 10.0,
        accountSize: 200000
      }
    ]
  });

  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  const getDisplayTraders = () => {
    if (selectedTab === 'all') {
      const allTraders = [
        ...traders['50000'],
        ...traders['100000'],
        ...traders['200000']
      ].sort((a, b) => b.gainPercentage - a.gainPercentage)
      .slice(0, 10)
      .map((trader, index) => ({ ...trader, rank: index + 1 }));
      return allTraders;
    }
    return traders[selectedTab];
  };

  const displayTraders = getDisplayTraders();

  return (
    <LeaderboardContainer>
      <Card>
        <Header>
          <h1><Trophy size={24} /> Leaderboard</h1>
          <p>Overview of currently most profitable active FTMO Accounts.</p>
        </Header>

        <TabsContainer>
          <Tab active={selectedTab === 'all'} onClick={() => setSelectedTab('all')}>
            ALL
          </Tab>
          <Tab active={selectedTab === '50000'} onClick={() => setSelectedTab('50000')}>
            50K
          </Tab>
          <Tab active={selectedTab === '100000'} onClick={() => setSelectedTab('100000')}>
            100K
          </Tab>
          <Tab active={selectedTab === '200000'} onClick={() => setSelectedTab('200000')}>
            200K
          </Tab>
        </TabsContainer>

        <TopTradersGrid>
          {displayTraders.slice(0, 3).map(trader => (
            <TopTraderCard key={trader.rank} rank={trader.rank}>
              <RankBadge rank={trader.rank}>{trader.rank}</RankBadge>
              <TraderInfo>
                <div style={{ fontSize: trader.rank === 1 ? '3rem' : '2.5rem' }}>
                  {getMedalEmoji(trader.rank)}
                </div>
                <TraderDetails rank={trader.rank}>
                  <h3>{trader.name}</h3>
                  <div className="country">
                    <span>{trader.country.flag}</span>
                    {trader.country.code}
                  </div>
                </TraderDetails>
              </TraderInfo>
              <Stats>
                <StatItem rank={trader.rank}>
                  <div className="label">Profit</div>
                  <div className="value">${trader.profit.toLocaleString()}</div>
                </StatItem>
                <StatItem rank={trader.rank}>
                  <div className="label">Equity</div>
                  <div className="value">${trader.equity.toLocaleString()}</div>
                </StatItem>
                <StatItem rank={trader.rank}>
                  <div className="label">Gain</div>
                  <div className="value gain">{trader.gainPercentage}%</div>
                </StatItem>
                <StatItem rank={trader.rank}>
                  <div className="label">Account size</div>
                  <div className="value">${trader.accountSize.toLocaleString()}</div>
                </StatItem>
              </Stats>
            </TopTraderCard>
          ))}
        </TopTradersGrid>

        <Table>
          <TableHeader>
            <div>#</div>
            <div>Name</div>
            <div>Profit</div>
            <div>Equity</div>
            <div>Gain %</div>
            <div>Account size</div>
            <div>Country</div>
          </TableHeader>
          {displayTraders.slice(3).map(trader => (
            <TableRow key={trader.rank}>
              <div>{trader.rank}</div>
              <div>{trader.name}</div>
              <div>${trader.profit.toLocaleString()}</div>
              <div>${trader.equity.toLocaleString()}</div>
              <div><GainText>{trader.gainPercentage}%</GainText></div>
              <div>${(trader.accountSize).toLocaleString()}</div>
              <div>{trader.country.flag} {trader.country.code}</div>
            </TableRow>
          ))}
        </Table>
      </Card>
    </LeaderboardContainer>
  );
};

export default Leaderboard;