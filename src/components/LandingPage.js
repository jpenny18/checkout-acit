import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import MobileNav from './MobileNav';
import Button from './Button';
import Footer from './Footer';
import Globe from './Globe';
import { Link } from 'react-router-dom';
// import { getCachedCryptoDiscountPercentage } from '../config/promotions'; // Commented out - not currently used

const GlobalStyle = createGlobalStyle`
  body {
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }
`;

const PageWrapper = styled.div`
  overflow-x: hidden;
  width: 100%;
  position: relative;
`;

const Navigation = styled.nav`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    top: 0.5rem;
    width: 92%;
    border-radius: 16px;
    justify-content: center;
    position: relative;
    margin: 0;
  }
`;

const Logo = styled.img`
  height: 40px;
  position: relative;

  @media (max-width: 768px) {
    height: 48px;
    margin: 0 auto;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: absolute;
    right: 0.75rem;
    gap: 0;

    > a {
      display: none;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffc62d;
  }
`;

const MainHeading = styled.h1`
  font-size: 4.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: white;
  
  span {
    color: #ffc62d;
    display: block;
    font-size: 0.9em;
    white-space: nowrap;
  }
  
  @media (max-width: 1024px) {
    font-size: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    width: 100%;
    
    span {
      font-size: 0.85em;
      white-space: nowrap;
      padding: 0;
      min-width: min-content;
      display: inline-block;
      width: 100%;
    }
  }
`;

const SubHeading = styled.p`
  font-size: 1.25rem;
  color: #999;
  margin-bottom: 2.5rem;
  max-width: 500px;
  
  @media (max-width: 1024px) {
    font-size: 1.15rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 auto 1.5rem;
    text-align: center;
    padding: 0 1rem;
    width: 100%;
  }
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    justify-content: center;
    width: 100%;
    order: 4; // Ensure it appears after the button
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffc62d' : '#444'};
  font-size: 1.25rem;
`;

const RatingText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 500;
`;

const HeroContent = styled.div`
  max-width: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    > ${SubHeading}, > button, > ${StarRating} {
      order: 3;
    }

    > ${MainHeading} {
      order: 1;
    }
  }
`;

const ShootingStarsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const ShootingStar = styled.div`
  position: absolute;
  top: ${props => props.top}%;
  right: ${props => props.right}%;
  width: 3px;
  height: 3px;
  background: #ffc62d;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffc62d, 0 0 20px #ffc62d, 0 0 30px rgba(255,198,45,0.5);
  opacity: 0;
  animation: shootingStar ${props => props.duration}s linear ${props => props.delay}s infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 2px;
    background: linear-gradient(135deg, #ffc62d, transparent);
    transform-origin: left center;
    transform: translate(-50%, -50%) rotate(-40deg);
  }
  
  @keyframes shootingStar {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translate(-600px, 600px) scale(0);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    width: 2px;
    height: 2px;
    
    &::before {
      width: 50px;
      height: 1.5px;
    }
    
    @keyframes shootingStar {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        transform: translate(-600px, 600px) scale(0);
        opacity: 0;
      }
    }
  }
`;

const SplatParticle = styled.div`
  position: absolute;
  top: ${props => props.splatTop}%;
  right: ${props => props.splatRight}%;
  width: 8px;
  height: 8px;
  background: #ffc62d;
  border-radius: 50%;
  opacity: 0;
  animation: splatParticle ${props => props.duration}s ease-out ${props => props.delay + props.duration * 0.7}s infinite;
  
  @keyframes splatParticle {
    0% {
      transform: translate(0, 0) scale(0);
      opacity: 0;
    }
    2% {
      opacity: 1;
    }
    100% {
      transform: translate(${props => props.particleX}px, ${props => props.particleY}px) scale(0.2);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    width: 5px;
    height: 5px;
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #151515 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  position: relative;
  padding: 8rem 2rem 12rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle at top right, rgba(255,198,45,0.08) 0%, rgba(26,26,26,0) 50%);
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(0deg, #1a1a1a 0%, transparent 100%);
  }

  @media (max-width: 1024px) {
    padding: 7rem 2rem 10rem;
  }

  @media (max-width: 768px) {
    padding: 6rem 1rem 8rem;
    min-height: 100vh; // Ensure full viewport height on mobile
    height: auto;
    justify-content: flex-start;
  }
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 198, 45, 0.15);
  border-radius: 50%;
  animation: particleFloat 15s linear infinite;

  ${[...Array(20)].map((_, i) => `
    &:nth-child(${i + 1}) {
      top: ${Math.random() * 100}%;
      right: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 10}s;
      animation-duration: ${15 + Math.random() * 15}s;
    }
  `)}

  @keyframes particleFloat {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100vw);
    }
  }
`;

const HeroContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    gap: 2rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroRight = styled.div`
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: visible;

  @media (max-width: 1024px) {
    height: 500px;
  }

  @media (max-width: 768px) {
    height: 350px;
    order: 2;
    margin: 1rem 0 2rem;
    overflow: visible;
  }
`;

const GlobeWrapper = styled.div`
  width: 400px;
  height: 400px;
  position: relative;
  margin: 0 auto;
  z-index: 1;

  @media (max-width: 1024px) {
    width: 300px;
    height: 300px;
  }

  @media (max-width: 768px) {
    width: 350px;
    height: 280px;
    transform: scale(0.9);
  }
