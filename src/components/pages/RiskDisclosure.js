import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #ffc62d;
  margin-bottom: 2rem;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #ffc62d;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #ccc;
`;

const List = styled.ul`
  margin-bottom: 1rem;
  padding-left: 2rem;
  
  li {
    margin-bottom: 0.5rem;
    color: #ccc;
  }
`;

const RiskDisclosure = () => {
  return (
    <Container>
      <Title>Risk Disclosure</Title>
      
      <Section>
        <Text>Last updated: February 24, 2024</Text>
        <Text>
          Trading in financial markets involves substantial risks, including the potential loss of your entire investment. Before deciding to trade, you should carefully consider your objectives, financial situation, needs, and level of experience.
        </Text>
      </Section>

      <Section>
        <SectionTitle>General Risk Warning</SectionTitle>
        <Text>
          Trading foreign exchange and other financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade any financial instrument, you should carefully consider your investment objectives, level of experience, and risk appetite.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Specific Risks</SectionTitle>
        <List>
          <li>Market Risk: Prices of financial instruments can move rapidly and unpredictably</li>
          <li>Leverage Risk: Trading on margin can lead to losses exceeding your initial deposit</li>
          <li>Technical Risk: System failures or internet connectivity issues may affect trading</li>
          <li>Volatility Risk: Market volatility can cause rapid and substantial losses</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Evaluation Program Risks</SectionTitle>
        <Text>
          The ACI Trading evaluation program is a simulated trading environment. While we strive to replicate real market conditions, there may be differences between simulated and real trading environments. Success in the evaluation program does not guarantee success in real market trading.
        </Text>
      </Section>

      <Section>
        <SectionTitle>No Investment Advice</SectionTitle>
        <Text>
          ACI Trading LTD does not provide investment advice. All information provided is for educational purposes only. You should seek independent financial advice if you are unsure about any investment decision.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Text>
          If you have questions about this Risk Disclosure, please contact us at support@ascendantcapital.ca
        </Text>
      </Section>
    </Container>
  );
};

export default RiskDisclosure; 