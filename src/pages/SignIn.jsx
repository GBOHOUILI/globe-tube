import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

import GlobeTube from "../img/logo.png";

const url = process.env.REACT_APP_API_URL;

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// ─── Styled Components avec thème dynamique ────────────────────────────────
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  animation: ${fadeIn} 0.8s ease forwards;
  margin-top: -20px;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ $isDark }) => $isDark ? "#161b22" : "white"};
  border-radius: 12px;
  width: 70%;
  margin: 0 auto;
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "#9370DB40"};
  padding: 0 50px 50px 50px;
  gap: 15px;
  box-shadow: ${({ $isDark }) => $isDark 
    ? "0 10px 40px rgba(0,0,0,0.6)" 
    : "0 10px 40px rgba(138,43,226,0.2)"};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(135deg, #8A2BE2, #4B0082);
  }
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ $isDark }) => $isDark 
      ? "0 15px 50px rgba(0,0,0,0.7)" 
      : "0 15px 50px rgba(138,43,226,0.3)"};
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
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  animation: ${float} 3s ease-in-out infinite;
  span {
    color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#4B0082"};
    margin-bottom: -40px;
  }
`;

const Img = styled.img`
  margin-top: 40px;
  height: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#4B0082"};
  font-weight: 600;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.2s;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 300;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#9370DB"};
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.3s;
`;

const TabGroup = styled.div`
  display: flex;
  width: 100%;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px ${({ $isDark }) => $isDark ? "rgba(0,0,0,0.6)" : "rgba(138,43,226,0.1)"};
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  background: ${({ active, $isDark }) => active 
    ? "linear-gradient(135deg, #8A2BE2, #4B0082)" 
    : $isDark ? "#1e2535" : "white"};
  color: ${({ active, $isDark }) => active ? "white" : $isDark ? "#94a3b8" : "#9370DB"};
  font-weight: ${({ active }) => (active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ active, $isDark }) => active 
      ? "linear-gradient(135deg, #4B0082, #8A2BE2)" 
      : $isDark ? "#252f3d" : "#F5F0FF"};
  }
`;

const FormContainer = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 12px;
  top: ${({ focused, hasValue }) => (focused || hasValue ? "-10px" : "10px")};
  font-size: ${({ focused, hasValue }) => (focused || hasValue ? "12px" : "14px")};
  color: ${({ focused, $isDark }) => focused 
    ? "#8A2BE2" 
    : $isDark ? "#94a3b8" : "#9370DB"};
  background-color: ${({ focused, hasValue, $isDark }) => 
    focused || hasValue ? ($isDark ? "#161b22" : "white") : "transparent"};
  padding: 0 5px;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const Input = styled.input`
  border: 2px solid ${({ error, focused, $isDark }) => 
    error ? "#ef4444" 
    : focused ? "#8A2BE2" 
    : $isDark ? "rgba(148,163,184,0.4)" : "#9370DB50"};
  border-radius: 25px;
  padding: 12px 20px;
  background-color: ${({ $isDark }) => $isDark ? "#1e2535" : "white"};
  width: 100%;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#2E0854"};
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: ${({ focused, error }) => 
    focused ? `0 0 0 3px ${error ? "#ef444430" : "#8A2BE230"}` 
    : error ? "0 0 0 3px #ef444430" : "none"};
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? "#ef4444" : "#8A2BE2"};
    box-shadow: 0 0 0 3px ${({ error }) => error ? "#ef444430" : "#8A2BE230"};
  }
  &::placeholder { color: transparent; }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 15px;
  animation: ${fadeIn} 0.3s ease forwards;
`;

const ErrorMessage = styled.div`
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "linear-gradient(135deg, #ffebee, #ffcdd2)"};
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  border-left: 4px solid #ef4444;
  width: 100%;
  animation: ${fadeIn} 0.3s ease forwards;
`;

const Button = styled.button`
  border-radius: 25px;
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #8A2BE2, #4B0082);
  color: white;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(138,43,226,0.4);
  width: 100%;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(138,43,226,0.5);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(138,43,226,0.3);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 14px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#9370DB"};
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: 0.7s;
`;

const Links = styled.div`
  margin-left: 50px;
  display: flex;
`;

const StyledLink = styled.span`
  margin-left: 30px;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 0;
    background-color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
    transition: width 0.3s ease;
  }
  &:hover {
    color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#4B0082"};
    &:after { width: 100%; }
  }
