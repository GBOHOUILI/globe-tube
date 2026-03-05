import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

const Container = styled.div``;

const NewComment = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"};
  border: 2px solid ${({ $isDark }) => $isDark ? "#c084fc" : "#d1d5db"};
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ $isDark }) => $isDark ? "#4b5563" : "#ccc"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#333"};
  background-color: transparent;
  outline: none;
  padding: 5px;
  flex: 1;
  &::placeholder {
    color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#aaa"};
  }
`;

const Button = styled.button`
  background-color: transparent;
  color: #8A2BE2;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  align-self: flex-end;
  box-shadow: none;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.15)" : "white"};
    color: #6b21a8;
    transform: scale(1.1);
  }
`;

// ─── Composant Comments ────────────────────────────────────────────────────
const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState('');

  // Récupération du thème global
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${url}/comments/${videoId}`, {
          withCredentials: true,
        });
        setComments(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des commentaires :", err);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    try {
      const res = await axios.post(
        `${url}/comments`,
        { videoId, desc },
        { withCredentials: true }
      );

      // Ajout immédiat du commentaire dans la liste
      setComments([res.data, ...comments]);
      setDesc("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);
    }
  };

  return (
    <Container>
      <NewComment onSubmit={handleAddComment}>
        <Row>
          <Avatar src={currentUser?.img} $isDark={isDark} />
          <Input
            placeholder="Add a comment..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            $isDark={isDark}
          />
          <Button type="submit" $isDark={isDark}>
            <SendIcon />
          </Button>
        </Row>
      </NewComment>

      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;