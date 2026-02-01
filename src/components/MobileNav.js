import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0.5rem;
    right: 1.25rem;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Navigation = styled.nav`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 5rem 1rem 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: space-between;
  }
`;

const NavLinks = styled.div`
  background: rgba(42, 42, 42, 1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: auto 0;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffc62d;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  background: rgba(42, 42, 42, 1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
`;

const AuthButton = styled(Link)`
  flex: 1;
  background: ${props => props.variant === 'primary' ? '#ffc62d' : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#1a1a1a' : '#ffc62d'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #ffc62d'};
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#e6b229' : 'rgba(255, 198, 45, 0.1)'};
    color: ${props => props.variant === 'primary' ? '#1a1a1a' : '#ffc62d'};
  }
`;

const AuthButtonAsButton = styled.button`
  flex: 1;
  background: ${props => props.variant === 'primary' ? '#ffc62d' : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#1a1a1a' : '#ffc62d'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #ffc62d'};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#e6b229' : 'rgba(255, 198, 45, 0.1)'};
    color: ${props => props.variant === 'primary' ? '#1a1a1a' : '#ffc62d'};
  }
`;

const MobileNav = ({ scrollToPricing }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  const handleGetFunded = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    if (scrollToPricing) {
      scrollToPricing();
    }
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Get Funded CTA - Mobile Navigation',
        content_category: 'Landing Page'
      });
    }
  };

  return (
    <>
      <HamburgerButton onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </HamburgerButton>

      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      
      <Navigation isOpen={isOpen}>
        <NavLinks>
          <NavLink 
            href="#process" 
            onClick={(e) => handleNavClick(e, '#process')}
          >
            How It Works
          </NavLink>
          <NavLink 
            href="#accounts" 
            onClick={(e) => handleNavClick(e, '#accounts')}
          >
            Account Types
          </NavLink>
          <NavLink 
            href="#features" 
            onClick={(e) => handleNavClick(e, '#features')}
          >
            Features
          </NavLink>
          <NavLink 
            href="#faq" 
            onClick={(e) => handleNavClick(e, '#faq')}
          >
            FAQ
          </NavLink>
        </NavLinks>

        <AuthButtons>
          <AuthButton to="/auth?mode=login">
            LOGIN
          </AuthButton>
          <AuthButtonAsButton onClick={handleGetFunded} variant="primary">
            GET FUNDED
          </AuthButtonAsButton>
        </AuthButtons>
      </Navigation>
    </>
  );
};

export default MobileNav; 