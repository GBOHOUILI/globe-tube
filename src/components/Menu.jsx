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
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

// ── Import manquant corrigé pour le bouton SIGN IN ──
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

// ── Import du ThemeContext (pour le thème dynamique) ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// Thème violet
const theme = {
  primaryColor: "#8A2BE2",
  secondaryColor: "#9370DB",
  accentColor: "#BA55D3",
  lightColor: "#F5F0FF",
  darkColor: "#4B0082",
  textColor: "#2E0854",
  gradient: "linear-gradient(135deg, #8A2BE2, #4B0082)",
};

// Animations (inchangées)
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(138, 43, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(138, 43, 226, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowEffect = keyframes`
  0% { text-shadow: 0 0 5px rgba(138, 43, 226, 0.5); }
  50% { text-shadow: 0 0 15px rgba(138, 43, 226, 0.8), 0 0 20px rgba(147, 112, 219, 0.5); }
  100% { text-shadow: 0 0 5px rgba(138, 43, 226, 0.5); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const Container = styled.div`
  flex: 1;
  height: 100%;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  font-size: 16px;
  position: sticky;
  top: 0;
  padding: 10px;
  border-right: 1px solid ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.3)" : "rgba(138,43,226,0.2)"};
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? "5px 0 15px rgba(0,0,0,0.6)" 
      : "5px 0 15px rgba(138,43,226,0.1)"};
  background: ${({ $isDark }) => $isDark ? "#0f1117" : "linear-gradient(to bottom, #f8f4ff, #f1f1f1)"};
  transition: all 0.3s ease;
  &:hover {
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? "5px 0 20px rgba(138,43,226,0.35)" 
        : "5px 0 20px rgba(138,43,226,0.2)"};
  }
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    z-index: 1000;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    animation: ${({ isOpen }) => isOpen ? slideIn : ''} 0.3s ease-out;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  position: fixed;
  top: 30px;
  left: 15px;
  z-index: 1001;
  background: linear-gradient(135deg, #8A2BE2, #4B0082);
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(138, 43, 226, 0.3);
  transition: all 0.3s ease;
  svg {
    color: white;
    font-size: 28px;
  }
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4);
  }
  @media (max-width: 768px) {
    display: block;
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
  color: #8A2BE2;
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
  background-color: ${({ active, $isDark }) => 
    active 
      ? $isDark ? "rgba(138,43,226,0.25)" : "rgba(138,43,226,0.15)" 
      : "transparent"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  svg {
    color: ${({ $isDark }) => $isDark ? "#c084fc" : "#9370DB"};
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
    background: linear-gradient(135deg, #8A2BE2, #4B0082);
    transition: width 0.3s ease;
  }
  &:hover {
    background-color: ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.2)" : "rgba(138,43,226,0.08)"};
    transform: translateX(5px);
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? "0 4px 12px rgba(138,43,226,0.3)" 
        : "0 4px 12px rgba(138,43,226,0.15)"};
    svg {
      color: #8A2BE2;
      transform: scale(1.2);
    }
    &:before {
      width: 100%;
    }
  }
  &.active {
    background-color: ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.3)" : "rgba(138,43,226,0.15)"};
    font-weight: bold;
    svg {
      color: #8A2BE2;
    }
  }
`;

const Hr = styled.hr`
  margin: 20px 0px;
  border: none;
  height: 1px;
  background: linear-gradient(90deg,
    ${({ $isDark }) => $isDark ? "rgba(138,43,226,0)" : "rgba(138,43,226,0)"},
    ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.6)" : "rgba(138,43,226,0.6)"},
    ${({ $isDark }) => $isDark ? "rgba(138,43,226,0)" : "rgba(138,43,226,0)"});
`;

const Login = styled.div`
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  font-size: 14px;
  line-height: 1.4;
  background-color: ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.1)" : "rgba(138,43,226,0.05)"};
  padding: 15px;
  border-radius: 12px;
  box-shadow: inset 0 0 10px ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.2)" : "rgba(138,43,226,0.1)"};
  animation: ${fadeIn} 1s ease-out;
`;

const Button = styled.button`
  padding: 10px 22px;
  background: ${({ transparent }) => transparent ? "transparent" : "linear-gradient(135deg, #8A2BE2, #4B0082)"};
  border: ${({ transparent }) => transparent ? `2px solid #8A2BE2` : "none"};
  color: ${({ transparent }) => transparent ? "#8A2BE2" : "white"};
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  margin-top: 15px;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${({ transparent }) => 
    transparent 
      ? `0 3px 10px rgba(138,43,226,0.1)` 
      : `0 5px 15px rgba(138,43,226,0.3)`};
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ transparent }) => 
      transparent 
        ? `0 5px 15px rgba(138,43,226,0.2)` 
        : `0 10px 25px rgba(138,43,226,0.4)`};
    background: ${({ transparent }) => 
      transparent 
        ? `rgba(138,43,226,0.15)` 
        : `linear-gradient(135deg, #4B0082, #8A2BE2)`};
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
  color: #9370DB;
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
    background: linear-gradient(135deg, #8A2BE2, #4B0082);
    border-radius: 2px;
  }
