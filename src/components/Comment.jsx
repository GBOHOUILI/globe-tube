import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { format } from "timeago.js";

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"};
  border: 2px solid ${({ $isDark }) => $isDark ? "#c084fc" : "#d1d5db"};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#333"};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#2E0854"};
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#888"};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
  color: ${({ $isDark }) => $isDark ? "#cbd5e1" : "#444"};
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  // Récupération du thème global
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`${url}/users/find/${comment.userId}`, {
          withCredentials: true,
        });
        setChannel(res.data);
      } catch (err) {
        console.error("Erreur chargement utilisateur :", err);
      }
    };
    fetchComment();
  }, [comment.userId]);

  return (
    <Container>
      <Avatar src={channel.img} $isDark={isDark} />
      <Details $isDark={isDark}>
        <Name $isDark={isDark}>
          {channel.name}
          <Date $isDark={isDark}>{format(comment.createdAt)}</Date>
        </Name>
        <Text $isDark={isDark}>{comment.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;