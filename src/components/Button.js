import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'large' ? '1rem 2.5rem' : props.size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  font-size: ${props => props.size === 'large' ? '1.2rem' : props.size === 'small' ? '0.875rem' : '1rem'};
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return css`
          background-color: transparent;
          border: 2px solid #ffc62d;
          color: #ffc62d;

          &:hover:not(:disabled) {
            background-color: rgba(255, 198, 45, 0.1);
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid #ffc62d;
          color: white;

          &:hover:not(:disabled) {
            border-color: #ffd65c;
            color: #ffd65c;
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: #ffc62d;
          padding-left: 0;
          padding-right: 0;

          &:hover:not(:disabled) {
            color: white;
          }
        `;
      default:
        return css`
          background-color: #ffc62d;
          color: #1a1a1a;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            background-color: #ffd65c;
          }
        `;
    }
  }}
`;

const StyledButton = styled.button`
  ${baseButtonStyles}
`;

const StyledLink = styled(Link)`
  ${baseButtonStyles}
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  to,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  if (to) {
    return (
      <StyledLink
        to={to}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={onClick}
        {...props}
      >
        {children}
      </StyledLink>
    );
  }

  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 