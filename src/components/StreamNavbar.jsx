import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiArrowLeft, FiUpload, FiBell, FiUser } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext"; // toggle thème
import { useSelector } from "react-redux";

const StreamNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <Nav $isDark={isDark}>
      {/* Bouton Retour (utile sur /stream/:id, optionnel sur /movies) */}
      <BackButton to="/" $isDark={isDark}>
        <FiArrowLeft /> Retour
      </BackButton>

      <Logo to="/" $isDark={isDark}>
        GlobeTube
      </Logo>

      {/* Recherche centrée */}
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          placeholder="Rechercher films, séries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          $isDark={isDark}
        />
        <SearchIcon $isDark={isDark} />
      </SearchForm>

      {/* Boutons de la Navbar classique à droite */}
      <RightIcons $isDark={isDark}>
        {/* Toggle thème */}
        <IconButton onClick={toggleTheme} title={isDark ? "Mode clair" : "Mode sombre"} $isDark={isDark}>
          {isDark ? "☀️" : "🌙"}
        </IconButton>

        {/* Upload vidéo */}
        <IconButton onClick={() => navigate("/upload")} title="Uploader une vidéo" $isDark={isDark}>
          <FiUpload />
        </IconButton>

        {/* Notifications */}
        <IconButton title="Notifications" $isDark={isDark}>
          <FiBell />
        </IconButton>

        {/* Profil / connexion */}
        {currentUser ? (
          <Link to={`/dashbord/${currentUser._id}`} style={{ textDecoration: "none" }}>
            <IconButton title="Profil" $isDark={isDark}>
              <FiUser />
            </IconButton>
          </Link>
        ) : (
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <SignInButton $isDark={isDark}>Se connecter</SignInButton>
          </Link>
        )}
      </RightIcons>
    </Nav>
  );
};

// ─── Styled Components ──────────────────────────────────────────────────────
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: ${({ $isDark }) => $isDark 
    ? 'rgba(22, 27, 34, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'};
  border-bottom: 1px solid ${({ $isDark }) => $isDark 
    ? 'rgba(138,43,226,0.35)' 
    : 'rgba(138,43,226,0.15)'};
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#8A2BE2'};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: ${({ $isDark }) => $isDark ? 'white' : '#4B0082'}; }
  svg { font-size: 1.4rem; }
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#8A2BE2'};
  text-decoration: none;
`;

const SearchForm = styled.form`
  position: relative;
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 48px;
  border-radius: 999px;
  border: 1px solid ${({ $isDark }) => $isDark ? 'rgba(138,43,226,0.4)' : 'rgba(138,43,226,0.25)'};
  background: ${({ $isDark }) => $isDark ? 'rgba(30,30,40,0.9)' : 'rgba(255,255,255,0.9)'};
  color: ${({ $isDark }) => $isDark ? 'white' : '#2E0854'};
  font-size: 0.95rem;
  outline: none;
  &::placeholder { color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#94a3b8'}; }
  &:focus {
    border-color: #8A2BE2;
    box-shadow: 0 0 0 3px rgba(138,43,226,0.25);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#8A2BE2'};
  font-size: 1.2rem;
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#8A2BE2'};
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: ${({ $isDark }) => $isDark ? 'white' : '#4B0082'};
    transform: scale(1.15);
  }
`;

const SignInButton = styled.button`
  background: linear-gradient(135deg, #8A2BE2, #BA55D3);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    background: linear-gradient(135deg, #4B0082, #8A2BE2);
    transform: translateY(-1px);
  }
`;

export default StreamNavbar;