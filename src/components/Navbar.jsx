import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./UploadVideo";
import { useNavigate } from "react-router-dom";
// import { Avatar } from "@mui/material";

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
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    width: 40%;
  }
  to {
    width: 50%;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(138, 43, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
  }
`;

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  height: 70px;
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.15);
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 30px;
  position: relative;
`;

const Search = styled.div`
  width: 50%;
  position: absolute;
  left: -250px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  border: 2px solid ${props => props.focused ? theme.primaryColor : "transparent"};
  border-radius: 30px;
  background-color: ${theme.lightColor};
  transition: all 0.3s ease;
  box-shadow: ${props => props.focused ? 
    `0 0 0 4px ${theme.primaryColor}30, 0 5px 15px rgba(138, 43, 226, 0.2)` : 
    '0 3px 10px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.15);
    background-color: ${props => props.focused ? theme.lightColor : "#f8f5ff"};
  }
  
  ${props => props.focused && css`
    animation: ${slideIn} 0.3s ease forwards;
  `}
`;

const SearchIconContainer = styled.div`
  color: ${theme.primaryColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${props => props.focused ? `${theme.primaryColor}15` : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${theme.primaryColor}30;
    transform: scale(1.1);
  }
  
  svg {
    font-size: 22px;
    transition: all 0.3s ease;
    color: ${props => props.focused ? theme.primaryColor : theme.secondaryColor};
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${theme.textColor};
  font-size: 16px;
  width: 100%;
  padding: 8px 15px 8px 0;
  
  &::placeholder {
    color: ${theme.secondaryColor}80;
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
  border-radius: 50%;
  background-color: ${theme.lightColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  
  svg {
    font-size: 20px;
    color: ${theme.darkColor};
    transition: all 0.2s ease;
  }
  
  &:hover {
    background-color: ${theme.primaryColor}15;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.15);
    
    svg {
      color: ${theme.primaryColor};
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
    background-color: ${theme.primaryColor};
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const Button = styled.button`
  padding: 8px 20px;
  background: ${props => props.transparent ? "transparent" : theme.gradient};
  border: ${props => props.transparent ? `2px solid ${theme.primaryColor}` : "none"};
  color: ${props => props.transparent ? theme.primaryColor : "white"};
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
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
const User = styled.div`
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      color: ${({ theme }) => theme.textColor}
`

const Avatar = styled.img`
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #999;

`
const Navbar = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user)
  const [q, setQ] = useState("")
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      <Container style={{ 
        boxShadow: scrolled ? "0 20px 20px rgba(0, 0, 0, 0.15)" : "none",
        height: scrolled ? "65px" : "70px"
          }}>
        <Wrapper>
          <Link to="/" style={{ textDecoration: "none" }}>
          </Link>
          
          <Search focused={focused}>
            <Input 
              placeholder="Search" 
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e=>setQ(e.target.value)}
            />
            <SearchIconContainer focused={focused}>
              <SearchOutlinedIcon onClick={()=>navigate(`/search?q=${q}`)} />
            </SearchIconContainer>
          </Search>

          <ButtonsContainer>
            {currentUser ? (
              <User>
                <IconButton>
                  <VideoCallOutlinedIcon onClick={() => setOpen(true)}/>
                </IconButton>
                <NotificationBadge>
                  <IconButton>
                    <NotificationsNoneOutlinedIcon />
                  </IconButton>
                </NotificationBadge>
                <IconButton>
                <Avatar src={currentUser.img} />
                </IconButton>
                {currentUser.name}
              </User>

            ) : (
              <Link to="signin" style={{ textDecoration: "none" }}>
              <Button transparent>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>)}
          </ButtonsContainer>
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;