`;

const CategorySection = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

// ─── Composant Menu (sidebar) ──────────────────────────────────────────────
const Menu = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupération du thème global
  const { isDark } = useTheme();

  const currentUser = useSelector((state) => state.user.currentUser);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    navigate('/signin');
    dispatch(logout());
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <HamburgerButton onClick={toggleMenu}>
        <MenuRoundedIcon />
      </HamburgerButton>

      <Container $isDark={isDark} isOpen={isOpen}>
        <Wrapper>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo>
              <Img src={GlobeTube} />
              GlobeTube
            </Logo>
          </Link>

          <CategorySection>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Item
                className={activeItem === "Home" ? "active" : ""}
                onClick={() => handleItemClick("Home")}
                $isDark={isDark}
              >
                <HomeRoundedIcon />
                Home
              </Item>
            </Link>

            <Link to="/trends" style={{ textDecoration: "none", color: "inherit" }}>
              <Item
                className={activeItem === "Explore" ? "active" : ""}
                onClick={() => handleItemClick("Explore")}
                $isDark={isDark}
              >
                <ExploreRoundedIcon />
                Explore
              </Item>
            </Link>

            <Link to="/subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
              <Item
                className={activeItem === "Subscriptions" ? "active" : ""}
                onClick={() => handleItemClick("Subscriptions")}
                $isDark={isDark}
              >
                <SubscriptionsRoundedIcon />
                Subscriptions
              </Item>
            </Link>
          </CategorySection>

          <Hr $isDark={isDark} />

          <CategorySection>
            <Item
              className={activeItem === "Library" ? "active" : ""}
              onClick={() => handleItemClick("Library")}
              $isDark={isDark}
            >
              <VideoLibraryRoundedIcon />
              Library
            </Item>

            <Item
              className={activeItem === "History" ? "active" : ""}
              onClick={() => handleItemClick("History")}
              $isDark={isDark}
            >
              <HistoryRoundedIcon />
              History
            </Item>
          </CategorySection>

          <Hr $isDark={isDark} />

          {currentUser && (
            <>
              <Item
                onClick={handleLogout}
                $isDark={isDark}
                style={{ cursor: "pointer" }}
              >
                <PersonRoundedIcon />
                Log out
              </Item>
              <Hr $isDark={isDark} />
            </>
          )}

          {!currentUser && (
            <>
              <Login $isDark={isDark}>
                Sign in to like videos, comment, and subscribe.
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  <Button transparent>
                    <AccountCircleOutlinedIcon />
                    SIGN IN
                  </Button>
                </Link>
              </Login>
              <Hr $isDark={isDark} />
            </>
          )}

          <Title>Tendances</Title>

          <CategorySection>
            <Item
              className={activeItem === "Music" ? "active" : ""}
              onClick={() => handleItemClick("Music")}
              $isDark={isDark}
            >
              <MusicNoteRoundedIcon />
              Music
            </Item>

            <Item
              className={activeItem === "Sports" ? "active" : ""}
              onClick={() => handleItemClick("Sports")}
              $isDark={isDark}
            >
              <SportsSoccerRoundedIcon />
              Sports
            </Item>

            <Item
              className={activeItem === "Gaming" ? "active" : ""}
              onClick={() => handleItemClick("Gaming")}
              $isDark={isDark}
            >
              <SportsEsportsRoundedIcon />
              Gaming
            </Item>

            <Link to="/movies" style={{ textDecoration: "none", color: "inherit" }}>
              <Item
                className={activeItem === "Movies" ? "active" : ""}
                onClick={() => handleItemClick("Movies")}
                $isDark={isDark}
              >
                <TheatersRoundedIcon />
                Movies
              </Item>
            </Link>

            <Item
              className={activeItem === "News" ? "active" : ""}
              onClick={() => handleItemClick("News")}
              $isDark={isDark}
            >
              <FeedRoundedIcon />
              News
            </Item>

            <Item
              className={activeItem === "Live" ? "active" : ""}
              onClick={() => handleItemClick("Live")}
              $isDark={isDark}
            >
              <StreamRoundedIcon />
              Live
            </Item>
          </CategorySection>

          <Hr $isDark={isDark} />

          <CategorySection>
            <Item
              className={activeItem === "Settings" ? "active" : ""}
              onClick={() => handleItemClick("Settings")}
              $isDark={isDark}
            >
              <SettingsRoundedIcon />
              Settings
            </Item>

            <Item
              className={activeItem === "Report" ? "active" : ""}
              onClick={() => handleItemClick("Report")}
              $isDark={isDark}
            >
              <OutlinedFlagRoundedIcon />
              Report
            </Item>

            <Item
              className={activeItem === "Help" ? "active" : ""}
              onClick={() => handleItemClick("Help")}
              $isDark={isDark}
            >
              <HelpRoundedIcon />
              Help
            </Item>
          </CategorySection>
        </Wrapper>
      </Container>
    </>
  );
};

export default Menu;