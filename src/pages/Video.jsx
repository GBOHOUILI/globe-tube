import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import GlobeTube from "../img/logo.png";
//import Video1 from "../vidéos/Video1.mp4"

// Thème violet
const theme = {
  primaryColor: "#8A2BE2", // Blueviolet
  secondaryColor: "#9370DB", // Medium Purple
  accentColor: "#BA55D3", // Medium orchid
  lightColor: "#E6E6FA", // Lavender
  darkColor: "#4B0082", // Indigo
  textColor: "#2E0854", // Dark violet
};

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

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
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

const Content = styled.div`
  flex: 5;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(138, 43, 226, 0.15);
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(75, 0, 130, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(75, 0, 130, 0.3);
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${theme.darkColor};
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Info = styled.span`
  color: ${theme.primaryColor};
  font-weight: 500;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${theme.darkColor};
  flex-wrap: wrap;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  background-color: ${theme.lightColor};
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(138, 43, 226, 0.2);
  
  &:hover {
    background-color: ${theme.primaryColor};
    color: white;
    box-shadow: 0 4px 10px rgba(138, 43, 226, 0.4);
    transform: translateY(-2px);
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${theme.secondaryColor}, transparent);
`;

const Recommendation = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: ${theme.lightColor};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.1);
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
  border-radius: 50%;
  object-fit: contain;
  border: 3px solid ${theme.primaryColor};
  box-shadow: 0 4px 10px rgba(138, 43, 226, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${theme.darkColor};
`;

const ChannelName = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: ${theme.primaryColor};
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 10px;
  color: ${theme.secondaryColor};
  font-size: 14px;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${theme.textColor};
`;

const Subscribe = styled.button`
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.darkColor});
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 25px;
  height: max-content;
  padding: 12px 25px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(138, 43, 226, 0.6);
    transform: translateY(-3px);
    background: linear-gradient(135deg, ${theme.darkColor}, ${theme.primaryColor});
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(138, 43, 226, 0.3);
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

const RecommendationTitle = styled.h3`
  color: ${theme.primaryColor};
  margin-bottom: 15px;
  font-weight: 600;
`;

const Video = () => {
  useEffect(() => {
    // Force re-rendering to trigger animations if needed
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/D9G1VOjN_84"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
        <Title>Test Video</Title>
        <Details>
          <Info>7,948,154 views • Jun 22, 2022</Info>
          <Buttons>
            <Button>
              <IconPulse>
                <ThumbUpOutlinedIcon />
              </IconPulse> 
              123
            </Button>
            <Button>
              <IconPulse>
                <ThumbDownOffAltOutlinedIcon />
              </IconPulse> 
              Dislike
            </Button>
            <Button>
              <IconPulse>
                <ReplyOutlinedIcon />
              </IconPulse> 
              Share
            </Button>
            <Button>
              <IconPulse>
                <AddTaskOutlinedIcon />
              </IconPulse> 
              Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src= {GlobeTube}/>
            <ChannelDetail>
              <ChannelName>Eldo Dev</ChannelName>
              <ChannelCounter>200K subscribers</ChannelCounter>
              <Description>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Doloribus laborum delectus unde quaerat dolore culpa sit aliquam
                at. Vitae facere ipsum totam ratione exercitationem. Suscipit
                animi accusantium dolores ipsam ut.
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe>SUBSCRIBE</Subscribe>
        </Channel>
        <Hr />
        <CommentsSection>
          <Comments />
        </CommentsSection>
      </Content>
      <Recommendation>
        <RecommendationTitle>Recommandations</RecommendationTitle>
        {[...Array(8)].map((_, i) => (
          <Card type="sm" key={i} />
        ))}
      </Recommendation>
    </Container>
  );
};

export default Video;