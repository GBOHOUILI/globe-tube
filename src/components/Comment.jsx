import React from "react";
import styled from "styled-components";
import avatar from "../img/Avatar.jpeg";

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

const Comment = () => {
  return (
    <Container>
      <Avatar src={avatar} />
      <Details>
        <Name>
          John Doe <Date>1 day ago</Date>
        </Name>
        <Text>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel, ex
          laboriosam ipsam aliquam voluptatem perferendis provident modi, sequi
          tempore reiciendis quod, optio ullam cumque? Quidem numquam sint
          mollitia totam reiciendis?
        </Text>
      </Details>
    </Container>
  );
};

export default Comment;
