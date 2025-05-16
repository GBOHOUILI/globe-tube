import React, { useState } from "react"; 
import styled, { keyframes } from "styled-components";
import GlobeTube from "../img/logo.png";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SubscriptionsRoundedIcon from "@mui/icons-material/SubscriptionsRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import TheatersRoundedIcon from "@mui/icons-material/TheatersRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import StreamRoundedIcon from "@mui/icons-material/StreamRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Thème violet
const theme = {
  primaryColor: "#8A2BE2", // Blueviolet
  secondaryColor: "#9370DB", // Medium Purple
  accentColor: "#BA55D3", // Medium orchid
  lightColor: "#F5F0FF", // Lavender très léger
  darkColor: "#4B0082", // Indigo
  textColor: "#2E0854", // Dark violet
  gradient: "linear-gradient(135deg, #8A2BE2, #4B0082)",
};

// Animations
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(138, 43, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowEffect = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
  }
  50% {
    text-shadow: 0 0 15px rgba(138, 43, 226, 0.8), 0 0 20px rgba(147, 112, 219, 0.5);
  }
  100% {
    text-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
  }
`;

const Container = styled.div`
  flex: 1;
  background: linear-gradient(to bottom, #f8f4ff, #f1f1f1);
  height: 100%;
  color: ${theme.textColor};
  font-size: 16px;
  position: sticky;
  top: 0;
  padding: 10px;
  border-right: 1px solid rgba(138, 43, 226, 0.2);
  box-shadow: 5px 0 15px rgba(138, 43, 226, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 5px 0 20px rgba(138, 43, 226, 0.2);
  }
`;

const Wrapper = styled.div`
  padding: 18px 26px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 25px;
  animation: ${float} 3s ease-in-out infinite;
  color: ${theme.primaryColor};
  font-size: 24px;
  letter-spacing: 0.5px;
  
  &:hover {
    animation: ${glowEffect} 1.5s infinite;
  }
`;

const Img = styled.img`
  height: 30px;
  filter: drop-shadow(0 0 5px rgba(138, 43, 226, 0.5));
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(15deg);
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 5px;
  position: relative;
  overflow: hidden;
  
  svg {
    color: ${theme.secondaryColor};
    transition: all 0.3s ease;
    font-size: 22px;
  }
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background: ${theme.gradient};
    transition: width 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(138, 43, 226, 0.08);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.15);
    
    svg {
      color: ${theme.primaryColor};
      transform: scale(1.2);
    }
    
    &:before {
      width: 100%;
    }
  }
  
  &.active {
    background-color: rgba(138, 43, 226, 0.15);
    font-weight: bold;
    
    svg {
      color: ${theme.primaryColor};
    }
  }
`;

const Hr = styled.hr`
  margin: 20px 0px;
  border: none;
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(138, 43, 226, 0), 
    rgba(138, 43, 226, 0.6), 
    rgba(138, 43, 226, 0));
`;

const Login = styled.div`
  color: ${theme.textColor};
  font-size: 14px;
  line-height: 1.4;
  background-color: rgba(138, 43, 226, 0.05);
  padding: 15px;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(138, 43, 226, 0.1);
  animation: ${fadeIn} 1s ease-out;
`;

const Button = styled.button`
  padding: 10px 22px;
  background: ${props => props.transparent ? "transparent" : theme.gradient};
  border: ${props => props.transparent ? `2px solid ${theme.primaryColor}` : "none"};
  color: ${props => props.transparent ? theme.primaryColor : "white"};
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  margin-top: 15px;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;
  box-shadow: ${props => props.transparent ? 
    `0 3px 10px rgba(138, 43, 226, 0.1)` : 
    `0 5px 15px rgba(138, 43, 226, 0.3)`};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.transparent ? 
      `0 8px 20px rgba(138, 43, 226, 0.2)` : 
      `0 10px 25px rgba(138, 43, 226, 0.4)`};
    background: ${props => props.transparent ? 
      `${theme.primaryColor}15` : 
      `linear-gradient(135deg, ${theme.accentColor}, ${theme.darkColor})`};
    letter-spacing: 0.5px;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  svg {
    font-size: 18px;
  }