`;

const StatCardContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
`;

const StatCard = styled.div`
  position: absolute;
  background: rgba(42, 42, 42, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  border: 1px solid rgba(255, 198, 45, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 198, 45, 0.1);
  animation: float 6s ease-in-out infinite;
  width: 230px;
  pointer-events: auto;

  /* First stat card (Total Funding) - top right */
  &:first-of-type {
    top: 15%;
    right: 60px;
    animation-delay: 0.5s;
  }

  /* Second stat card - bottom left */
  &:last-of-type {
    bottom: 15%;
    left: 60px;
    animation-delay: 1s;
  }

  h3 {
    color: #ffc62d;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    text-shadow: 0 0 20px rgba(255, 198, 45, 0.3);
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    width: 180px;
    padding: 1.25rem;

    h3 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.8rem;
    }

    &:first-of-type {
      right: 0;
    }

    &:last-of-type {
      left: 0;
    }
  }

  @media (max-width: 768px) {
    width: 140px;
    padding: 0.875rem;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.75rem;
    }

    &:first-of-type {
      top: 5%;
      right: -10px;
    }

    &:last-of-type {
      bottom: 5%;
      left: -10px;
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const ProcessSection = styled.section`
  position: relative;
  padding: 8rem 2rem;
  background: #1a1a1a;
  margin-bottom: -4rem;

  @media (max-width: 1024px) {
    padding: 6rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const EvaluationCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: #222;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &.evaluation-card {
    box-shadow: 0 0 20px rgba(0, 149, 255, 0.15);
    border: 1px solid rgba(0, 149, 255, 0.1);
  }

  &.trader-card {
    box-shadow: 0 0 20px rgba(255, 198, 45, 0.15);
    border: 1px solid rgba(255, 198, 45, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h2 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const DemoBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.monetized ? '#ffc62d' : '#333'};
  color: ${props => props.monetized ? '#1a1a1a' : 'white'};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const Steps = styled.div`
  margin-top: 2rem;
`;

const Step = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    color: #ffc62d;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  h4 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  p {
    color: #999;
    line-height: 1.6;
  }
`;

const AccountDetails = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #333;

  h4 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    color: #999;

    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
      position: relative;
      padding-left: 1.5rem;

      &:before {
        content: "•";
        color: #ffc62d;
        position: absolute;
        left: 0;
      }
    }
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: #ffc62d;
    margin: 1rem auto 0;
    border-radius: 2px;
  }

  @media (max-width: 1024px) {
    font-size: 2.2rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;

    &::after {
      width: 60px;
      height: 3px;
      margin-top: 0.75rem;
    }
  }
`;

const ChallengeSection = styled.section`
  padding: 8rem 2rem 12rem;
  background: #1a1a1a;
  position: relative;
  margin-bottom: -4rem;

  @media (max-width: 1024px) {
    padding: 6rem 2rem 10rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem 8rem;
  }
`;

const BalanceSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 2rem;
    justify-content: center;
  }
`;

const BalanceButton = styled.button`
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.selected ? '#ffc62d' : '#333'};
  background: ${props => props.selected ? '#ffc62d' : 'transparent'};
  color: ${props => props.selected ? '#000' : '#fff'};
  cursor: pointer;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
  max-width: 180px;
  font-size: 1rem;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    min-width: unset;
    max-width: unset;
    flex: 1 1 calc(50% - 0.5rem);
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
    border-width: 2px;
    
    &:nth-child(5) {
      flex: 1 1 100%;
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
    border-radius: 6px;
    overflow-x: auto;
    background: #222;
    display: block;
    width: 100%;
    
    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    /* Scroll indicator container */
    &::after {
      content: 'scroll';
      position: absolute;
      top: calc(50% - 15px);
      right: 2.5rem;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: rgba(255, 198, 45, 0.6);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;

      &::after {
        content: '';
        width: 24px;
        height: 24px;
        background: rgba(255, 198, 45, 0.2);
        border-radius: 50%;
        animation: pulseRight 1.5s infinite;
      }
    }

    /* Only show indicator when there's horizontal scroll and not actively scrolling */
    &:not(:hover):not(:active) {
      &::after {
        opacity: ${props => props.hasScroll ? '1' : '0'};
      }
    }

    &:active::after,
    &:hover::after {
      opacity: 0;
    }
  }

  @keyframes pulseRight {
    0% {
      transform: translate(0, -50%);
      opacity: 1;
    }
    50% {
      transform: translate(10px, -50%);
      opacity: 0.5;
    }
    100% {
      transform: translate(0, -50%);
      opacity: 1;
    }
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    grid-template-columns: 150px 120px 120px 120px;
    position: sticky;
    top: 0;
    z-index: 2;
    background: #2a2a2a;
    width: fit-content;
    min-width: 100%;

    > div:first-child {
      position: sticky;
      left: 0;
      background: #2a2a2a;
      padding-left: 0.75rem;
      z-index: 3;
      border-right: 1px solid #333;
    }

    > div {
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 44px;
      background: #2a2a2a;
      border-right: 1px solid #333;

      &:last-child {
        border-right: none;
        background: #2a2a2a;
      }
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #333;
  background-color: #222;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    grid-template-columns: 150px 120px 120px 120px;
    position: relative;
    width: fit-content;
    min-width: 100%;

    > div:first-child {
      position: sticky;
      left: 0;
      background: #222;
      padding-left: 0.75rem;
      z-index: 1;
      display: flex;
      align-items: center;
      border-right: 1px solid #333;
    }

    > div {
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 44px;
      background: #222;
      border-right: 1px solid #333;

      &:last-child {
        border-right: none;
        background: #222;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      > div {
        background: #2a2a2a;
      }
    }
  }
`;

const HighlightedCell = styled.div`
  color: #ffc62d;
  font-weight: bold;
`;

const PromotionBanner = styled.div`
  background-color: rgba(255, 198, 45, 0.1);
  color: #ffc62d;
  padding: 1rem;
  margin: 2rem auto;
  border-radius: 4px;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.5rem;
    margin: 1rem auto;
    max-width: 80%;
  }
