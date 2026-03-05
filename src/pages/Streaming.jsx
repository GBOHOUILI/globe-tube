import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ $isDark }) => $isDark ? "#0f0f17" : "#f5f0ff"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  padding: 24px;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 32px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16 / 9;
  margin-bottom: 24px;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const PosterFallback = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: ${({ $isDark }) => $isDark ? "white" : "#2E0854"};
`;

const Description = styled.p`
  line-height: 1.7;
  color: ${({ $isDark }) => $isDark ? "#cbd5e1" : "#475569"};
  margin-top: 16px;
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #94a3b8;
  font-size: 1.2rem;
`;

const ErrorBox = styled.div`
  background: rgba(239,68,68,0.15);
  color: #fca5a5;
  padding: 16px 24px;
  border-radius: 12px;
  border-left: 4px solid #ef4444;
  margin: 20px 0;
  text-align: center;
`;

const NoStreamMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 24px 0;
  padding: 20px;
  background: ${({ $isDark }) => $isDark ? "rgba(255,255,255,0.05)" : "rgba(138,43,226,0.05)"};
  border-radius: 12px;
  animation: ${fadeIn} 0.5s ease;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#666"};
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $isDark }) => $isDark ? "#fff" : "#2E0854"};
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 32px 0 16px;
  color: ${({ $isDark }) => $isDark ? "#fff" : "#2E0854"};
  border-bottom: 2px solid ${({ $isDark }) => $isDark ? "#8A2BE2" : "#8A2BE2"};
  padding-bottom: 8px;
`;

const Badge = styled.span`
  background: ${({ color }) => color || "#8A2BE2"};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 24px;
  margin: 16px 0;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: ${({ $isDark }) => $isDark ? "#cbd5e1" : "#475569"};
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
`;

const VideoErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  color: white;
  flex-direction: column;
  gap: 16px;
`;

const DebugInfo = styled.pre`
  background: ${({ $isDark }) => $isDark ? "#1a1a2e" : "#f0f0f0"};
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  overflow: auto;
  max-height: 200px;
  margin-top: 20px;
  border: 1px solid ${({ $isDark }) => $isDark ? "#333" : "#ddd"};
