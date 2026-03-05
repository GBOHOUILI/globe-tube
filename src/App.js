import styled, { createGlobalStyle, keyframes } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import StreamNavbar from "./components/StreamNavbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Error from "./pages/Error";
import Search from "./pages/Search";
import UserProfile from "./pages/Dashbord";
import WatchParty from "./pages/WatchParty";
import Movies from "./pages/Movies";
import Stream from "./pages/Streaming";

// ─── Importer le ThemeProvider ─────────────────────────────────────────────
import { ThemeProvider } from "./context/ThemeContext";

// ─── Thème violet ─────────────────────────────
const theme = {
  primaryColor: "#8A2BE2", // Blueviolet
  secondaryColor: "#9370DB", // Medium Purple
  lightColor: "#E6E6FA", // Lavender
  darkColor: "#4B0082", // Indigo
  textColor: "#2E0854", // Dark violet
  transition: "all 0.3s ease"
};

// ─── Animations ───────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pageTransition = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ─── Styles globaux ──────────────────────────
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: ${theme.transition};
  }
  body {
    font-family: 'Roboto', sans-serif;
    background-color: ${theme.lightColor};
    color: ${theme.textColor};
  }
  a {
    text-decoration: none;
    color: ${theme.primaryColor};
    &:hover { color: ${theme.darkColor}; }
  }
  button, input[type="submit"] {
    background-color: ${theme.primaryColor};
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(138, 43, 226, 0.4);
    &:hover {
      background-color: ${theme.darkColor};
      box-shadow: 0 4px 8px rgba(138, 43, 226, 0.6);
      transform: translateY(-2px);
    }
  }

  /* Thèmes global dark/light */
  body.dark-theme {
    background: #0a0a12;
    color: #e2e8f0;
  }

  body.light-theme {
    background: #f8fafc;
    color: #1e293b;
  }
`;

// ─── Conteneurs principaux ───────────────────
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(214, 203, 203, 0.8) 0%,
    rgba(204, 204, 204, 0.8) 100%
  );
`;

const Main = styled.div`
  flex: 7;
  background-color: white;
  border-radius: 24px 24px 12px 12px;
  margin: 12px;
  box-shadow: 0 8px 30px rgba(138, 43, 226, 0.15);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Wrapper = styled.div`
  animation: ${fadeIn} 1s ease forwards;
  @media (max-width: 768px) {
    padding: 22px 20px;
  }
`;

const PageContainer = styled.div`
  animation: ${pageTransition} 0.5s ease;
`;

// ─── Composant pour gérer le layout et Navbar ─────────────────
function MainContent() {
  const location = useLocation();

  // Cacher complètement la navbar classique sur dashboard
  const hideClassicNavbar = location.pathname.startsWith("/dashbord");

  // Utiliser StreamNavbar sur les pages movies et stream
  const useStreamNavbar =
    location.pathname === "/movies" ||
    location.pathname.startsWith("/stream/");

  return (
    <Main>
      {/* 
        Logique Navbar :
        - Dashboard → aucune navbar
        - Movies ou Stream/:id → StreamNavbar (spéciale)
        - Tout le reste → Navbar classique
      */}
      {!hideClassicNavbar && !useStreamNavbar && <Navbar />}
      {useStreamNavbar && <StreamNavbar />}

      <Wrapper>
        <PageContainer>
          <Routes>
            <Route path="/">
              <Route index element={<Home type="random" />} />
              <Route path="trends" element={<Home type="trend" />} />
              <Route path="subscriptions" element={<Home type="sub" />} />
              <Route path="search" element={<Search />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="watchparty/:roomId" element={<WatchParty />} />
              <Route path="dashbord/:userId" element={<UserProfile />} />
              <Route path="movies" element={<Movies />} />

              {/* Routes vidéos classiques */}
              <Route path="videos">
                <Route path=":id" element={<Video />} />
              </Route>

              {/* Route streaming (unique !) */}
              <Route path="stream/:id" element={<Stream StreamDetail/>} />
            </Route>

            <Route path="*" element={<Error />} />
          </Routes>
        </PageContainer>
      </Wrapper>
    </Main>
  );
}

// ─── Composant principal App ─────────────────
function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Container>
        <BrowserRouter>
          <Menu />
          <MainContent />
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}
export default App;