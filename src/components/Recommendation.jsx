import React, { useEffect, useState } from "react";
import axios from 'axios';
import Card from "../components/Card";
import styled, { keyframes } from "styled-components";

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

const Container = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const Recommendation = ({tags}) => {
    const [videos,setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/tags?tags=${tags}`)
            setVideos(res.data)
        };
        fetchVideos();
    }, [tags]);

    return (
        <Container>
            {videos.map(video=> {
                <Card type="sm" key={video._id}  video={video}/>
            })}
        </Container>
    )
}
export default Recommendation