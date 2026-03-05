import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <Container $isDark={isDark}>
      <Stars $isDark={isDark} />

      <Title $isDark={isDark}>404</Title>
      <Subtitle $isDark={isDark}>Stream Not Found!</Subtitle>

      <HomeLink to="/" $isDark={isDark}>
        Back to Stream
      </HomeLink>
    </Container>
  );
};

// ─── Animations ─────────────────────────────────────────────────────────────
const glitch = keyframes`
  0%   { text-shadow: 2px 0 red; }
  20%  { text-shadow: -2px 0 cyan; }
  40%  { text-shadow: 2px 2px magenta; }
  60%  { text-shadow: -2px -2px yellow; }
  80%  { text-shadow: 2px 0 green; }
  100% { text-shadow: 0 0 10px #8A2BE2; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const moveStars = keyframes`
  from { background-position: 0 0; }
  to   { background-position: 10000px 10000px; }
`;

// ─── Styled Components avec thème dynamique ────────────────────────────────
const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${({ $isDark }) => $isDark 
    ? 'radial-gradient(circle at 30% 20%, #1a0a3a, #0a001a)' 
    : 'radial-gradient(circle at 30% 20%, #f0e6ff, #e0d7ff)'};
  color: ${({ $isDark }) => $isDark ? '#E6E6FA' : '#2E0854'};
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(${({ $isDark }) => $isDark ? 'white' : '#4B0082'} 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: ${({ $isDark }) => $isDark ? '0.05' : '0.08'};
  z-index: 0;
  animation: ${moveStars} 100s linear infinite;
`;

const Title = styled.h1`
  font-size: 96px;
  color: ${({ $isDark }) => $isDark ? '#DA70D6' : '#8A2BE2'};
  animation: ${glitch} 1s infinite;
  z-index: 1;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 28px;
  margin: 20px 0;
  animation: ${fadeIn} 1s ease;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#6d28d9'};
  z-index: 1;
`;

const HomeLink = styled(Link)`
  padding: 15px 40px;
  background: transparent;
  border: 2px solid ${({ $isDark }) => $isDark ? '#8A2BE2' : '#6d28d9'};
  color: ${({ $isDark }) => $isDark ? '#E6E6FA' : '#2E0854'};
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 20px;
  animation: ${fadeIn} 1.5s ease;
  transition: all 0.3s ease;
  z-index: 1;
  &:hover {
    background: ${({ $isDark }) => $isDark ? '#8A2BE2' : '#6d28d9'};
    color: ${({ $isDark }) => $isDark ? '#0a001a' : 'white'};
    box-shadow: ${({ $isDark }) => $isDark 
      ? '0 0 15px #DA70D6' 
      : '0 0 15px rgba(109,40,217,0.5)'};
  }
`;

export default NotFound;