`;

/* Commented out - not currently used
const HeroButton = styled(Button)`
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;
*/

const StartButton = styled(Button)`
  width: 100%;
  max-width: 400px;
  margin: 2rem auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  @media (max-width: 768px) {
    max-width: 200px;
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: visible;
    margin: 1.5rem auto 0;
  }
`;

const FAQButton = styled(Button)`
  margin: 3rem auto 0;
  display: flex;
  justify-content: center;
  max-width: 200px;
  font-size: 0.9rem;
  white-space: nowrap;
  padding: 0.75rem 1.5rem;

  @media (max-width: 768px) {
    margin: 2rem auto 0;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #222 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: -4rem;

  /* Radial gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,198,45,0.03) 0%, rgba(26,26,26,0) 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const FeaturesTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.8rem;
    color: #ffc62d;
    font-weight: 500;
  }
`;

const FeaturesGrid = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 800px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    height: 700px;
  }

  @media (max-width: 768px) {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const CenterImage = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: rgba(42, 42, 42, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 198, 45, 0.3);
  box-shadow: 
    0 0 50px rgba(255, 198, 45, 0.1),
    inset 0 0 20px rgba(255, 198, 45, 0.05);
  z-index: 2;
  
  img {
    width: 80%;
    height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const FeatureCard = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  width: 280px;
  height: 184px;
  position: absolute;
  animation: float 6s ease-in-out infinite;

  /* Card 1: INSTANT ACCESS - 12 o'clock position
   * Controls:
   * - Decrease 'top' percentage to move card up
   * - Increase 'top' percentage to move card down
   * - Card is centered horizontally by 'left' and transform
   */
  &:nth-child(2) {
    top: 14%;
    right: 20%;
    animation-delay: 1s;
  }

  /* Card 2: TRADING ENVIRONMENT - 2 o'clock position
   * Controls:
   * - Decrease 'top' percentage to move card up
   * - Increase 'top' percentage to move card down
   * - Decrease 'right' percentage to move card outward
   * - Increase 'right' percentage to move card inward
   */
  &:nth-child(3) {
    top: 11%;
    right: 47%;
    animation-delay: 1s;
  }

  /* Card 3: PERSONALIZED DASHBOARD - 4 o'clock position
   * Controls:
   * - Decrease 'top' percentage to move card up
   * - Increase 'top' percentage to move card down
   * - Decrease 'right' percentage to move card outward
   * - Increase 'right' percentage to move card inward
   */
  &:nth-child(4) {
    top: 40%;
    right: 15%;
    animation-delay: 2s;
  }

  /* Card 4: 24/7 SUPPORT - 6 o'clock position
   * Controls:
   * - Decrease 'bottom' percentage to move card down
   * - Increase 'bottom' percentage to move card up
   * - Card is centered horizontally by 'left: 50%' and transform
   */
  &:nth-child(5) {
    bottom: 12%;
    left: 43%;
    transform: translateX(-50%);
    animation-delay: 3s;
  }

  /* Card 5: LEVERAGE OPPORTUNITIES - 8 o'clock position
   * Controls:
   * - Decrease 'top' percentage to move card up
   * - Increase 'top' percentage to move card down
   * - Decrease 'left' percentage to move card outward
   * - Increase 'left' percentage to move card inward
   */
  &:nth-child(6) {
    top: 62%;
    left: 18%;
    animation-delay: 4s;
  }

  /* Card 6: TRADING NETWORK - 10 o'clock position
   * Controls:
   * - Decrease 'top' percentage to move card up
   * - Increase 'top' percentage to move card down
   * - Decrease 'left' percentage to move card outward
   * - Increase 'left' percentage to move card inward
   */
  &:nth-child(7) {
    top: 36%;
    left: 14%;
    animation-delay: 5s;
  }
  
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: auto;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    animation: none !important;
    margin-bottom: 1rem;
  }

  @keyframes float {
    0% { transform: translate(0, 0); }
    50% { transform: translate(0, -8px); }
    100% { transform: translate(0, 0); }
  }
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 198, 45, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: #ffc62d;
  font-size: 1rem;
`;

const FeatureTitle = styled.h4`
  color: #ffc62d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #999;
  line-height: 1.4;
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
`;

const FooterTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffc62d;
  }
`;

const ExternalLink = styled.a`
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffc62d;
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: white;
  margin-top: 1rem;
`;

const FAQSection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #222 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(0deg, transparent 0%, #222 100%);
  }
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0 0.5rem;
  }
