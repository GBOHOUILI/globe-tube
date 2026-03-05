import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../context/ThemeContext";

import ChatBox from "../components/ChatBox";
import InviteModal from "../components/InviteModal";
import VideoPlayer from "../components/VideoPlayer";      // YouTube
import StreamPlayer from "../components/StreamPlayer";    // Streaming externe

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px 40px;
  min-height: 100vh;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  animation: ${fadeIn} 0.8s ease forwards;
  @media (max-width: 1024px) { padding: 16px 20px; }
  @media (max-width: 768px) { flex-direction: column; gap: 16px; }
`;

const LeftSide = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightSide = styled.div`
  flex: 1;
  background: ${({ $isDark }) => $isDark ? "#161b22" : "white"};
  border-radius: 20px;
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "#ddd"};
  overflow: hidden;
  box-shadow: ${({ $isDark }) => $isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.08)"};
  height: fit-content;
  @media (max-width: 768px) { height: auto; }
`;

const NoRoom = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.2rem;
`;

function WatchParty() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  const subjectId = searchParams.get("subjectId");
  const videoId = searchParams.get("videoId");

  console.log("[WatchParty] Params reçus :", {
    roomId,
    subjectId,
    videoId,
    fullUrl: window.location.href
  });

  if (!roomId) {
    console.log("[WatchParty] Aucun roomId → affichage erreur");
    return (
      <Container $isDark={isDark}>
        <NoRoom $isDark={isDark}>
          Aucune salle spécifiée. Retournez à la page d'accueil.
        </NoRoom>
      </Container>
    );
  }

  return (
    <Container $isDark={isDark}>
      <LeftSide>
        <InviteModal />
        {subjectId ? (
          <>
            {console.log("[WatchParty] → Chargement StreamPlayer avec subjectId:", subjectId)}
            <StreamPlayer roomId={roomId} subjectId={subjectId} />
          </>
        ) : (
          <>
            {console.log("[WatchParty] → Chargement VideoPlayer avec videoId:", videoId)}
            <VideoPlayer roomId={roomId} />
          </>
        )}
      </LeftSide>

      <RightSide $isDark={isDark}>
        <ChatBox roomId={roomId} />
      </RightSide>
    </Container>
  );
}

export default WatchParty;