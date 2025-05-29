import React from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import ChatBox from "../components/ChatBox";
import InviteModal from "../components/InviteModal";
import VideoPlayer from "../components/VideoPlayer";


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
const RightSide = styled.div`
  flex: 1;
  border-left: 1px solid #ddd;
  background-color:none
  border-radius:20px;
`;

function WatchParty() {
    const { roomId } = useParams(); 
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


