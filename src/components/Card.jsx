import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { format } from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// Animation (inchangée)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const Container = styled.div`
  width: ${(p) => p.type !== "sm" ? "300px" : "auto"};
  margin-bottom: ${(p) => p.type === "sm" ? "10px" : "45px"};
  cursor: pointer;
  display: ${(p) => p.type === "sm" && "flex"};
  gap: 3px;
  position: relative;
  animation: ${fadeIn} 0.35s ease;
  &:hover .card-actions { opacity: 1; pointer-events: all; }
  @media (max-width: 768px) {
    width: ${(p) => p.type !== "sm" && "100%"};
  }
`;

const ImageWrap = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  width: ${(p) => p.type === "sm" ? "90px" : "100%"};
  height: ${(p) => p.type === "sm" ? "90px" : "202px"};
  flex-shrink: 0;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#f1f1f1"};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  ${Container}:hover & { transform: scale(1.03); }
`;

const ActionOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease;
  border-radius: 15px;
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.18s ease;
  white-space: nowrap;
`;

const EditBtn = styled(ActionBtn)`
  background: rgba(255,255,255,0.15);
  color: #fff;
  &:hover { 
    background: rgba(139,92,246,0.7); 
    border-color: #8b5cf6; 
  }
`;

const DeleteBtn = styled(ActionBtn)`
  background: rgba(239,68,68,0.2);
  color: #fca5a5;
  border-color: rgba(239,68,68,0.3);
  &:hover { 
    background: rgba(239,68,68,0.65); 
    border-color: #ef4444; 
    color: white; 
  }
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(p) => p.type !== "sm" && "12px"};
  gap: 12px;
  flex: 1;
  padding: ${(p) => p.type === "sm" && "0 8px"};
`;

const ChannelImage = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"};
  flex-shrink: 0;
  display: ${(p) => p.type === "sm" && "none"};
  border: 2px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "#d1d5db"};
`;

const Texts = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: 0.97rem;
  font-weight: 600;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  margin: 0 0 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.25s;
`;

const ChannelName = styled.h2`
  font-size: 0.82rem;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  margin: 0 0 4px;
  font-weight: 500;
`;

const Info = styled.div`
  font-size: 0.78rem;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
`;

// ─── Composant Card ────────────────────────────────────────────────────────
const Card = ({ type, video, onDelete }) => {
  const [channel] = useState(video.channel || null);
  const [channelData, setChannelData] = useState(channel);

  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const isOwner = currentUser?._id === video.userId;

  // Récupération du thème global
  const { isDark } = useTheme();

  useEffect(() => {
    if (video.channel) return;
    let cancelled = false;
    axios.get(`${url}/users/find/${video.userId}`, { withCredentials: true })
      .then(res => { if (!cancelled) setChannelData(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [video]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Supprimer cette vidéo ?")) return;
    try {
      await axios.delete(`${url}/videos/${video._id}`, { withCredentials: true });
      if (onDelete) onDelete(video._id);
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${video._id}`);
  };

  return (
    <Container type={type}>
      <Link to={`/videos/${video._id}`} style={{ textDecoration: "none" }}>
        <ImageWrap type={type} $isDark={isDark}>
          <Image src={video.imgUrl} alt={video.title} />
          {isOwner && (
            <ActionOverlay className="card-actions">
              <EditBtn onClick={handleEdit}>✎ Modifier</EditBtn>
              <DeleteBtn onClick={handleDelete}>✕ Supprimer</DeleteBtn>
            </ActionOverlay>
          )}
        </ImageWrap>
      </Link>

      <Details type={type}>
        <Link to={`/dashbord/${video.userId}`} style={{ textDecoration: "none" }}>
          <ChannelImage type={type} src={channelData?.img} alt={channelData?.name} $isDark={isDark} />
        </Link>

        <Texts>
          <Title $isDark={isDark}>{video.title}</Title>
          <ChannelName $isDark={isDark}>{channelData?.name || "Chaîne inconnue"}</ChannelName>
          <Info $isDark={isDark}>
            {video.views?.toLocaleString()} vues • {format(video.createdAt)}
          </Info>
        </Texts>
      </Details>
    </Container>
  );
};

export default Card;