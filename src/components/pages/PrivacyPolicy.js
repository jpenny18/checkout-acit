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

const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      
      <Section>
        <Text>Last updated: February 24, 2024</Text>
        <Text>
          At ACI Trading LTD, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Information We Collect</SectionTitle>
        <List>
          <li>Personal identification information (Name, email address, phone number)</li>
          <li>Financial information for payment processing</li>
          <li>Trading activity and performance data</li>
          <li>Usage data and analytics</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>How We Use Your Information</SectionTitle>
        <List>
          <li>To provide and maintain our trading evaluation service</li>
          <li>To process your payments and manage your account</li>
          <li>To communicate with you about your account and updates</li>
          <li>To improve our services and user experience</li>
          <li>To comply with legal obligations</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Data Security</SectionTitle>
        <Text>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Third-Party Services</SectionTitle>
        <Text>
          We may use third-party service providers to facilitate our services, process payments, or analyze how our service is used. These third parties have access to your information only to perform these tasks on our behalf.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Text>
          If you have questions about this Privacy Policy, please contact us at support@ascendantcapital.ca
        </Text>
      </Section>
    </Container>
  );
};

export default PrivacyPolicy; 