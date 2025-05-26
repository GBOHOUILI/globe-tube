import styled, { createGlobalStyle, keyframes } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";

// Définition du thème violet
const theme = {
  primaryColor: "#8A2BE2", // Blueviolet
  secondaryColor: "#9370DB", // Medium Purple
  lightColor: "#E6E6FA", // Lavender
  darkColor: "#4B0082", // Indigo
  textColor: "#2E0854", // Dark violet
  transition: "all 0.3s ease"
};

// Animation globale pour les éléments qui apparaissent
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

// Style global pour toute l'application
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
    
    &:hover {
      color: ${theme.darkColor};
    }
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
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(214, 203, 203, 0.8)  0%,
    rgba(204, 204, 204, 0.8) 100%
  );
`;

const Main = styled.div`
  flex: 7;
  background-color: white;
  border-radius: 12px;
  margin: 12px;
  box-shadow: 0 8px 30px rgba(138, 43, 226, 0.15);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Wrapper = styled.div`
  padding: 22px 10px;
  animation: ${fadeIn} 1s ease forwards;
  
  @media (max-width: 768px) {
    padding: 22px 20px;
  }
`;

// Animation pour la transition entre les pages
const pageTransition = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  animation: ${pageTransition} 0.5s ease;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <BrowserRouter>
          <Menu />
          <Main>
            <Navbar />
            <Wrapper>
              <PageContainer>
                <Routes>
                  <Route path="/">
                    <Route index element={<Home type="random"/>} />
                    <Route path="trends" element={<Home type="trend"/>} />
                    <Route path="subscriptions" element={<Home type="sub"/>} />
                    <Route path="search" element={<Search />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="videos">
                      <Route path=":id" element={<Video />} />
                    </Route>
                  </Route>
                </Routes>

              </PageContainer>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;