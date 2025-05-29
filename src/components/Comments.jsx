import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";


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
  object-fit:cover;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  color: #333;
  background-color: transparent;
  outline: none;
  padding: 5px;
  flex: 1;
`;

const Button = styled.button`
  background-color: transparent;
  color: #8A2BE2;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  align-self: flex-end;
  box-shadow:none;

  &:hover{
    background-color: white;
  color: #8A2BE2;
  }
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState('');
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
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
      const res = await axios.post(`/comments`, {
        videoId,
        desc,
      });

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
          <Avatar src={currentUser?.img || "/default-avatar.png"} />
          <Input
            placeholder="Add a comment..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
                  <Button type="submit">
          <SendIcon/>
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