`;

const FAQCard = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
  width: 100%;

  &:hover {
    background: rgba(42, 42, 42, 0.8);
    border-color: rgba(255, 198, 45, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffc62d;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: ${props => props.isOpen ? '0.5rem' : '0'};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const FAQAnswer = styled.div`
  color: #999;
  font-size: 0.75rem;
  line-height: 1.4;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.isOpen ? '0.5rem' : '0'};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 14rem); // Account for padding
    justify-content: space-between;
  }
`;

const HeaderWrapper = styled.div`
  @media (max-width: 768px) {
    order: 1;
    width: 100%;
    margin-bottom: 2rem;
  }
`;

const GlobeSection = styled.div`
  @media (max-width: 768px) {
    order: 2;
    width: 100%;
    margin: 0 0 2rem;
  }
`;

const ContentWrapper = styled.div`
  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;
    min-height: 200px; // Add minimum height to ensure content fits
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    align-items: center;
  }
`;

const PopupContent = styled.div`
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  max-width: 520px;
  width: 90%;
  border: 1px solid #555;
  box-shadow: 
    0 0 50px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.02);
  animation: popupFloat 0.5s ease-out;
  
  @keyframes popupFloat {
    0% {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    width: 95%;
  }
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ccc;
    transform: rotate(90deg);
  }
`;

const PopupTitle = styled.h2`
  color: #ccc;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PopupDescription = styled.p`
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DiscountCode = styled.div`
  background: rgba(50, 50, 50, 0.4);
  border: 2px dashed #666;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 1.5rem 0;
  
  span {
    color: #ccc;
    font-size: 1.8rem;
    font-weight: bold;
    letter-spacing: 2px;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const PopupHighlights = styled.div`
  background: rgba(50, 50, 50, 0.4);
  border: 1px solid #555;
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HighlightTitle = styled.h3`
  color: #ccc;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: white;
  font-size: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    gap: 0.5rem;
  }
`;

const HighlightIcon = styled.span`
  color: #ffc62d;
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    min-width: 20px;
  }
`;

const PopupButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  font-size: 1.1rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.75rem;
  }
