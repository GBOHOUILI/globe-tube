import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./UploadVideo";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { width: 40%; }
  to   { width: 50%; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(138, 43, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(138, 43, 226, 0); }
`;

// ─── Styled Components avec couleurs dynamiques selon le thème ─────────────
const Container = styled.div`
  position: sticky;
  top: 0;
  height: 70px;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease forwards;
  background-color: ${({ $isDark }) => $isDark ? "#161b22" : "#ffffff"};
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? "0 4px 20px rgba(0,0,0,0.6)" 
      : "0 4px 20px rgba(138, 43, 226, 0.15)"};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 30px;
  position: relative;
`;

const Search = styled.div`
  width: 50%;
  position: absolute;
  left: -250px;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  border: 2px solid ${({ focused, $isDark }) => 
    focused ? "#8A2BE2" : $isDark ? "rgba(138,43,226,0.3)" : "transparent"};
  border-radius: 30px;
  background-color: ${({ $isDark }) => $isDark ? "#1e2535" : "#F5F0FF"};
  transition: all 0.3s ease;
  box-shadow: ${({ focused, $isDark }) => 
    focused 
      ? `0 0 0 4px #8A2BE230, 0 5px 15px rgba(138,43,226,0.2)` 
      : $isDark 
        ? "0 3px 10px rgba(0,0,0,0.4)" 
        : "0 3px 10px rgba(0,0,0,0.05)"};
  &:hover {
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? "0 5px 15px rgba(138,43,226,0.25)" 
        : "0 5px 15px rgba(138,43,226,0.15)"};
    background-color: ${({ $isDark }) => $isDark ? "#252f3d" : "#f8f5ff"};
  }
  ${({ focused }) => focused && css`
    animation: ${slideIn} 0.3s ease forwards;
  `}
`;

const SearchIconContainer = styled.div`
  color: #8A2BE2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${({ focused }) => focused ? `rgba(138,43,226,0.15)` : "transparent"};
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(138,43,226,0.3);
    transform: scale(1.1);
  }
  svg {
    font-size: 22px;
    transition: all 0.3s ease;
    color: ${({ focused }) => focused ? "#8A2BE2" : "#9370DB"};
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  font-size: 16px;
  width: 100%;
  padding: 8px 15px 8px 0;
  &::placeholder {
    color: ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.7)" : "rgba(46,8,84,0.5)"};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 40%;
  background-color: ${({ $isDark }) => $isDark ? "#1e2535" : "#F5F0FF"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? "0 3px 10px rgba(0,0,0,0.5)" 
      : "0 3px 10px rgba(0,0,0,0.05)"};
  svg {
    font-size: 20px;
    color: ${({ $isDark }) => $isDark ? "#c084fc" : "#4B0082"};
    transition: all 0.2s ease;
  }
  &:hover {
    background-color: rgba(138,43,226,0.15);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(138,43,226,0.25);
    svg {
      color: #8A2BE2;
    }
  }
`;

const NotificationBadge = styled.div`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    right: 3px;
    width: 8px;
    height: 8px;
    background-color: #8A2BE2;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const Button = styled.button`
  padding: 8px 20px;
  background: ${({ transparent }) => transparent ? "transparent" : "linear-gradient(135deg, #8A2BE2, #4B0082)"};
  border: ${({ transparent }) => transparent ? `2px solid #8A2BE2` : "none"};
  color: ${({ transparent }) => transparent ? "#8A2BE2" : "white"};
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${({ transparent }) => 
    transparent 
      ? `0 3px 10px rgba(138,43,226,0.1)` 
      : `0 5px 15px rgba(138,43,226,0.3)`};
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ transparent }) => 
      transparent 
        ? `0 5px 15px rgba(138,43,226,0.2)` 
        : `0 8px 20px rgba(138,43,226,0.4)`};
    background: ${({ transparent }) => 
      transparent 
        ? `rgba(138,43,226,0.15)` 
        : `linear-gradient(135deg, #4B0082, #8A2BE2)`};
  }
  svg {
    font-size: 18px;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 25px;
  background-color: #999;
  object-fit: cover;
`;

// ─── Composant Navbar ──────────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // Récupère le thème global depuis le context
  const { isDark, toggleTheme } = useTheme();

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Container $isDark={isDark} style={{
        boxShadow: scrolled ? "0 20px 20px rgba(0, 0, 0, 0.15)" : "none",
        height: scrolled ? "65px" : "70px"
      }}>
        <Wrapper>
          <Link to="/" style={{ textDecoration: "none" }}>
            {/* Logo ou titre si besoin */}
          </Link>

          <Search focused={focused} $isDark={isDark}>
            <Input
              placeholder="Search"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e => setQ(e.target.value)}
              $isDark={isDark}
            />
            <SearchIconContainer focused={focused}>
              <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)} />
            </SearchIconContainer>
          </Search>

          <ButtonsContainer>
            {/* Bouton toggle thème branché au context */}
            <IconButton $isDark={isDark} onClick={toggleTheme} title={isDark ? "Mode clair" : "Mode sombre"}>
              {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>

            {currentUser ? (
              <User $isDark={isDark}>
                <IconButton $isDark={isDark}>
                  <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
                </IconButton>
                <NotificationBadge>
                  <IconButton $isDark={isDark}>
                    <NotificationsNoneOutlinedIcon />
                  </IconButton>
                </NotificationBadge>
                <Link to={`/dashbord/${currentUser._id}`} style={{ textDecoration: "none" }}>
                  <IconButton $isDark={isDark}>
                    <Avatar src={currentUser.img} />
                  </IconButton>
                </Link>
                {currentUser.name}
              </User>
            ) : (
              <Link to="signin" style={{ textDecoration: "none" }}>
                <Button transparent>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Link>
            )}
          </ButtonsContainer>
        </Wrapper>
      </Container>

      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;