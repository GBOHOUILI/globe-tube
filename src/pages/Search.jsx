import React, { useState, useEffect } from "react";
import axios from 'axios';
import Card from "../components/Card";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
const url = process.env.REACT_APP_API_URL;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 50px
`;


const Search = () => {
    const [videos, setVideos] = useState([]);
    const query = useLocation().search;
    useEffect( () => {
      const fetchVideos = async () => {
        const res = await axios.get(`${url}/videos/search/${query}`);
        setVideos(res.data)
      }
      fetchVideos()
    },[query]
    )
    return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
    )
}

export default Search;