`;

const Title = styled.h2`
  font-size: 13px;
  font-weight: 500;
  color: ${theme.secondaryColor};
  margin-bottom: 15px;
  position: relative;
  padding-bottom: 5px;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: ${theme.gradient};
    border-radius: 2px;
  }
`;

const CategorySection = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const Menu = () => {
  const [activeItem, setActiveItem] = useState("Home");
  
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };
  const { currentUser } = useSelector((state) => state.user)
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={GlobeTube} />
            GlobeTube
          </Logo>
        </Link>
        
        <CategorySection>
          <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
            <Item 
              className={activeItem === "Home" ? "active" : ""} 
              onClick={() => handleItemClick("Home")}>
              <HomeRoundedIcon />
              Home
            </Item>
          </Link>

          <Link to="trends" style={{textDecoration:"none", color:"inherit"}}>
            <Item 
            className={activeItem === "Explore" ? "active" : ""} 
            onClick={() => handleItemClick("Explore")}>
            <ExploreRoundedIcon />
            Explore
            </Item>
          </Link>
          
          <Link to="subscriptions" style={{textDecoration:"none", color:"inherit"}}>
            <Item 
            className={activeItem === "Subscriptions" ? "active" : ""} 
            onClick={() => handleItemClick("Subscriptions")}>
            <SubscriptionsRoundedIcon />
            Subscriptions
          </Item>
          </Link>

        </CategorySection>
        
        <Hr />
        
        <CategorySection>
          <Item 
            className={activeItem === "Library" ? "active" : ""} 
            onClick={() => handleItemClick("Library")}
          >
            <VideoLibraryRoundedIcon />
            Library
          </Item>
          <Item 
            className={activeItem === "History" ? "active" : ""} 
            onClick={() => handleItemClick("History")}
          >
            <HistoryRoundedIcon />
            History
          </Item>
        </CategorySection>
        
        <Hr />
        
    {!currentUser && 
      <>
        <Login>
          Sign in to like videos, comment, and subscribe.
          <Link to="signin" style={{textDecoration:"none"}}>
            <Button>
              <PersonRoundedIcon />
              SIGN IN
            </Button>
          </Link>
        </Login>
        
        <Hr />
      </>        
    }
        <Title>Tendances</Title>
        <CategorySection>
          <Item 
            className={activeItem === "Music" ? "active" : ""} 
            onClick={() => handleItemClick("Music")}
          >
            <MusicNoteRoundedIcon />
            Music
          </Item>
          <Item 
            className={activeItem === "Sports" ? "active" : ""} 
            onClick={() => handleItemClick("Sports")}
          >
            <SportsSoccerRoundedIcon />
            Sports
          </Item>
          <Item 
            className={activeItem === "Gaming" ? "active" : ""} 
            onClick={() => handleItemClick("Gaming")}
          >
            <SportsEsportsRoundedIcon />
            Gaming
          </Item>
          <Item 
            className={activeItem === "Movies" ? "active" : ""} 
            onClick={() => handleItemClick("Movies")}
          >
            <TheatersRoundedIcon />
            Movies
          </Item>
          <Item 
            className={activeItem === "News" ? "active" : ""} 
            onClick={() => handleItemClick("News")}
          >
            <FeedRoundedIcon />
            News
          </Item>
          <Item 
            className={activeItem === "Live" ? "active" : ""} 
            onClick={() => handleItemClick("Live")}
          >
            <StreamRoundedIcon />
            Live
          </Item>
        </CategorySection>
        
        <Hr />
        
        <CategorySection>
          <Item 
            className={activeItem === "Settings" ? "active" : ""} 
            onClick={() => handleItemClick("Settings")}
          >
            <SettingsRoundedIcon />
            Settings
          </Item>
          <Item 
            className={activeItem === "Report" ? "active" : ""} 
            onClick={() => handleItemClick("Report")}
          >
            <OutlinedFlagRoundedIcon />
            Report
          </Item>
          <Item 
            className={activeItem === "Help" ? "active" : ""} 
            onClick={() => handleItemClick("Help")}
          >
            <HelpRoundedIcon />
            Help
          </Item>
        </CategorySection>
      </Wrapper>
    </Container>
  );
};

export default Menu;