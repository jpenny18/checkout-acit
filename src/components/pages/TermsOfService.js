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

const TermsOfService = () => {
  return (
    <Container>
      <Title>Terms of Service</Title>
      
      <Section>
        <Text>Last updated: February 24, 2024</Text>
        <Text>
          Please read these Terms of Service carefully before using the ACI Trading LTD evaluation program and services.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Acceptance of Terms</SectionTitle>
        <Text>
          By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Evaluation Program Rules</SectionTitle>
        <List>
          <li>You must follow all trading rules and guidelines specified in your evaluation program</li>
          <li>Trading results must be achieved through legitimate trading practices</li>
          <li>Multiple accounts or sharing accounts is strictly prohibited</li>
          <li>You must maintain the required risk management parameters</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Account Access</SectionTitle>
        <Text>
          You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Prohibited Activities</SectionTitle>
        <List>
          <li>Using expert advisors or automated trading systems without approval</li>
          <li>Manipulating or attempting to manipulate trading results</li>
          <li>Sharing or distributing account access</li>
          <li>Engaging in any form of market manipulation</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Termination</SectionTitle>
        <Text>
          We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason at our discretion.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Intellectual Property</SectionTitle>
        <Text>
          All content, features, and functionality of our services are owned by ACI Trading LTD and are protected by international copyright, trademark, and other intellectual property laws.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Modifications</SectionTitle>
        <Text>
          We reserve the right to modify these Terms of Service at any time. Continued use of our services after any modifications indicates your acceptance of the updated terms.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Text>
          If you have questions about these Terms of Service, please contact us at support@acitrading.ca
        </Text>
      </Section>
    </Container>
  );
};

export default TermsOfService; 