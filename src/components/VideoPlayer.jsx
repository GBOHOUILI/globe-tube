  // src/components/VideoPlayer.jsx
  // Player YouTube classique pour Watch Party
  // Lit videoId depuis l'URL via React Router (useSearchParams)

  import React, { useEffect, useRef, useState } from "react";
  import styled, { keyframes } from "styled-components";
  import axios from "axios";
  import { Navigate, useSearchParams } from "react-router-dom"; // ← useSearchParams ajouté
  import { useSelector } from "react-redux";
  import { useTheme } from "../context/ThemeContext";
  import socket from "../socket";

  const url = process.env.REACT_APP_API_URL;

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  `;
  const spin = keyframes`
    to { transform: rotate(360deg); }
  `;

  const PlayerWrapper = styled.div`
    padding: 20px;
    background: ${({ $isDark }) => $isDark ? "#0f1117" : "#f8fafc"};
    min-height: 100%;
    border-radius: 12px;
    box-shadow: ${({ $isDark }) => $isDark
      ? "0 4px 20px rgba(0,0,0,0.6)"
      : "0 4px 20px rgba(0,0,0,0.08)"};
  `;

  const StyledVideo = styled.video`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
    background: #000;
    outline: none;
    animation: ${fadeIn} 0.6s ease;
    display: block;
  `;

  const Loader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    gap: 16px;
    animation: ${fadeIn} 0.6s ease;
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

  function VideoPlayer({ roomId }) {
    const videoRef    = useRef(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const { isDark }  = useTheme();

    // ← Fix : useSearchParams au lieu de window.location.search
    const [searchParams] = useSearchParams();
    const videoIdFromUrl = searchParams.get("videoId");

    const [videoUrl, setVideoUrl] = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!roomId || !currentUser) return;

    const fetchOrCreateSession = async () => {
      try {
        const getRes = await axios.get(`${url}/watchsession/${roomId}`, { withCredentials: true });
        const session = getRes.data;

        // Priorité : URL > session stockée
        const videoIdFromUrl = searchParams.get("videoId");
        const videoIdFromSession = session?.video?._id || session?.video;

        if (videoIdFromUrl || videoIdFromSession) {
          setVideoUrl(`https://www.youtube.com/embed/${videoIdFromUrl || videoIdFromSession}`);
        } else {
          setError("Aucune vidéo associée à cette session.");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          const videoIdFromUrl = searchParams.get("videoId");
          if (!videoIdFromUrl) {
            setError("Aucune vidéo spécifiée.");
            setLoading(false);
            return;
          }
          // Création...
          const createRes = await axios.post(`${url}/watchsession`, { roomId, videoId: videoIdFromUrl }, { withCredentials: true });
          setVideoUrl(`https://www.youtube.com/embed/${videoIdFromUrl}`);
        } else {
          setError("Impossible de charger la session.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateSession();
  }, [roomId, currentUser, searchParams]);

    // ── Socket sync ───────────────────────────────────────────────────────────
    useEffect(() => {
      if (!roomId) return;

      socket.emit("join-room", roomId);

      const handleVideoAction = (action) => {
        const video = videoRef.current;
        if (!video) return;
        switch (action.type) {
          case "play":  video.play().catch(() => {}); break;
          case "pause": video.pause(); break;
          case "seek":  video.currentTime = action.time; break;
          default: break;
        }
      };

      socket.on("video-action", handleVideoAction);
      return () => {
        socket.off("video-action", handleVideoAction);
        socket.emit("leave-room", roomId);
      };
    }, [roomId]);

    const emitAction = (type, payload = {}) =>
      socket.emit("video-action", { roomId, action: { type, ...payload } });

    const handlePlay  = () => emitAction("play");
    const handlePause = () => emitAction("pause");
    const handleSeek  = () => {
      const time = videoRef.current?.currentTime;
      if (time !== undefined) emitAction("seek", { time });
    };

    if (!currentUser) return <Navigate to="/signin" replace />;

    if (loading) {
      return (
        <PlayerWrapper $isDark={isDark}>
          <Loader $isDark={isDark}>
            <Spinner $isDark={isDark} />
            Chargement de la vidéo...
          </Loader>
        </PlayerWrapper>
      );
    }

    if (error || !videoUrl) {
      return (
        <PlayerWrapper $isDark={isDark}>
          <ErrorMessage $isDark={isDark}>{error || "Vidéo introuvable"}</ErrorMessage>
        </PlayerWrapper>
      );
    }

    return (
      <PlayerWrapper $isDark={isDark}>
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

  export default VideoPlayer;