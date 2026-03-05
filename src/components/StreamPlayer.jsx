import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import socket from "../socket";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const PlayerWrapper = styled.div`
  padding: 20px;
  background: ${({ $isDark }) => $isDark ? "#0f1117" : "#f8fafc"};
  min-height: 100%;
  border-radius: 12px;
  box-shadow: ${({ $isDark }) => $isDark ? "0 4px 20px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.08)"};
`;

const StyledVideo = styled.video`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  background: #000;
  outline: none;
  animation: ${fadeIn} 0.6s ease;
`;

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid ${({ $isDark }) => $isDark ? "#2d3748" : "#e2e8f0"};
  border-top: 5px solid #8A2BE2;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)"};
  color: #fca5a5;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #ef4444;
`;

const ContentInfo = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  background: ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.1)" : "rgba(138,43,226,0.06)"};
  border: 1px solid rgba(138,43,226,0.2);
  border-radius: 10px;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  font-size: 0.9rem;
`;

function StreamPlayer({ roomId, subjectId: propSubjectId }) {
  const videoRef = useRef(null);
  const currentUser = useSelector(s => s.user.currentUser);
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();

  const [videoUrl, setVideoUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("[StreamPlayer] Composant monté pour roomId:", roomId);
  console.log("[StreamPlayer] subjectId reçu en prop:", propSubjectId);

  useEffect(() => {
    if (!roomId || !currentUser) {
      console.log("[StreamPlayer] Arrêt précoce : roomId ou currentUser manquant");
      setError("Session invalide ou utilisateur non connecté");
      setLoading(false);
      return;
    }

    console.log("[StreamPlayer] Début fetchStream pour roomId:", roomId);

    const fetchStream = async () => {
      try {
        console.log("[StreamPlayer] Étape 1 : Récupération session via GET /watchsession/" + roomId);

        const getRes = await axios.get(`${API_URL}/watchsession/${roomId}`, {
          withCredentials: true,
        });

        const session = getRes.data;
        console.log("[StreamPlayer] Étape 1 - Session récupérée :", {
          roomId: session.roomId,
          subjectId: session.subjectId,
          hasVideo: !!session.video,
          participants: session.participants?.length || 0,
          fullSession: session
        });

        // Priorité : prop > URL > session stockée
        let targetSubjectId = propSubjectId || searchParams.get("subjectId") || session?.subjectId;

        console.log("[StreamPlayer] Étape 2 - subjectId final choisi :", targetSubjectId, "(sources : prop / URL / session)");

        if (!targetSubjectId) {
          console.log("[StreamPlayer] Étape 2 - Échec : aucun subjectId trouvé");
          setError("Aucun contenu associé à cette session.");
          setLoading(false);
          return;
        }

        console.log("[StreamPlayer] Étape 3 : Appel à /stream/" + targetSubjectId);

        const streamRes = await axios.get(`${API_URL}/stream/${targetSubjectId}`);
        const data = streamRes.data?.data;

        console.log("[StreamPlayer] Étape 3 - Réponse /stream :", {
          success: !!data,
          title: data?.title,
          streamsCount: data?.streams?.length || 0
        });

        if (!data) throw new Error("Contenu introuvable");

        setTitle(data.title || "Sans titre");

        const streamUrl = data.streams?.[0];
        if (streamUrl) {
          console.log("[StreamPlayer] Étape 4 - Stream trouvé :", streamUrl);
          setVideoUrl(streamUrl);
        } else {
          console.log("[StreamPlayer] Étape 4 - Aucun stream disponible dans la réponse");
          setError("Aucun stream disponible pour ce contenu.");
        }
      } catch (err) {
        console.error("[StreamPlayer] Erreur complète :", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          stack: err.stack?.slice(0, 200) + "..."
        });
        setError("Impossible de charger le contenu de la session.");
      } finally {
        console.log("[StreamPlayer] Fin du chargement");
        setLoading(false);
      }
    };

    fetchStream();

    return () => {
      console.log("[StreamPlayer] Cleanup useEffect");
    };
  }, [roomId, currentUser, searchParams, propSubjectId]);

  // Socket sync (inchangé)
  useEffect(() => {
    if (!roomId) return;

    console.log("[StreamPlayer Socket] Join room:", roomId);
    socket.emit("join-room", roomId);

    const handleVideoAction = (action) => {
      const video = videoRef.current;
      if (!video) return;

      console.log("[StreamPlayer Socket] Action reçue :", action.type, action.time);

      switch (action.type) {
        case "play":
          video.play().catch(e => console.log("[Socket] Play error:", e));
          break;
        case "pause":
          video.pause();
          break;
        case "seek":
          video.currentTime = action.time;
          break;
        default:
          break;
      }
    };

    socket.on("video-action", handleVideoAction);

    return () => {
      console.log("[StreamPlayer Socket] Leave room:", roomId);
      socket.off("video-action", handleVideoAction);
      socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  const emitAction = (type, payload = {}) => {
    console.log("[StreamPlayer Socket] Envoi action :", type, payload);
    socket.emit("video-action", { roomId, action: { type, ...payload } });
  };

  const handlePlay = () => emitAction("play");
  const handlePause = () => emitAction("pause");
  const handleSeek = () => {
    const time = videoRef.current?.currentTime;
    if (time !== undefined) {
      emitAction("seek", { time });
    }
  };

  if (!currentUser) {
    console.log("[StreamPlayer] Utilisateur non connecté → redirection signin");
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    console.log("[StreamPlayer] Affichage loader");
    return (
      <PlayerWrapper $isDark={isDark}>
        <Loader $isDark={isDark}>
          <Spinner $isDark={isDark} />
          Chargement du contenu...
        </Loader>
      </PlayerWrapper>
    );
  }

  if (error || !videoUrl) {
    console.log("[StreamPlayer] Affichage erreur :", error);
    return (
      <PlayerWrapper $isDark={isDark}>
        <ErrorMessage $isDark={isDark}>{error || "Stream introuvable"}</ErrorMessage>
      </PlayerWrapper>
    );
  }

  console.log("[StreamPlayer] Affichage vidéo finale :", { videoUrl, title });

  return (
    <PlayerWrapper $isDark={isDark}>
      {title && (
        <ContentInfo $isDark={isDark}>
          🎬 {title}
        </ContentInfo>
      )}
      <StyledVideo
        ref={videoRef}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
      >
        <source src={videoUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </StyledVideo>
    </PlayerWrapper>
  );
}

export default StreamPlayer;