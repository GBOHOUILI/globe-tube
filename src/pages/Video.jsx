import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFailure, fetchSuccess, fetchStart, like, dislike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import { format } from "timeago.js";
import { v4 as uuidv4 } from "uuid";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";

const url = process.env.REACT_APP_API_URL;

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ─── Styled Components avec thème dynamique ────────────────────────────────
const Container = styled.div`
  display: flex;
  gap: 24px;
  animation: ${fadeIn} 0.8s ease forwards;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  min-height: 100vh;
  padding: 24px 40px;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px 20px;
  }
`;

const Content = styled.div`
  flex: 5;
  background: ${({ $isDark }) => $isDark ? "#161b22" : "white"};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ $isDark }) => $isDark 
    ? "0 8px 30px rgba(0,0,0,0.6)" 
    : "0 8px 30px rgba(138,43,226,0.15)"};
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ $isDark }) => $isDark 
    ? "0 5px 15px rgba(0,0,0,0.7)" 
    : "0 5px 15px rgba(75,0,130,0.2)"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 150px;
  max-height: 400px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ $isDark }) => $isDark 
      ? "0 12px 25px rgba(0,0,0,0.8)" 
      : "0 12px 25px rgba(75,0,130,0.3)"};
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#4B0082"};
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  flex-wrap: wrap;
  gap: 12px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Info = styled.span`
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  font-weight: 500;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#4B0082"};
  flex-wrap: wrap;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  background: ${({ $isDark }) => $isDark ? "#252f3d" : "#F5F0FF"};
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px ${({ $isDark }) => $isDark ? "rgba(0,0,0,0.5)" : "rgba(138,43,226,0.2)"};
  &:hover {
    background: ${({ $isDark }) => $isDark ? "#8A2BE2" : "#8A2BE2"};
    color: white;
    box-shadow: 0 4px 10px ${({ $isDark }) => $isDark ? "rgba(138,43,226,0.6)" : "rgba(138,43,226,0.4)"};
    transform: translateY(-2px);
  }
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${({ $isDark }) => $isDark ? "#c084fc" : "#9370DB"}, transparent);
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#F5F0FF"};
  border-radius: 12px;
  box-shadow: 0 4px 15px ${({ $isDark }) => $isDark ? "rgba(0,0,0,0.5)" : "rgba(138,43,226,0.1)"};
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 40%;
  object-fit: cover;
  border: 3px solid #8A2BE2;
  box-shadow: 0 4px 10px rgba(138,43,226,0.3);
  transition: transform 0.3s ease;
  &:hover { transform: scale(1.1); }
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#4B0082"};
`;

const ChannelName = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
`;

const ChannelCounter = styled.span`
  margin: 5px 0 10px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#9370DB"};
  font-size: 14px;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $isDark }) => $isDark ? "#cbd5e1" : "#2E0854"};
`;

const Subscribe = styled.button`
  background: linear-gradient(135deg, #8A2BE2, #4B0082);
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 25px;
  height: max-content;
  padding: 12px 25px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(138,43,226,0.4);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6px 20px rgba(138,43,226,0.6);
    transform: translateY(-3px);
    background: linear-gradient(135deg, #4B0082, #8A2BE2);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(138,43,226,0.3);
  }
`;

const ViewWithFriends = styled.button`
  background: linear-gradient(135deg, #8A2BE2, #4B0082);
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 25px;
  height: max-content;
  padding: 12px 25px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(138,43,226,0.4);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6px 20px rgba(138,43,226,0.6);
    transform: translateY(-3px);
    background: linear-gradient(135deg, #4B0082, #8A2BE2);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(138,43,226,0.3);
  }
`;

const IconPulse = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover svg {
    animation: ${pulse} 0.8s infinite;
    color: white;
  }
`;

const CommentsSection = styled.div`
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#F5F0FF"};
  border-radius: 12px;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  font-weight: 600;
  font-size: 1.2rem;
`;

const LoadingSpinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${({ $isDark }) => $isDark ? "#252f3d" : "#E6E6FA"};
  border-top: 5px solid ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  border-radius: 50%;
  animation: ${LoadingSpinner} 1s linear infinite;
  margin-right: 20px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "#ffdddd"};
  border-radius: 8px;
  color: #d32f2f;
  text-align: center;
  font-weight: 500;
  margin-bottom: 20px;
`;

const VideoFrame = styled.video`
  max-height: 410px;
  width: 100%;
  object-fit: contain;
`;

