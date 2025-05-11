import React from "react"; 
import styled from "styled-components";
import { keyframes } from "styled-components";
import GlobeTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Link } from "react-router-dom";


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

const Container = styled.div`
  flex: 1;
  background-color: #f1f1f1;
  height: 100%;
  color: #333;
  font-size: 20px;
  position: sticky;
  top: 0;
  padding: 10px
  margin: 25px
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
`;

const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: #ccc;  /* Couleur de survol */
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid #ccc;
  border-color: rgba(138, 43, 226, 0.6);
`;


const Login = styled.div``;

const Button = styled.button`
  padding: 8px 20px;
  border: none;
  color: ${theme.primaryColor};
  border: ${props => props.transparent ? `2px solid ${theme.primaryColor}` : "none"};
  color: ${props => props.transparent ? theme.primaryColor : "white"};
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  margin-top: 10px;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.transparent ? 
    `0 3px 10px rgba(138, 43, 226, 0.1)` : 
    `0 5px 15px rgba(138, 43, 226, 0.3)`};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.transparent ? 
      `0 5px 15px rgba(138, 43, 226, 0.2)` : 
      `0 8px 20px rgba(138, 43, 226, 0.4)`};
    background: ${props => props.transparent ? 
      `${theme.primaryColor}15` : 
      `linear-gradient(135deg, ${theme.primaryColor}, ${theme.darkColor})`};
  }
  
  svg {
    font-size: 18px;
  }
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;  /* Couleur des titres */
  margin-bottom: 20px;
`;

const Menu = () => {
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={GlobeTube} />
            GlobeTube
          </Logo>
        </Link>
        <Item>
          <HomeIcon />
          Home
        </Item>
        <Item>
          <ExploreOutlinedIcon />
          Explore
        </Item>
        <Item>
          <SubscriptionsOutlinedIcon />
          Subscriptions
        </Item>
        <Hr />
        <Item>
          <VideoLibraryOutlinedIcon />
          Library
        </Item>
        <Item>
          <HistoryOutlinedIcon />
          History
        </Item>
        <Hr />
        <Login>
          Sign in to like videos, comment, and subscribe.
          <Link to="signin" style={{textDecoration:"none"}}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        </Login>
        <Hr />
        <Title>BEST OF GlobeTube</Title>
        <Item>
          <LibraryMusicOutlinedIcon />
          Music
        </Item>
        <Item>
          <SportsBasketballOutlinedIcon />
          Sports
        </Item>
        <Item>
          <SportsEsportsOutlinedIcon />
          Gaming
        </Item>
        <Item>
          <MovieOutlinedIcon />
          Movies
        </Item>
        <Item>
          <ArticleOutlinedIcon />
          News
        </Item>
        <Item>
          <LiveTvOutlinedIcon />
          Live
        </Item>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          Settings
        </Item>
        <Item>
          <FlagOutlinedIcon />
          Report
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          Help
        </Item>

      </Wrapper>
    </Container>
  );
};

export default Menu;
