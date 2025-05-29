import React from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import ChatBox from "../components/ChatBox";
import InviteModal from "../components/InviteModal";
import VideoPlayer from "../components/VideoPlayer";
import { useSelector } from 'react-redux';
import Recommendation2 from "../components/Recommendation2";


// Thème de couleurs
const theme = {
  primaryColor: "#8A2BE2",
  secondaryColor: "#9370DB",
  accentColor: "#BA55D3",
  lightColor: "#E6E6FA",
  darkColor: "#4B0082",
  textColor: "#2E0854",
};

// Animations
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

const Container = styled.div`
  display: flex;
  
  gap: 24px;
  animation: ${fadeIn} 0.8s ease forwards;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSide = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;
const Recom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color:red;
`;


const RightSide = styled.div`
  flex: 1;
  border-left: 1px solid #ddd;
  background-color:none
  border-radius:20px;
`;

// Cadre vidéo stylisé
const VideoWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(75, 0, 130, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 150px;
  max-height: 400px;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(75, 0, 130, 0.3);
  }
`;

const VideoFrame = styled.video`
  max-height: 410px;
  width: 100%;
  object-fit: contain;
  background-color: black;
`;

function WatchParty() {
    const { roomId } = useParams(); 
    const { currentVideo } = useSelector((state) => state.video);
  return (
    <Container>
      <LeftSide>
        <VideoPlayer roomId={roomId} />
        <InviteModal />

      </LeftSide>
      <RightSide>
        <ChatBox roomId={roomId} />
      </RightSide>
    </Container>
  );
}

export default WatchParty;


