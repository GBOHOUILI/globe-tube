import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios"
import { format } from "timeago.js";
const url = process.env.REACT_APP_API_URL
const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #333; /* Couleur du texte */
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #888; /* Couleur douce du texte */
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({comment}) => {
  const [channel, setChannel] = useState({});
  useEffect(()=> {
    const fetchComment = async ()=> {
       const res = await axios.get(`${url}/users/find/${comment.userId}`, {
  withCredentials: true,
})
       setChannel(res.data)
    }
    fetchComment()
  }, [comment.userId])
  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name}<Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
