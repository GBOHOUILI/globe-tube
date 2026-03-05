import React, { useEffect, useState } from "react";
import axios from 'axios';
import Card from "../components/Card";
import styled, { keyframes } from "styled-components";

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// Animation (inchangée)
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

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const Container = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
  background: ${({ $isDark }) => $isDark ? "#0f1117" : "#f8fafc"};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.3)" : "rgba(138,43,226,0.1)"};
  box-shadow: ${({ $isDark }) => $isDark 
    ? "0 4px 12px rgba(0,0,0,0.5)" 
    : "0 4px 12px rgba(0,0,0,0.08)"};
`;

// ─── Composant Recommendation ──────────────────────────────────────────────
const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  // Récupération du thème global
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!tags || tags.length === 0) return;

      try {
        const res = await axios.get(`${url}/videos/tags?tags=${tags.join(",")}`, {
          withCredentials: true,
        });
        setVideos(res.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des vidéos :", err);
      }
    };

    fetchVideos();
  }, [tags]);

  if (videos.length === 0) {
    return null || <p>Aucune recommandation pour le moment</p>;
  }

  return (
    <Container $isDark={isDark}>
      {videos.map(video => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;