const ImageFrame = styled.img`
  max-height: 800px;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

// ─── Composant Video ───────────────────────────────────────────────────────
const Video = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);

  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { isDark } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchStart());
      setLoading(true);
      setError(null);

      try {
        const videoRes = await axios.get(`${url}/videos/find/${path}`);
        dispatch(fetchSuccess(videoRes.data));
        await axios.put(`${url}/videos/view/${path}`);

        try {
          const channelRes = await axios.get(`${url}/users/find/${videoRes.data.userId}`);
          setChannel(channelRes.data);
        } catch (channelErr) {
          console.warn("Erreur chargement canal:", channelErr);
        }
      } catch (err) {
        dispatch(fetchFailure(err.message));
        setError("Impossible de charger la vidéo. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, dispatch]);

  useEffect(() => {
    setIsSubscribed(currentUser?.subscribedUsers?.includes(channel?._id));
  }, [currentUser?.subscribedUsers, channel?._id]);

  const handleLike = async () => {
    if (!currentUser || !currentVideo?._id) return;
    try {
      await axios.put(`${url}/users/like/${currentVideo._id}`, {}, { withCredentials: true });
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error("Erreur Like :", err);
    }
  };

  const handleDislike = async () => {
    if (!currentUser || !currentVideo?._id) return;
    try {
      await axios.put(`${url}/users/dislike/${currentVideo._id}`, {}, { withCredentials: true });
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error("Erreur Dislike :", err);
    }
  };

  const handleSub = async () => {
    try {
      if (!channel?._id) return;
      if (isSubscribed) {
        await axios.put(`${url}/users/unsub/${channel._id}`, {}, { withCredentials: true });
      } else {
        await axios.put(`${url}/users/sub/${channel._id}`, {}, { withCredentials: true });
      }
      setIsSubscribed(!isSubscribed);
      const channelRes = await axios.get(`${url}/users/find/${channel._id}`);
      setChannel(channelRes.data);
      dispatch(subscription(channel._id));
    } catch (error) {
      console.error("Erreur abonnement :", error);
    }
  };

  const handleView = () => {
    if (!currentVideo?._id) return;
    const videoId = currentVideo._id;
    const roomId = uuidv4();
    navigate(`/watchparty/${roomId}?videoId=${videoId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Regarde cette vidéo sur GlobeTube",
        text: "Viens voir cette vidéo !",
        url: window.location.href,
      }).then(() => console.log("Partage réussi"))
        .catch((error) => console.error("Erreur partage :", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié ! Partage-le manuellement");
    }
  };

  return (
    <Container $isDark={isDark}>
      <Content $isDark={isDark}>
        <VideoWrapper $isDark={isDark}>
          {loading ? (
            <LoadingContainer $isDark={isDark}>
              <Spinner $isDark={isDark} />
              Chargement de la vidéo...
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage $isDark={isDark}>{error}</ErrorMessage>
          ) : currentVideo?.videoUrl ? (
            <VideoFrame controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()}>
              <source src={currentVideo.videoUrl} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </VideoFrame>
          ) : (
            <ImageFrame src={currentVideo?.imgUrl} alt="Aperçu de la vidéo" />
          )}
        </VideoWrapper>

        <Title $isDark={isDark}>{currentVideo?.title || "Titre de la vidéo"}</Title>

        <Details $isDark={isDark}>
          <Info $isDark={isDark}>
            {currentVideo?.views || 0} vues • {currentVideo?.createdAt ? format(currentVideo.createdAt) : "récemment"}
          </Info>

          <Buttons $isDark={isDark}>
            <Button onClick={handleLike} $isDark={isDark}>
              {currentVideo?.likes?.includes(currentUser?._id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} 
              {currentVideo?.likes?.length || 0}
            </Button>

            <Button onClick={handleDislike} $isDark={isDark}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? <ThumbDownIcon /> : <ThumbDownOffAltOutlinedIcon />} 
              {currentVideo?.dislikes?.length || 0}
            </Button>

            <Button onClick={handleShare} $isDark={isDark}>
              <IconPulse><ReplyOutlinedIcon /></IconPulse> Partager
            </Button>

            <Button $isDark={isDark}>
              <IconPulse><AddTaskOutlinedIcon /></IconPulse> Sauvegarder
            </Button>
          </Buttons>

          <ViewWithFriends onClick={handleView} $isDark={isDark}>
            Regarder avec des amis
          </ViewWithFriends>
        </Details>

        <Hr $isDark={isDark} />

        <Channel $isDark={isDark}>
          <Link to={`/dashbord/${channel?._id}`} style={{ textDecoration: "none" }}>
            <ChannelInfo>
              <Image src={channel?.img} alt="Channel" />
              <ChannelDetail $isDark={isDark}>
                <ChannelName $isDark={isDark}>{channel?.name || "Nom de la chaîne"}</ChannelName>
                <ChannelCounter $isDark={isDark}>{channel?.subscribers || 0} abonnés</ChannelCounter>
                <Description $isDark={isDark}>{currentVideo?.desc || "Description de la vidéo"}</Description>
              </ChannelDetail>
            </ChannelInfo>
          </Link>

          <Subscribe onClick={handleSub} $isDark={isDark}>
            {isSubscribed ? "ABONNÉ" : "S'ABONNER"}
          </Subscribe>
        </Channel>

        <Hr $isDark={isDark} />

        <CommentsSection>
          {currentVideo?._id && <Comments videoId={currentVideo._id} />}
        </CommentsSection>
      </Content>

      <Recommendation tags={currentVideo?.tags || []} />
    </Container>
  );
};

export default Video;