import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import socket from '../socket';
import axios from 'axios';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const url = process.env.REACT_APP_API_URL;


const PlayerWrapper = styled.div`
  padding: 20px;
`;

const StyledVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;


function VideoPlayer({ roomId }) {
  const videoRef = useRef(null);
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const videoId = query.get('videoId');

    if (videoId) {
      axios.get(`${url}/videos/find/${videoId}`)
        .then(res => {
          setVideoUrl(res.data.videoUrl);
        })
        .catch(err => {
          console.error("Erreur chargement vidéo:", err);
        });
    }
  }, [location.search]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("video-action", (action) => {
      const video = videoRef.current;
      if (!video) return;

      switch (action.type) {
        case "play":
          video.play();
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
    });

    return () => {
      socket.off("video-action");
    };
  }, [roomId]);

  const emitAction = (type, payload = {}) => {
    socket.emit("video-action", {
      roomId,
      action: { type, ...payload },
    });
  };

  const handlePlay = () => emitAction("play");
  const handlePause = () => emitAction("pause");
  const handleSeek = () => {
    const time = videoRef.current?.currentTime;
    emitAction("seek", { time });
  };

  if (currentUser === null) {
    return <Navigate to="/signin" />;
  }

  if (!videoUrl) return <p>Chargement de la vidéo...</p>;

  return (
    <PlayerWrapper>
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
