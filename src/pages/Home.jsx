import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Card from "../components/Card";
import axios from "axios";

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// Animations (inchangées)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 24px 40px;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  min-height: 100vh;
  gap: 8px;
  @media (max-width: 768px) {
    padding: 16px 16px;
  }
`;

const SkeletonCard = styled.div`
  width: 300px;
  margin-bottom: 45px;
  background: linear-gradient(
    90deg,
    ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"} 25%,
    ${({ $isDark }) => $isDark ? "#2d3748" : "#cbd5e1"} 50%,
    ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite;
  border-radius: 15px;
  height: 280px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EmptyMsg = styled.div`
  width: 100%;
  text-align: center;
  padding: 100px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.1rem;
  animation: ${fadeIn} 0.5s ease;
`;

const ErrorMsg = styled.div`
  width: 100%;
  text-align: center;
  padding: 60px 20px;
  color: #fca5a5;
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"};
  border-radius: 12px;
  border-left: 3px solid #ef4444;
  margin: 20px;
  font-size: 0.95rem;
`;

// ─── Composant Home ────────────────────────────────────────────────────────
const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération du thème global
  const { isDark } = useTheme();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios.get(`${url}/videos/${type}`)
      .then(res => {
        if (!cancelled) setVideos(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les vidéos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [type]);

  if (loading) {
    return (
      <Container $isDark={isDark}>
        {Array(12).fill(null).map((_, i) => <SkeletonCard key={i} $isDark={isDark} />)}
      </Container>
    );
  }

  if (error) {
    return (
      <Container $isDark={isDark}>
        <ErrorMsg $isDark={isDark}>{error}</ErrorMsg>
      </Container>
    );
  }

  if (videos.length === 0) {
    return (
      <Container $isDark={isDark}>
        <EmptyMsg $isDark={isDark}>Aucune vidéo disponible pour le moment.</EmptyMsg>
      </Container>
    );
  }

  return (
    <Container $isDark={isDark}>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;