`;

// ─── Composant SignIn ──────────────────────────────────────────────────────
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState("signin");
  const [focusedInput, setFocusedInput] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");

  // Validation
  const validateName = (name) => {
    if (!name.trim()) return "Le nom d'utilisateur est requis.";
    const nameRegex = /^[a-zA-Z0-9\s\-_]{3,20}$/;
    if (!nameRegex.test(name)) {
      return "Le nom doit contenir 3 à 20 caractères alphanumériques, espaces, tirets ou underscores.";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "L'adresse e-mail est requise.";
    if (email.length > 100) return "L'adresse e-mail ne doit pas dépasser 100 caractères.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Veuillez entrer une adresse e-mail valide.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Le mot de passe est requis.";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));

    let error = "";
    if (name === "name") error = validateName(value);
    else if (name === "email") error = validateEmail(value);
    else if (name === "password") error = validatePassword(value);

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({ name: "", email: "", password: "" });

    const emailError = validateEmail(inputs.email);
    const passwordError = validatePassword(inputs.password);

    if (emailError || passwordError) {
      setErrors({ name: "", email: emailError, password: passwordError });
      setGeneralError("Veuillez corriger les erreurs ci-dessus.");
      return;
    }

    dispatch(loginStart());
    try {
      const res = await axios.post(`${url}/auth/login`, {
        email: inputs.email,
        password: inputs.password,
      }, { withCredentials: true });

      dispatch(loginSuccess(res.data.user));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      setGeneralError(err.response?.data?.message || "Échec de la connexion. Veuillez réessayer.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({ name: "", email: "", password: "" });

    const nameError = validateName(inputs.name);
    const emailError = validateEmail(inputs.email);
    const passwordError = validatePassword(inputs.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      setGeneralError("Veuillez corriger les erreurs ci-dessus.");
      return;
    }

    dispatch(loginStart());
    try {
      const res = await axios.post(`${url}/auth/register`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      }, { withCredentials: true });

      // ── Après inscription réussie : on pré-remplit le formulaire de login ──
      setInputs({
        name: "",
        email: inputs.email,           // on garde l'email
        password: inputs.password,     // on garde le mot de passe
      });

      // On passe automatiquement sur l'onglet Sign In
      setActiveTab("signin");

      // Petit message de succès
      setGeneralError("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    } catch (err) {
      dispatch(loginFailure());
      setGeneralError(err.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.");
    }
  };

  // ── Google est commenté comme demandé ─────────────────────────────────────
  /*
  const signInWithGoogle = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await axios.post(`${url}/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      }, { withCredentials: true });

      dispatch(loginSuccess(res.data.user));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
      setGeneralError("Échec de la connexion avec Google. Veuillez réessayer.");
    }
  };
  */

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({ name: "", email: "", password: "" });
    setGeneralError("");
    // On ne reset pas les inputs pour garder les identifiants après inscription
  };

  return (
    <Container $isDark={isDark}>
      <Wrapper $isDark={isDark}>
        <Logo $isDark={isDark}>
          <Img src={GlobeTube} />
          <span>GlobeTube</span>
        </Logo>

        <TabGroup $isDark={isDark}>
          <Tab active={activeTab === "signin"} onClick={() => handleTabChange("signin")} $isDark={isDark}>
            Sign in
          </Tab>
          {/* Google commenté */}
          {/* <Tab active={activeTab === "google"} onClick={signInWithGoogle}>
            Sign in with Google
          </Tab> */}
          <Tab active={activeTab === "signup"} onClick={() => handleTabChange("signup")} $isDark={isDark}>
            Sign up
          </Tab>
        </TabGroup>

        {generalError && <ErrorMessage $isDark={isDark} role="alert">{generalError}</ErrorMessage>}

        {activeTab === "signin" ? (
          <FormContainer>
            <Title $isDark={isDark}>Welcome</Title>
            <SubTitle $isDark={isDark}>Log in to continue</SubTitle>

            <InputGroup>
              <InputLabel 
                focused={focusedInput === "email"} 
                hasValue={inputs.email !== ""} 
                $isDark={isDark}
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
                error={errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                $isDark={isDark}
              />
              {errors.email && <ErrorText id="email-error">{errors.email}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <InputLabel 
                focused={focusedInput === "password"} 
                hasValue={inputs.password !== ""} 
                $isDark={isDark}
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
                error={errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                $isDark={isDark}
              />
              {errors.password && <ErrorText id="password-error">{errors.password}</ErrorText>}
            </InputGroup>

            <Button onClick={handleLogin} disabled={errors.email || errors.password}>
              Sign In
            </Button>
          </FormContainer>
        ) : (
          <FormContainer>
            <Title $isDark={isDark}>Create an account</Title>
            <SubTitle $isDark={isDark}>Join the Globe Tube community</SubTitle>

            <InputGroup>
              <InputLabel 
                focused={focusedInput === "name"} 
                hasValue={inputs.name !== ""} 
                $isDark={isDark}
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
                error={errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                $isDark={isDark}
              />
              {errors.name && <ErrorText id="name-error">{errors.name}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <InputLabel 
                focused={focusedInput === "email"} 
                hasValue={inputs.email !== ""} 
                $isDark={isDark}
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
                error={errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                $isDark={isDark}
              />
              {errors.email && <ErrorText id="email-error">{errors.email}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <InputLabel 
                focused={focusedInput === "password"} 
                hasValue={inputs.password !== ""} 
                $isDark={isDark}
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
                error={errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                $isDark={isDark}
              />
              {errors.password && <ErrorText id="password-error">{errors.password}</ErrorText>}
            </InputGroup>

            <Button onClick={handleSignUp} disabled={errors.name || errors.email || errors.password}>
              Sign Up
            </Button>
          </FormContainer>
        )}

        <More $isDark={isDark}>
          Français (FR)
          <Links>
            <StyledLink $isDark={isDark}>Aide</StyledLink>
            <StyledLink $isDark={isDark}>Confidentialité</StyledLink>
            <StyledLink $isDark={isDark}>Conditions</StyledLink>
          </Links>
        </More>
      </Wrapper>
    </Container>
  );
};

export default SignIn;