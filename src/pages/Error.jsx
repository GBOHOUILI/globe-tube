import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% {
    text-shadow: 2px 0 red;
  }
  20% {
    text-shadow: -2px 0 cyan;
  }
  40% {
    text-shadow: 2px 2px magenta;
  }
  60% {
    text-shadow: -2px -2px yellow;
  }
  80% {
    text-shadow: 2px 0 green;
  }
  100% {
    text-shadow: 0 0 10px #8A2BE2;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: radial-gradient(circle at 30% 20%, #1a0a3a, #0a001a);
  color: #E6E6FA;
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 96px;
  color: #DA70D6;
  animation: ${glitch} 1s infinite;
`;

const Subtitle = styled.p`
  font-size: 28px;
  margin: 20px 0;
  animation: ${fadeIn} 1s ease;
`;


const HomeLink = styled(Link)`
  padding: 15px 40px;
  background: transparent;
  border: 2px solid #8A2BE2;
  color: #E6E6FA;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 20px;
  animation: ${fadeIn} 1.5s ease;
  transition: all 0.3s ease;

  &:hover {
    background: #8A2BE2;
    color: #0a001a;
    box-shadow: 0 0 15px #DA70D6;
  }
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(white 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.05;
  z-index: 0;
  animation: moveStars 100s linear infinite;
  
  @keyframes moveStars {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 10000px 10000px;
    }
  }
`;

const NotFound = () => (
  <Container>
    <Stars />
    <Title>404</Title>
    <Subtitle>Stream Not Found!</Subtitle>
    <HomeLink to="/">Back to Stream</HomeLink>
  </Container>
);

export default NotFound;
