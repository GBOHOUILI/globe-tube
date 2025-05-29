import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
const url="https://bakend-globe-tube.onrender.com/api";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 50px
`;

const Home = ({type}) => {

  const [videos, setVideos] = useState([])

useEffect( () => {
  const fetchVideos = async () => {
    const res = await axios.get(`${url}/videos/${type}`);
    setVideos(res.data)
  }
  fetchVideos()
},[type]
)

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