`;

export default function Stream() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [showDebug, setShowDebug] = useState(false); // Mettre à true pour le debug
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    
    let cancelled = false;
    setLoading(true);
    setError(null);
    setVideoError(null);
    
    console.log("[Stream Detail] Chargement contenu ID:", id);
    
    axios.get(`${API_URL}/stream/${id}`)
      .then(res => {
        if (cancelled) return;
        console.log("[Stream Detail] Réponse API complète:", res.data);
        
        if (res.data?.data) {
          const data = res.data.data;
          console.log("[Stream Detail] Streams trouvés :", data.streams?.length || 0);
          console.log("[Stream Detail] URLs de stream :", data.streams);
          console.log("[Stream Detail] Trailer :", data.trailer);
          setStream(data);
        } else {
          setError("Contenu introuvable dans la réponse API");
        }
      })
      .catch(err => {
        if (cancelled) return;
        console.error("[Stream Detail] Erreur chargement:", err.message);
        setError("Impossible de charger le contenu");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
      
    return () => { cancelled = true; };
  }, [id]);

  // Gérer les erreurs de lecture vidéo
  const handleVideoError = (e) => {
    console.error("[Video Error] Détails:", e);
    const video = e.target;
    const error = video.error;
    
    let errorMessage = "Erreur de lecture vidéo";
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Lecture interrompue";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Erreur réseau - Vérifiez votre connexion";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Format vidéo non supporté";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Source vidéo non supportée";
          break;
        default:
          errorMessage = `Erreur inconnue (${error.code})`;
      }
    }
    setVideoError(errorMessage);
  };

  // Réessayer la lecture vidéo
  const retryVideo = () => {
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.log("Auto-play bloqué par le navigateur");
      });
    }
  };

  // Construire l'URL complète du stream
  const getFullStreamUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    return `${API_URL.replace('/api', '')}${url.startsWith('/') ? url : '/' + url}`;
  };

  // Extraire les acteurs du titre ou de la description
  const extractActors = () => {
    if (!stream) return [];
    
    // Format: "LOVE OF WOMEN - SAGA DEOLU, MIRACLE GODWIN, OGECHUKWU ISABELLA"
    if (stream.title && stream.title.includes("-")) {
      const parts = stream.title.split("-");
      if (parts.length > 1) {
        const actorsPart = parts[1].trim();
        return actorsPart.split(",").map(actor => actor.trim());
      }
    }
    return [];
  };

  const hasStream = stream?.streams?.length > 0;
  const streamUrl = hasStream ? getFullStreamUrl(stream.streams[0]) : null;
  const hasTrailer = stream?.trailer?.VideoAddress?.url;
  const trailerUrl = hasTrailer ? getFullStreamUrl(stream.trailer.VideoAddress.url) : null;
  const actors = extractActors();

  console.log("[Stream Detail] Rendu final :", {
    hasStream,
    streamUrl,
    hasTrailer,
    trailerUrl
  });

  if (loading) return <Loading>Chargement du contenu...</Loading>;
  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!stream) return <ErrorBox>Contenu non trouvé</ErrorBox>;

  return (
    <Page $isDark={isDark}>
      <Wrapper>
        <div>
          <VideoContainer>
            {(hasStream || hasTrailer) ? (
              <>
                <VideoPlayer 
                  ref={videoRef}
                  controls 
                  autoPlay 
                  muted
                  onError={handleVideoError}
                  key={streamUrl || trailerUrl} // Force le rechargement si l'URL change
                >
                  {hasStream && streamUrl && (
                    <>
                      <source src={streamUrl} type="video/mp4" />
                      <source src={streamUrl} type="video/webm" />
                      <source src={streamUrl} type="video/ogg" />
                    </>
                  )}
                  {!hasStream && hasTrailer && trailerUrl && (
                    <>
                      <source src={trailerUrl} type="video/mp4" />
                      <source src={trailerUrl} type="video/webm" />
                      <source src={trailerUrl} type="video/ogg" />
                    </>
                  )}
                  Votre navigateur ne supporte pas la lecture vidéo.
                </VideoPlayer>
                {videoError && (
                  <VideoErrorOverlay>
                    <div>⚠️ {videoError}</div>
                    <button onClick={retryVideo}>Réessayer</button>
                  </VideoErrorOverlay>
                )}
              </>
            ) : (
              <PosterFallback
                src={stream.cover?.url || "https://via.placeholder.com/1280x720?text=Aperçu"}
                alt={stream.title}
              />
            )}
          </VideoContainer>

          <Title $isDark={isDark}>{stream.title || "Sans titre"}</Title>

          {/* Statistiques */}
          <StatsContainer>
            {stream.viewers > 0 && (
              <Stat $isDark={isDark}>👁️ {stream.viewers.toLocaleString()} vues</Stat>
            )}
            {stream.imdbRatingValue && stream.imdbRatingValue !== "0" && (
              <Stat $isDark={isDark}>⭐ IMDb: {stream.imdbRatingValue}</Stat>
            )}
            {stream.haveSeenCount > 0 && (
              <Stat $isDark={isDark}>✅ {stream.haveSeenCount} ont vu</Stat>
            )}
            {stream.wantToSeeCount > 0 && (
              <Stat $isDark={isDark}>🔖 {stream.wantToSeeCount} veulent voir</Stat>
            )}
          </StatsContainer>

          {/* Informations principales */}
          <InfoGrid $isDark={isDark}>
            {stream.genre && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>Genre</InfoLabel>
                <InfoValue $isDark={isDark}>{stream.genre}</InfoValue>
              </InfoItem>
            )}
            
            {stream.countryName && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>Pays</InfoLabel>
                <InfoValue $isDark={isDark}>{stream.countryName}</InfoValue>
              </InfoItem>
            )}
            
            {stream.releaseDate && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>Date de sortie</InfoLabel>
                <InfoValue $isDark={isDark}>
                  {new Date(stream.releaseDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </InfoValue>
              </InfoItem>
            )}
            
            {stream.duration && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>Durée</InfoLabel>
                <InfoValue $isDark={isDark}>{stream.duration}</InfoValue>
              </InfoItem>
            )}
            
            {stream.subjectId && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>ID du contenu</InfoLabel>
                <InfoValue $isDark={isDark}>{stream.subjectId}</InfoValue>
              </InfoItem>
            )}
            
            <InfoItem>
              <InfoLabel $isDark={isDark}>Type</InfoLabel>
              <InfoValue $isDark={isDark}>
                {stream.subjectType === 1 ? "Film" : "Série"}
              </InfoValue>
            </InfoItem>
            
            {stream.contentRating && (
              <InfoItem>
                <InfoLabel $isDark={isDark}>Classification</InfoLabel>
                <InfoValue $isDark={isDark}>{stream.contentRating}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>

          {/* Acteurs */}
          {actors.length > 0 && (
            <>
              <SectionTitle $isDark={isDark}>Acteurs</SectionTitle>
              <CastList>
                {actors.map((actor, index) => (
                  <Badge key={index} color="#8A2BE2">{actor}</Badge>
                ))}
              </CastList>
            </>
          )}

          {/* Description */}
          <SectionTitle $isDark={isDark}>Synopsis</SectionTitle>
          <Description $isDark={isDark}>
            {stream.description || "Aucune description disponible."}
          </Description>

          {/* État du streaming */}
          <SectionTitle $isDark={isDark}>Disponibilité</SectionTitle>
          {hasStream ? (
            <div>
              <Badge color="#10B981">✅ Stream complet disponible</Badge>
              <p style={{ marginTop: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>
                {stream.streams.length} source(s) de streaming disponible(s)
              </p>
            </div>
          ) : hasTrailer ? (
            <div>
              <Badge color="#F59E0B">🎬 Trailer disponible uniquement</Badge>
              <Badge color="#EF4444">❌ Stream complet non disponible</Badge>
            </div>
          ) : (
            <NoStreamMessage $isDark={isDark}>
              Pas de stream disponible pour le moment.<br />
              Essayez un autre contenu ou revenez plus tard.
            </NoStreamMessage>
          )}

          {/* Détails supplémentaires */}
          {(stream.dubs?.length > 0 || stream.subtitles) && (
            <>
              <SectionTitle $isDark={isDark}>Audio et sous-titres</SectionTitle>
              <div>
                {stream.dubs?.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <InfoLabel $isDark={isDark}>Doublages disponibles:</InfoLabel>
                    <div style={{ marginTop: '4px' }}>
                      {stream.dubs.map((dub, index) => (
                        <Badge key={index} color="#6B7280">{dub}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {stream.subtitles && (
                  <div>
                    <InfoLabel $isDark={isDark}>Sous-titres:</InfoLabel>
                    <Badge color="#6B7280">{stream.subtitles}</Badge>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Debug Info - Optionnel */}
          {showDebug && (
            <DebugInfo $isDark={isDark}>
              {JSON.stringify({
                hasStream,
                streamUrl,
                hasTrailer,
                trailerUrl,
                fullStream: stream
              }, null, 2)}
            </DebugInfo>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '20px', color: isDark ? '#fff' : '#2E0854' }}>
            Recommandations
          </h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Bientôt disponible...
          </p>
        </div>
      </Wrapper>
    </Page>
  );
}