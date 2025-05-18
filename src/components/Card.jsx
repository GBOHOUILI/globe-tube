import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {format} from "timeago.js";
import axios from "axios";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 60%;
  height: ${(props) => (props.type === "sm" ? "120px" : "50%")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
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

  useEffect(() => {
    // Si les données sont déjà là (vidéo fictive)
    if (video.channel) return;

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la chaîne :", err);
      }
    };

    fetchChannel();
  }, [video]);

  return (
    <Link to={`/videos/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image
          type={type}
          src={video.videoUrl}
        />
        <Details type={type}>
          <ChannelImage
            type={type}
            src={channel?.img || "/default-avatar.jpg"}
          />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel?.name || "Chaîne inconnue"}</ChannelName>
            <Info>{video.views} views • {format(video.createdAt)}</Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;