import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import GlobeTube from "../img/logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { auth, provider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";
// Thème violet dominant
const theme = {
  primaryColor: "#8A2BE2", // Blueviolet
  secondaryColor: "#9370DB", // Medium Purple
  accentColor: "#BA55D3", // Medium orchid
  lightColor: "#F5F0FF", // Lavender très léger
  darkColor: "#4B0082", // Indigo
  textColor: "#2E0854", // Dark violet
  gradient: "linear-gradient(135deg, #8A2BE2, #4B0082)",
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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${theme.textColor};
  animation: ${fadeIn} 0.8s ease forwards;
  margin-top: -20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  width: 70%;
  margin: 0 auto;
  border: 1px solid ${theme.secondaryColor}40;
  padding: 0px 50px;
  gap: 15px;
  box-shadow: 0 10px 40px rgba(138, 43, 226, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 20px;
    background: ${theme.gradient};

  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(138, 43, 226, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 25px 30px;
    width: 90%;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 32px;
  font-weight: bold;
  color: ${theme.primaryColor};
  animation: ${float} 3s ease-in-out infinite;
  
  span {
    color: ${theme.darkColor};
    margin-bottom: -40px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${theme.darkColor};
  font-weight: 600;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.2s;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 300;
  color: ${theme.secondaryColor};
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.3s;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 12px;
  top: ${props => props.focused || props.hasValue ? '-10px' : '10px'};
  font-size: ${props => props.focused || props.hasValue ? '12px' : '14px'};
  color: ${props => props.focused ? theme.primaryColor : theme.secondaryColor};
  background-color: ${props => props.focused || props.hasValue ? 'white' : 'transparent'};
  padding: 0 5px;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const Input = styled.input`
  border: 2px solid ${props => props.focused ? theme.primaryColor : theme.secondaryColor + '50'};
  border-radius: 25px;
  padding: 12px 20px;
  background-color: white;
  width: 100%;
  color: ${theme.textColor};
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.focused ? `0 0 0 3px ${theme.primaryColor}30` : 'none'};
  
  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
    box-shadow: 0 0 0 3px ${theme.primaryColor}30;
  }
  
  &::placeholder {
    color: transparent;
  }
`;

const Button = styled.button`
  border-radius: 25px;
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background: ${theme.gradient};
  color: white;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4);
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(138, 43, 226, 0.5);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(138, 43, 226, 0.3);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right, 
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.8s;
    opacity: 0;
  }
  
  &:hover:after {
    opacity: 1;
    left: 100%;
    top: 100%;
    transition: all 0.8s;
  }
`;


const More = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 14px;
  color: ${theme.secondaryColor};
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.7s;
`;

const Links = styled.div`
  margin-left: 50px;
  display: flex;
`;

const Link = styled.span`
  margin-left: 30px;
  color: ${theme.primaryColor};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 0;
    background-color: ${theme.primaryColor};
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${theme.darkColor};
    
    &:after {
      width: 100%;
    }
  }
`;

const TabGroup = styled.div`
  display: flex;
  width: 100%;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(138, 43, 226, 0.1);
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  background: ${props => props.active ? theme.gradient : 'white'};
  color: ${props => props.active ? 'white' : theme.secondaryColor};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? theme.gradient : theme.lightColor};
  }
`;

const Img = styled.img`
  margin-top: 40px;
  height: 40px;
`;

const FormContainer = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [focusedInput, setFocusedInput] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });

  const dispatch = useDispatch();


  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try{
      const res = await axios.post("/auth/login", inputs);
      console.log(res.data);
      dispatch(loginSuccess(res.data));
    }catch(err){
       dispatch(loginFailure());
    }
  }
const signInWithGoogle = async () => {
  dispatch(loginStart());
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const res = await axios.post("/auth/google", {
      name: result.user.displayName,
      email: result.user.email,
      img: result.user.photoURL,
    });
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
    console.error(error);
  }
};


  return (
    <Container>
      <Wrapper>
        <Logo>
            <Img src={GlobeTube} />
            <span> GlobeTube</span>
        </Logo>
        
        <TabGroup>
          <Tab 
            active={activeTab === "signin"} 
            onClick={() => setActiveTab("signin")}
          >
            Sign in
          </Tab>
          <Tab 
            active={activeTab === "google"} 
            onClick={signInWithGoogle}
          >
            Signin with Google
          </Tab>
          <Tab 
            active={activeTab === "signup"} 
            onClick={() => setActiveTab("signup")}
          >
            Sign up
          </Tab>
         
        </TabGroup>
        
        {activeTab === "signin" ? (
          <FormContainer>
            <Title>Welcome</Title>
            <SubTitle>Log in to continue</SubTitle>
            
            <InputGroup>
              <InputLabel 
                focused={focusedInput === "email"} 
                hasValue={inputs.email !== ""}
              >
                Email
              </InputLabel>
              <Input 
                name="email"
                type="email"
                value={inputs.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                focused={focusedInput === "email"}
                placeholder="Email"
              />
            </InputGroup>
            
            <InputGroup>
              <InputLabel 
                focused={focusedInput === "password"} 
                hasValue={inputs.password !== ""}
              >
                Password
              </InputLabel>
              <Input 
                name="password"
                type="password"
                value={inputs.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                focused={focusedInput === "password"}
                placeholder="Password"
              />
            </InputGroup>
            <Button onClick={handleLogin}>Sign In</Button>
          </FormContainer>
        ) : (
          <FormContainer>
            <Title>Create an account</Title>
            <SubTitle>Join the Globe Tube community</SubTitle>
            <InputGroup>
              <InputLabel 
                focused={focusedInput === "name"} 
                hasValue={inputs.name !== ""}
              >
                User name
              </InputLabel>
              <Input 
                name="name"
                value={inputs.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                focused={focusedInput === "name"}
                placeholder="User name"
              />
            </InputGroup>
            
            <InputGroup>
              <InputLabel 
                focused={focusedInput === "email"} 
                hasValue={inputs.email !== ""}
              >
                Email
              </InputLabel>
              <Input 
                name="email"
                type="email"
                value={inputs.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                focused={focusedInput === "email"}
                placeholder="Email"
              />
            </InputGroup>
            
            <InputGroup>
              <InputLabel 
                focused={focusedInput === "password"} 
                hasValue={inputs.password !== ""}
              >
                Password
              </InputLabel>
              <Input 
                name="password"
                type="password"
                value={inputs.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                focused={focusedInput === "password"}
                placeholder="Password"
              />
            </InputGroup>
            
            <Button>Sign Up</Button>
          </FormContainer>
        )}

<More>
        Français (FR)
        <Links>
          <Link>Aide</Link>
          <Link>Confidentialité</Link>
          <Link>Conditions</Link>
        </Links>
      </More>
      </Wrapper>
      

    </Container>
  );
};

export default SignIn;