`;

const ReviewsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #222 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  margin-top: -4rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(0deg, transparent 0%, #222 100%);
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const ReviewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const ReviewsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const ReviewsTitle = styled.h2`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ReviewsSubtitle = styled.p`
  color: #999;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ReviewsScroll = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  position: relative;
  scroll-snap-type: x mandatory;
  padding-bottom: 2rem;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ReviewCard = styled.div`
  background: linear-gradient(145deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  min-width: 280px;
  width: 280px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 198, 45, 0.3);
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.2),
      0 0 15px rgba(255, 198, 45, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, rgba(42, 42, 42, 0.3) 0%, transparent 100%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
    height: 280px;
    padding: 1.5rem;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReviewStars = styled(Stars)`
  margin-bottom: 0.5rem;
`;

const ReviewDate = styled.span`
  color: #666;
  font-size: 0.8rem;
`;

const ReviewContent = styled.div`
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.6;
  flex-grow: 1;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
  
  p {
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: ${props => props.expanded ? 'none' : '4'};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: #ffc62d;
  font-size: 0.8rem;
  padding: 0;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: #ffdb70;
  }
`;

const ReviewAuthor = styled.div`
  color: #ffc62d;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: rgba(255, 198, 45, 0.3);
    border-radius: 1px;
  }
`;

const LandingPage = () => {
  const [selectedBalance, setSelectedBalance] = useState(50000);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [hasTableScroll, setHasTableScroll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const tableRef = useRef(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  const calculateValues = (balance) => ({
    maxDailyLoss: balance * 0.10,
    maxLoss: balance * 0.15,
    profitTargetStep1: balance * 0.10,
    profitTargetStep2: balance * 0.05,
    oneTimePrice: balance === 10000 ? 99 : 
                  balance === 25000 ? 249 : 
                  balance === 50000 ? 399 : 
                  balance === 100000 ? 599 : 1199
  });

  const values = calculateValues(selectedBalance);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current) {
        const hasScroll = tableRef.current.scrollWidth > tableRef.current.clientWidth;
        setHasTableScroll(hasScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
      const yOffset = -80; // Offset to account for any fixed headers
      const y = reviewsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const reviews = [
    {
      rating: 5,
      content: "Best prop firm I've worked with! The fast-track verification is a game-changer, and their support team responds within minutes. Already scaled to a $200k account!",
      author: "Michael R.",
      daysAgo: 1
    },
    {
      rating: 5,
      content: "Withdrawals are processed lightning fast - usually within 24 hours. Their platform is super stable, and the scaling program is very achievable.",
      author: "Sarah T.",
      daysAgo: 3
    },
    {
      rating: 4,
      content: "Really impressed with their customer service. Had a few questions about the challenge rules and got clear answers right away. The trading conditions are excellent too.",
      author: "James K.",
      daysAgo: 5
    },
    {
      rating: 5,
      content: "Finally found a prop firm that understands traders' needs. No hidden rules, straightforward objectives, and the refundable fee is a great touch!",
      author: "Emma P.",
      daysAgo: 8
    },
    {
      rating: 5,
      content: "Just got funded after passing both phases. The whole process was smooth, and their support team guided me through every step. Highly recommend!",
      author: "David L.",
      daysAgo: 12
    },
    {
      rating: 4,
      content: "The platform is incredibly user-friendly, and the trading conditions are some of the best in the industry. Love the 1:200 leverage option.",
      author: "Alex M.",
      daysAgo: 15
    },
    {
      rating: 5,
      content: "Three months in, and I couldn't be happier. Consistent payouts, great communication, and the scaling plan is very motivating.",
      author: "Rachel W.",
      daysAgo: 25
    },
    {
      rating: 5,
      content: "Their support during volatile market conditions is outstanding. They actually care about their traders' success. Plus, the fees are very competitive.",
      author: "Thomas H.",
      daysAgo: 32
    },
    {
      rating: 4,
      content: "The challenge rules are fair and achievable. What I appreciate most is their transparency - everything is clearly explained from the start.",
      author: "Lisa B.",
      daysAgo: 45
    },
    {
      rating: 5,
      content: "Started with a $50k challenge and now managing $200k. The scaling opportunities are real, and their risk management rules actually help you become a better trader.",
      author: "Mark S.",
      daysAgo: 58
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star key={index} filled={index < rating}>
        ★
      </Star>
    ));
  };

  const toggleReviewExpansion = (index) => {
    setExpandedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <PageWrapper>
      <GlobalStyle />
      
      {/* Add Popup */}
      <PopupOverlay isVisible={showPopup}>
        <PopupContent>
          <PopupCloseButton onClick={() => setShowPopup(false)}>×</PopupCloseButton>
          <PopupTitle>Valentine's Day Sale</PopupTitle>
          <PopupDescription>
            Limited time offer: Get 40% off all trading challenges with the highest drawdown limits in the industry.
          </PopupDescription>
          
          <PopupHighlights>
            <HighlightTitle>Industry-Leading Terms</HighlightTitle>
            <HighlightItem>
              <HighlightIcon>✓</HighlightIcon>
              <span><strong>15% Maximum Drawdown</strong> - Highest in the industry</span>
            </HighlightItem>
            <HighlightItem>
              <HighlightIcon>✓</HighlightIcon>
              <span><strong>10% Daily Drawdown</strong> - More trading flexibility</span>
            </HighlightItem>
            <HighlightItem>
              <HighlightIcon>✓</HighlightIcon>
              <span><strong>1:200 Leverage</strong> - Maximize your potential</span>
            </HighlightItem>
          </PopupHighlights>

          <DiscountCode>
            <p style={{ color: '#999', marginBottom: '0.5rem' }}>Use Code</p>
            <span>VDAY40</span>
          </DiscountCode>
          <PopupButton to="/auth?mode=signup" onClick={() => setShowPopup(false)}>
            CLAIM YOUR DISCOUNT NOW
          </PopupButton>
        </PopupContent>
      </PopupOverlay>

      <Navigation>
        <Logo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading Challenge" 
        />
        <NavRight>
          <NavLinks>
            <NavLink href="#process">How It Works</NavLink>
            <NavLink href="#accounts">Account Types</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </NavLinks>
          <Button to="/auth?mode=login" variant="outline" size="small">LOGIN</Button>
          <Button to="/auth?mode=signup" size="small">GET FUNDED</Button>
          <MobileNav />
        </NavRight>
      </Navigation>
      
      <HeroSection>
        <Particles>
          {[...Array(20)].map((_, i) => (
            <Particle key={i} />
          ))}
        </Particles>

        {/* Shooting Stars Effect */}
        <ShootingStarsContainer>
          {/* Shooting Star 1 */}
          <ShootingStar top={5} right={0} duration={2} delay={0} />
          <SplatParticle splatTop={35} splatRight={30} duration={2} delay={0} particleX={-30} particleY={20} />
          <SplatParticle splatTop={35} splatRight={30} duration={2} delay={0} particleX={20} particleY={30} />
          <SplatParticle splatTop={35} splatRight={30} duration={2} delay={0} particleX={10} particleY={-20} />
          <SplatParticle splatTop={35} splatRight={30} duration={2} delay={0} particleX={-15} particleY={-15} />
          
          {/* Shooting Star 2 */}
          <ShootingStar top={15} right={5} duration={2.5} delay={1.5} />
          <SplatParticle splatTop={48} splatRight={35} duration={2.5} delay={1.5} particleX={-25} particleY={25} />
          <SplatParticle splatTop={48} splatRight={35} duration={2.5} delay={1.5} particleX={25} particleY={20} />
          <SplatParticle splatTop={48} splatRight={35} duration={2.5} delay={1.5} particleX={15} particleY={-25} />
          <SplatParticle splatTop={48} splatRight={35} duration={2.5} delay={1.5} particleX={-20} particleY={-10} />
          
          {/* Shooting Star 3 */}
          <ShootingStar top={8} right={10} duration={2.2} delay={3} />
          <SplatParticle splatTop={38} splatRight={40} duration={2.2} delay={3} particleX={-28} particleY={22} />
          <SplatParticle splatTop={38} splatRight={40} duration={2.2} delay={3} particleX={22} particleY={28} />
          <SplatParticle splatTop={38} splatRight={40} duration={2.2} delay={3} particleX={12} particleY={-22} />
          <SplatParticle splatTop={38} splatRight={40} duration={2.2} delay={3} particleX={-18} particleY={-12} />
          
          {/* Shooting Star 4 */}
          <ShootingStar top={20} right={2} duration={2.3} delay={4.5} />
          <SplatParticle splatTop={52} splatRight={32} duration={2.3} delay={4.5} particleX={-26} particleY={24} />
          <SplatParticle splatTop={52} splatRight={32} duration={2.3} delay={4.5} particleX={24} particleY={26} />
          <SplatParticle splatTop={52} splatRight={32} duration={2.3} delay={4.5} particleX={14} particleY={-24} />
          <SplatParticle splatTop={52} splatRight={32} duration={2.3} delay={4.5} particleX={-16} particleY={-14} />
        </ShootingStarsContainer>

        {/* Desktop Layout */}
        <HeroContainer>
          <HeroContent>
            <MainHeading>
              We fund traders.
              <span>Ascend to new heights.</span>
            </MainHeading>
            <SubHeading>
              Become part of the most rapidly expanding prop trading firm, grow your capital to $4,000,000, and utilize advanced technology to enhance your trading success.
            </SubHeading>
            <Button to="/auth?mode=signup" size="large">
              GET FUNDED TODAY
            </Button>
            <StarRating onClick={scrollToReviews}>
              <Stars>
                {renderStars(4.6)}
              </Stars>
              <RatingText>4.6/5 from 236 reviews</RatingText>
            </StarRating>
          </HeroContent>
          
          <HeroRight>
            <GlobeWrapper>
              <Globe />
            </GlobeWrapper>
            <StatCardContainer>
              <StatCard>
                <h3>$12,400,000+</h3>
                <p>Total Funding</p>
              </StatCard>
              <StatCard>
                <h3>$1,000+</h3>
                <p>Active Traders</p>
              </StatCard>
            </StatCardContainer>
          </HeroRight>
        </HeroContainer>

        {/* Mobile Layout */}
        <MobileWrapper>
          <HeaderWrapper>
            <MainHeading>
              We fund traders.
              <span>Ascend to new heights.</span>
            </MainHeading>
          </HeaderWrapper>

          <GlobeSection>
            <HeroRight>
              <GlobeWrapper>
                <Globe />
              </GlobeWrapper>
              <StatCardContainer>
                <StatCard>
                  <h3>$12,400,000+</h3>
                  <p>Total Funding</p>
                </StatCard>
                <StatCard>
                  <h3>$1,000+</h3>
                  <p>Active Traders</p>
                </StatCard>
              </StatCardContainer>
            </HeroRight>
          </GlobeSection>

          <ContentWrapper>
            <SubHeading>
              Become part of the most rapidly expanding prop trading firm, grow your capital to $4,000,000, and utilize advanced technology to enhance your trading success.
            </SubHeading>
            <Button to="/auth?mode=signup" size="large">
              GET FUNDED TODAY
            </Button>
            <StarRating onClick={scrollToReviews}>
              <Stars>
                {renderStars(4.6)}
              </Stars>
              <RatingText>4.6/5 from 236 reviews</RatingText>
            </StarRating>
          </ContentWrapper>
        </MobileWrapper>
      </HeroSection>
      
      <ProcessSection id="process">
        <Container>
          <SectionTitle>Evaluation Process</SectionTitle>
          <EvaluationCards>
            <Card className="evaluation-card">
              <h2>EVALUATION PROCESS</h2>
              <DemoBadge>DEMO</DemoBadge>
              <Steps>
                <Step>
                  <h3>STEP 1</h3>
                  <h4>ACI CHALLENGE</h4>
                  <p>
                    Traders demonstrate their experience during the ACI Challenge by following our Trading Objectives inspired by key risk management rules. After completing an ACI Challenge traders move on to the verification step.
                  </p>
                </Step>
                <Step>
                  <h3>STEP 2</h3>
                  <h4>VERIFICATION</h4>
                  <p>
                    The verification step verifies the skills traders demonstrated in the ACI Challenge. The Trading Objectives are simplified and easier to achieve. Upon passing it, traders get access to an ACI Traders Account.
                  </p>
                </Step>
              </Steps>
            </Card>

            <Card className="trader-card">
              <h2>ACI TRADERS ACCOUNT</h2>
              <DemoBadge monetized>MONETIZED DEMO</DemoBadge>
              <Step>
                <h3>STEP 3</h3>
                <h4>ACI TRADER</h4>
                <p>
                  Advancing to another step demonstrates commitment and talent, leading to an ACI Traders Account with fictitious funds of up to $4,000,000 in a demo environment. Despite being a demo, it'll increase your reward of up to 95% of simulated profits without risking their own capital.
                </p>
              </Step>
              <AccountDetails>
                <h4>ACI TRADER ACCOUNT</h4>
                <ul>
                  <li>ACI Traders Account with fictitious funds up to $4,000,000</li>
                  <li>Reward of up to 95% of simulated profits</li>
                </ul>
              </AccountDetails>
            </Card>
          </EvaluationCards>
        </Container>
      </ProcessSection>
      
      <ChallengeSection id="accounts">
        <div style={{transform: 'scale(0.85)', transformOrigin: 'top center'}}>
          <SectionTitle>Choose Your Account Size</SectionTitle>
          <BalanceSection>
            {[10000, 25000, 50000, 100000, 200000].map(balance => (
              <BalanceButton
                key={balance}
                selected={balance === selectedBalance}
                onClick={() => setSelectedBalance(balance)}
              >
                ${balance.toLocaleString()}
              </BalanceButton>
            ))}
          </BalanceSection>

          <Table ref={tableRef} hasScroll={hasTableScroll}>
            <TableHeader>
              <div></div>
              <div>ACI CHALLENGE</div>
              <div>VERIFICATION</div>
              <div>ACI TRADER</div>
            </TableHeader>

            <TableRow>
              <div>Trading Period</div>
              <div>Unlimited</div>
              <div>Unlimited</div>
              <div>Unlimited</div>
            </TableRow>

            <TableRow>
              <div>Minimum Profitable Days</div>
              <div>4 Days</div>
              <div>4 Days</div>
              <div>X</div>
            </TableRow>

            <TableRow>
              <div>Maximum Daily Loss</div>
              <div>${values.maxDailyLoss.toLocaleString()} (10%)</div>
              <div>${values.maxDailyLoss.toLocaleString()} (10%)</div>
              <div>${values.maxDailyLoss.toLocaleString()} (10%)</div>
            </TableRow>

            <TableRow>
              <div>Maximum Loss</div>
              <div>${values.maxLoss.toLocaleString()} (15%)</div>
              <div>${values.maxLoss.toLocaleString()} (15%)</div>
              <div>${values.maxLoss.toLocaleString()} (15%)</div>
            </TableRow>

            <TableRow>
              <div>Profit Target</div>
              <div>${values.profitTargetStep1.toLocaleString()} (10%)</div>
              <div>${values.profitTargetStep2.toLocaleString()} (5%)</div>
              <div>X</div>
            </TableRow>

            <TableRow>
              <div>Leverage</div>
              <div>1:200</div>
              <div>1:200</div>
              <div>1:200</div>
            </TableRow>

            <TableRow>
              <div>One-Time Price</div>
              <HighlightedCell>${values.oneTimePrice}</HighlightedCell>
              <div>-</div>
              <div>-</div>
            </TableRow>

             <TableRow>
              <div>Refund</div>
              <div>-</div>
              <div>-</div>
              <HighlightedCell>Yes 100%</HighlightedCell>
            </TableRow>
          </Table>

          <PromotionBanner>
            ACI Traders qualify for our <a href="/once-funded-stay-funded">Once Funded Stay Funded Program!</a>
          </PromotionBanner>

          <StartButton to="/auth?mode=signup">
            START ACI CHALLENGE
          </StartButton>
        </div>
      </ChallengeSection>

      <FeaturesSection id="features">
        <Container>
          <FeaturesTitle>
            <h2>THE PIONEER DIFFERENCE</h2>
            <h3>INNOVATIVE FEATURES, EXCEPTIONAL RESULTS</h3>
          </FeaturesTitle>
          
          <FeaturesGrid>
            <CenterImage>
              <img 
                src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
                alt="ACI Trading Challenge" 
              />
            </CenterImage>
            
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>INSTANT ACCESS</FeatureTitle>
              <FeatureDescription>
                Once you complete a challenge, you'll receive immediate access to your account, allowing you to start trading right away with our industry-leading conditions.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>TRADING ENVIRONMENT</FeatureTitle>
              <FeatureDescription>
                Trade with state-of-the-art access to Forex pairs, stocks, indices, and commodities, all with competitive low commissions and tight spreads.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>PERSONALIZED DASHBOARD</FeatureTitle>
              <FeatureDescription>
                Track your progress and performance easily with a custom dashboard that shows your key metrics, making it simple to see where you stand at any point.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🔄</FeatureIcon>
              <FeatureTitle>24/7 SUPPORT</FeatureTitle>
              <FeatureDescription>
                Our dedicated support team is at your service 24/7, ready to assist with any inquiries or issues, anytime and on any day.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📈</FeatureIcon>
              <FeatureTitle>LEVERAGE OPPORTUNITIES</FeatureTitle>
              <FeatureDescription>
                Maximize your trading with a leverage of 1:200, providing significant market exposure without restrictions on position sizes.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🌐</FeatureIcon>
              <FeatureTitle>TRADING NETWORK</FeatureTitle>
              <FeatureDescription>
                Exclusive access to the unique ecosystem of profitable traders, join a supportive and engaged community led by our seven-figure trader Penny Pips.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
      
      <FAQSection id="faq">
        <Container>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FAQGrid>
            <FAQCard onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}>
              <FAQQuestion isOpen={openFAQ === 1}>
                Why Should I join ACI Trading?
                <span>{openFAQ === 1 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 1}>
                Join ACI Trading to access professional trading capital up to $4,000,000, benefit from our cutting-edge technology, and become part of an elite trading community. We offer competitive profit splits and comprehensive support to help you succeed.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}>
              <FAQQuestion isOpen={openFAQ === 2}>
                When do I need to pass KYC?
                <span>{openFAQ === 2 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 2}>
                KYC verification is required only after successfully passing both the Challenge and Verification phases. This ensures a smooth onboarding process and maintains the integrity of our trading program.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}>
              <FAQQuestion isOpen={openFAQ === 3}>
                Do you have any country restrictions?
                <span>{openFAQ === 3 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 3}>
                We welcome traders from all countries worldwide.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}>
              <FAQQuestion isOpen={openFAQ === 4}>
                Is there an inactivity period for my accounts?
                <span>{openFAQ === 4 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 4}>
                Yes, your account will be closed after 30 days of inactivity this goes for funded accounts and challenge accounts.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 5 ? null : 5)}>
              <FAQQuestion isOpen={openFAQ === 5}>
                Do you have a scaling plan?
                <span>{openFAQ === 5 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 5}>
                Yes, we offer a comprehensive scaling plan that allows successful traders to increase their trading capital up to $4,000,000. The plan is based on consistent performance and adherence to our trading rules.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 6 ? null : 6)}>
              <FAQQuestion isOpen={openFAQ === 6}>
                How old do I have to be to be a funded trader?
                <span>{openFAQ === 6 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 6}>
                You must be at least 18 years old to participate in our funded trader program. This requirement ensures compliance with financial regulations and maintains the professional standard of our trading community.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 7 ? null : 7)}>
              <FAQQuestion isOpen={openFAQ === 7}>
                What is the minimum payout?
                <span>{openFAQ === 7 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 7}>
                We do not have a minimum payout.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 8 ? null : 8)}>
              <FAQQuestion isOpen={openFAQ === 8}>
                Can I use a copy trader?
                <span>{openFAQ === 8 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 8}>
                No, copy trading is not permitted. We value authentic trading skills and require all trades to be executed independently by our traders.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 9 ? null : 9)}>
              <FAQQuestion isOpen={openFAQ === 9}>
                How do I request a payout?
                <span>{openFAQ === 9 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 9}>
                Payouts can be requested through your dashboard once you've met the minimum profit requirements. Our team processes payout requests promptly to ensure quick access to your earnings.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 10 ? null : 10)}>
              <FAQQuestion isOpen={openFAQ === 10}>
                When am I eligible for a withdrawal?
                <span>{openFAQ === 10 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 10}>
                You become eligible for withdrawals after successfully completing the challenge phase and meeting our profit targets. Withdrawals can be processed once you've accumulated profits on your funding account while ensuring to adhear to our ACI Traders Agreement and challenge account rules.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 11 ? null : 11)}>
              <FAQQuestion isOpen={openFAQ === 11}>
                What are your payout methods?
                <span>{openFAQ === 11 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 11}>
                We offer multiple payout methods including bank transfers, crypto payments, and other popular payment platforms to ensure convenient access to your funds.
              </FAQAnswer>
            </FAQCard>

            <FAQCard onClick={() => setOpenFAQ(openFAQ === 12 ? null : 12)}>
              <FAQQuestion isOpen={openFAQ === 12}>
                When does the challenge officially start?
                <span>{openFAQ === 12 ? '−' : '+'}</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === 12}>
                Your challenge begins as soon as you receive your login credentials.
              </FAQAnswer>
            </FAQCard>
          </FAQGrid>
          <FAQButton to="/auth?mode=signup" size="large">
            EARN FUNDING
          </FAQButton>
        </Container>
      </FAQSection>

      <ReviewsSection id="reviews">
        <ReviewsContainer>
          <ReviewsHeader>
            <ReviewsTitle>Trusted by Traders Worldwide</ReviewsTitle>
            <ReviewsSubtitle>Join hundreds of successful funded traders</ReviewsSubtitle>
          </ReviewsHeader>
          <ReviewsScroll>
            {reviews.map((review, index) => (
              <ReviewCard key={index}>
                <ReviewHeader>
                  <div>
                    <ReviewStars>
                      {renderStars(review.rating)}
                    </ReviewStars>
                    <ReviewDate>{review.daysAgo} {review.daysAgo === 1 ? 'day' : 'days'} ago</ReviewDate>
                  </div>
                </ReviewHeader>
                <ReviewContent expanded={expandedReviews[index]}>
                  <p>{review.content}</p>
                  {review.content.length > 180 && (
                    <ReadMoreButton onClick={() => toggleReviewExpansion(index)}>
                      {expandedReviews[index] ? 'Show less' : 'Read more'}
                    </ReadMoreButton>
                  )}
                </ReviewContent>
                <ReviewAuthor>{review.author}</ReviewAuthor>
              </ReviewCard>
            ))}
          </ReviewsScroll>
        </ReviewsContainer>
      </ReviewsSection>
      
      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/auth?mode=signup">Start Challenge</FooterLink>
            <FooterLink to="/auth?mode=login">Login</FooterLink>
            <FooterLink to="/auth?mode=signup">Sign Up</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <ExternalLink href="#faq">FAQ</ExternalLink>
            <ExternalLink href="#terms">Terms & Conditions</ExternalLink>
            <ExternalLink href="#privacy">Privacy Policy</ExternalLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <ExternalLink href="mailto:support@acitrading.ca">
              support@acitrading.ca
            </ExternalLink>
          </FooterSection>
        </FooterContent>
        
        <Copyright>
          © {new Date().getFullYear()} ACI Trading Challenge. All rights reserved.
        </Copyright>
      </Footer>
    </PageWrapper>
  );
};

export default LandingPage; 