import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {format} from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";
const url = process.env.REACT_APP_API_URL;

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 3px;
`;

const Image = styled.img`
  width:${(props) => (props.type === "sm" ? "90px" : "100%")};;
  height: ${(props) => (props.type === "sm" ? "90px" : "202px")};
  background-color: #999;
  flex: 1;
  object-fit: cover;
    border-radius: 15px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 40%;
  object-fit:cover;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
  
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: #333; /* Couleur du texte */
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: #888; /* Couleur douce du texte */
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: #888; /* Couleur douce du texte */
`;
const Card = ({ type, video }) => {
  const [channel, setChannel] = useState(video.channel || null);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (video.channel) return;

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`${url}/users/find/${video.userId}`, {
  withCredentials: true,
});
        setChannel(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la chaîne :", err);
      }
    };

    fetchChannel();
  }, [video]);
  return (
   
      <Container type={type}>
         <Link to={`/videos/${video._id}`} style={{ textDecoration: "none" }}>
        <Image
          type={type}
          src={video.imgUrl}
        />
      </Link>
        <Details type={type}>
          <Link to={`/dashbord/${video.userId}` }style={{ textDecoration: "none" }}>
            <ChannelImage
            type={type}
            src={channel?.img}
            />
          </Link>

          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel?.name || "Chaîne inconnue"}</ChannelName>
            <Info>{video.views} views • {format(video.createdAt)}</Info>
          </Texts>
        </Details>
      </Container>

  );
};

export default Card;