import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// ─── Styled Components ─────────────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 24px 40px;
  min-height: 100vh;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  gap: 20px;
  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const Title = styled.h1`
  width: 100%;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  margin: 0 0 24px;
`;

const Loader = styled.div`
  width: 100%;
  text-align: center;
  padding: 80px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.1rem;
`;

const NoResults = styled.div`
  width: 100%;
  text-align: center;
  padding: 80px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  width: 100%;
  padding: 16px 20px;
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)"};
  color: #fca5a5;
  border-radius: 12px;
  border-left: 4px solid #ef4444;
  margin: 20px 0;
  font-size: 1rem;
`;

// ─── Composant Search ──────────────────────────────────────────────────────
const Search = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { isDark } = useTheme();

  // Récupération du paramètre ?q=...
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q")?.trim() || "";

  useEffect(() => {
    const fetchVideos = async () => {
      if (!searchQuery) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${url}/videos/search/${encodeURIComponent(searchQuery)}`, {
          withCredentials: true,
        });
        setVideos(res.data || []);
      } catch (err) {
        console.error("Erreur recherche :", err);
        setError("Impossible de charger les résultats. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  return (
    <Container $isDark={isDark}>
      <Title $isDark={isDark}>
        Résultats pour : "{searchQuery || "aucune recherche"}"
      </Title>

      {error && <ErrorMessage $isDark={isDark}>{error}</ErrorMessage>}

      {loading ? (
        <Loader $isDark={isDark}>Chargement des résultats...</Loader>
      ) : videos.length === 0 ? (
        <NoResults $isDark={isDark}>
          {searchQuery
            ? `Aucun résultat trouvé pour "${searchQuery}"`
            : "Entrez un terme de recherche dans la barre ci-dessus"}
        </NoResults>
      ) : (
        videos.map((video) => (
          <Card key={video._id} video={video} />
        ))
      )}
    </Container>
  );
};

export default Search;