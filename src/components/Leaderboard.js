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

/* Commented out - not currently used
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
*/

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

/* Commented out - not currently used
const CountryFlag = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
`;
*/

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
        name: 'Marcus Thompson',
        country: { code: 'AU', flag: '🇦🇺' },
        profit: 14875,
        equity: 64875,
        gainPercentage: 29.75,
        accountSize: 50000
      },
      {
        rank: 2,
        name: 'Yuki Tanaka',
        country: { code: 'JP', flag: '🇯🇵' },
        profit: 13250,
        equity: 63250,
        gainPercentage: 26.5,
        accountSize: 50000
      },
      {
        rank: 3,
        name: 'Sofia Rodriguez',
        country: { code: 'MX', flag: '🇲🇽' },
        profit: 11625,
        equity: 61625,
        gainPercentage: 23.25,
        accountSize: 50000
      },
      {
        rank: 4,
        name: 'Henrik Andersson',
        country: { code: 'SE', flag: '🇸🇪' },
        profit: 9750,
        equity: 59750,
        gainPercentage: 19.5,
        accountSize: 50000
      },
      {
        rank: 5,
        name: 'Chen Wei',
        country: { code: 'SG', flag: '🇸🇬' },
        profit: 8625,
        equity: 58625,
        gainPercentage: 17.25,
        accountSize: 50000
      },
      {
        rank: 6,
        name: 'Isabella Costa',
        country: { code: 'BR', flag: '🇧🇷' },
        profit: 7000,
        equity: 57000,
        gainPercentage: 14.0,
        accountSize: 50000
      },
      {
        rank: 7,
        name: 'Ahmed Hassan',
        country: { code: 'AE', flag: '🇦🇪' },
        profit: 5750,
        equity: 55750,
        gainPercentage: 11.5,
        accountSize: 50000
      },
      {
        rank: 8,
        name: 'Emma Nielsen',
        country: { code: 'DK', flag: '🇩🇰' },
        profit: 4625,
        equity: 54625,
        gainPercentage: 9.25,
        accountSize: 50000
      },
      {
        rank: 9,
        name: 'Luca Bianchi',
        country: { code: 'IT', flag: '🇮🇹' },
        profit: 3750,
        equity: 53750,
        gainPercentage: 7.5,
        accountSize: 50000
      },
      {
        rank: 10,
        name: 'Nathan Clarke',
        country: { code: 'NZ', flag: '🇳🇿' },
        profit: 2875,
        equity: 52875,
        gainPercentage: 5.75,
        accountSize: 50000
      }
    ],
    '100000': [
      {
        rank: 1,
        name: 'Rafael Silva',
        country: { code: 'PT', flag: '🇵🇹' },
        profit: 35750,
        equity: 135750,
        gainPercentage: 35.75,
        accountSize: 100000
      },
      {
        rank: 2,
        name: 'Olivia Bennett',
        country: { code: 'IE', flag: '🇮🇪' },
        profit: 29000,
        equity: 129000,
        gainPercentage: 29.0,
        accountSize: 100000
      },
      {
        rank: 3,
        name: 'Dmitri Volkov',
        country: { code: 'EE', flag: '🇪🇪' },
        profit: 23750,
        equity: 123750,
        gainPercentage: 23.75,
        accountSize: 100000
      },
      {
        rank: 4,
        name: 'Arjun Patel',
        country: { code: 'IN', flag: '🇮🇳' },
        profit: 19500,
        equity: 119500,
        gainPercentage: 19.5,
        accountSize: 100000
      },
      {
        rank: 5,
        name: 'Kim Min-Jun',
        country: { code: 'KR', flag: '🇰🇷' },
        profit: 16250,
        equity: 116250,
        gainPercentage: 16.25,
        accountSize: 100000
      },
      {
        rank: 6,
        name: 'Maya Kowalski',
        country: { code: 'PL', flag: '🇵🇱' },
        profit: 13000,
        equity: 113000,
        gainPercentage: 13.0,
        accountSize: 100000
      },
      {
        rank: 7,
        name: 'Sebastian Bach',
        country: { code: 'AT', flag: '🇦🇹' },
        profit: 10750,
        equity: 110750,
        gainPercentage: 10.75,
        accountSize: 100000
      },
      {
        rank: 8,
        name: 'Fatima Al-Rashid',
        country: { code: 'SA', flag: '🇸🇦' },
        profit: 8500,
        equity: 108500,
        gainPercentage: 8.5,
        accountSize: 100000
      },
      {
        rank: 9,
        name: 'Lars Eriksen',
        country: { code: 'NO', flag: '🇳🇴' },
        profit: 6750,
        equity: 106750,
        gainPercentage: 6.75,
        accountSize: 100000
      },
      {
        rank: 10,
        name: 'Victoria Grant',
        country: { code: 'ZA', flag: '🇿🇦' },
        profit: 5500,
        equity: 105500,
        gainPercentage: 5.5,
        accountSize: 100000
      }
    ],
    '200000': [
      {
        rank: 1,
        name: 'Tyler Morrison',
        country: { code: 'US', flag: '🇺🇸' },
        profit: 72500,
        equity: 272500,
        gainPercentage: 36.25,
        accountSize: 200000
      },
      {
        rank: 2,
        name: 'Nadia Petrov',
        country: { code: 'BG', flag: '🇧🇬' },
        profit: 59000,
        equity: 259000,
        gainPercentage: 29.5,
        accountSize: 200000
      },
      {
        rank: 3,
        name: 'Santiago Hernandez',
        country: { code: 'CL', flag: '🇨🇱' },
        profit: 47000,
        equity: 247000,
        gainPercentage: 23.5,
        accountSize: 200000
      },
      {
        rank: 4,
        name: 'Liam O\'Connor',
        country: { code: 'UK', flag: '🇬🇧' },
        profit: 39000,
        equity: 239000,
        gainPercentage: 19.5,
        accountSize: 200000
      },
      {
        rank: 5,
        name: 'Priya Sharma',
        country: { code: 'IN', flag: '🇮🇳' },
        profit: 33000,
        equity: 233000,
        gainPercentage: 16.5,
        accountSize: 200000
      },
      {
        rank: 6,
        name: 'Jan van der Berg',
        country: { code: 'NL', flag: '🇳🇱' },
        profit: 26000,
        equity: 226000,
        gainPercentage: 13.0,
        accountSize: 200000
      },
      {
        rank: 7,
        name: 'Elena Ivanova',
        country: { code: 'RO', flag: '🇷🇴' },
        profit: 21000,
        equity: 221000,
        gainPercentage: 10.5,
        accountSize: 200000
      },
      {
        rank: 8,
        name: 'Kenji Yamamoto',
        country: { code: 'JP', flag: '🇯🇵' },
        profit: 17000,
        equity: 217000,
        gainPercentage: 8.5,
        accountSize: 200000
      },
      {
        rank: 9,
        name: 'Marco Schneider',
        country: { code: 'DE', flag: '🇩🇪' },
        profit: 14000,
        equity: 214000,
        gainPercentage: 7.0,
        accountSize: 200000
      },
      {
        rank: 10,
        name: 'Zara Khan',
        country: { code: 'CA', flag: '🇨🇦' },
        profit: 11000,
        equity: 211000,
        gainPercentage: 5.5,
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
          <p>Overview of currently most profitable active ACIT Traders Accounts.</p>
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