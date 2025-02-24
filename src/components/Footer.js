import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  padding: 4rem 2rem;
  border-top: 1px solid #333;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #ffc62d;
  }
`;

const ExternalLink = styled.a`
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #ffc62d;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const Copyright = styled.div`
  text-align: center;
  color: #666;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/auth?mode=signup">Start Challenge</FooterLink>
          <FooterLink to="/auth?mode=login">Login</FooterLink>
          <FooterLink to="/auth?mode=signup">Sign Up</FooterLink>
          <FooterLink to="/dashboard">Dashboard</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/risk">Risk Disclosure</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/refund">Refund & Dispute Policy</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <ExternalLink href="mailto:support@ascendantcapital.ca">
            support@ascendantcapital.ca
          </ExternalLink>
          <SocialLinks>
            <ExternalLink href="https://twitter.com/acitradingchallenge" target="_blank" rel="noopener noreferrer">
              Twitter
            </ExternalLink>
            <ExternalLink href="https://discord.gg/acitradingchallenge" target="_blank" rel="noopener noreferrer">
              Discord
            </ExternalLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().getFullYear()} ACI Trading Challenge. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 