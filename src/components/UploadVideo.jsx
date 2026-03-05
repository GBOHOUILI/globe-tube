import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

const url = process.env.REACT_APP_API_URL;

// Animation fadeIn (inchangée)
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

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const Container = styled.div`
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: cnter;
  background-color: ${({ $isDark }) => $isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)'};
  backdrop-filter: blur(3px);
`;

const Wrapper = styled.div`
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${({ $isDark }) => $isDark ? '#161b22' : 'white'};
  border-radius: 12px;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2E0854'};
  width: 50%;
  padding: 20px 50px;
  gap: 15px;
  box-shadow: ${({ $isDark }) => $isDark 
    ? '0 10px 40px rgba(0,0,0,0.7)' 
    : '0 10px 40px rgba(138,43,226,0.2)'};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
  position: absolute;
  cursor: move;
  @media (max-width: 768px) {
    padding: 25px 30px;
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#8A2BE2'};
  font-weight: 600;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#2E085499'};
  margin-top: 0;
  margin-bottom: 15px;
`;

const Close = styled.div`
  width: 36px;
  height: 36px;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#4B0082'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ $isDark }) => $isDark ? '#252f3d' : '#E6E6FA'};
    color: red;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${({ $isDark }) => $isDark ? '#c084fc' : '#4B0082'};
  margin-left: 2px;
`;

const Input = styled.input`
  border: 2px solid ${({ $isDark }) => $isDark ? 'rgba(148,163,184,0.3)' : '#9370DB40'};
  border-radius: 10px;
  padding: 14px 20px;
  width: 100%;
  font-size: 16px;
  background: ${({ $isDark }) => $isDark ? '#1e2535' : 'white'};
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2E0854'};
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #8A2BE2;
    box-shadow: 0 0 0 2px ${({ $isDark }) => $isDark ? 'rgba(138,43,226,0.4)' : 'rgba(138,43,226,0.3)'};
  }
  &::placeholder {
    color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#7b7b7b'};
  }
`;

const Desc = styled.textarea`
  border: 2px solid ${({ $isDark }) => $isDark ? 'rgba(148,163,184,0.3)' : '#9370DB40'};
  border-radius: 10px;
  padding: 14px 20px;
  width: 100%;
  font-size: 16px;
  min-height: 120px;
  background: ${({ $isDark }) => $isDark ? '#1e2535' : 'white'};
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2E0854'};
  transition: all 0.3s ease;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #8A2BE2;
    box-shadow: 0 0 0 2px ${({ $isDark }) => $isDark ? 'rgba(138,43,226,0.4)' : 'rgba(138,43,226,0.3)'};
  }
  &::placeholder {
    color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#7b7b7b'};
  }
`;

const FileDropZone = styled.div`
  border: 2px dashed ${({ isDragging, fileSelected, $isDark }) =>
    fileSelected ? '#BA55D3' : isDragging ? '#8A2BE2' : $isDark ? 'rgba(148,163,184,0.5)' : '#9370DB80'};
  border-radius: 16px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  background-color: ${({ isDragging, fileSelected, $isDark }) =>
    fileSelected ? ($isDark ? '#252f3d' : '#f0e6ff') : isDragging ? ($isDark ? '#2d3748' : '#ede7f6') : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  &:hover {
    background-color: ${({ $isDark }) => $isDark ? '#252f3d' : '#E6E6FA'};
    border-color: #8A2BE2;
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: ${({ fileSelected }) => fileSelected ? '#8A2BE2' : '#9370DB'};
`;

const UploadText = styled.div`
  margin-bottom: 12px;
  font-weight: ${({ fileSelected }) => (fileSelected ? "500" : "400")};
  color: ${({ $isDark }) => $isDark ? '#cbd5e1' : '#444'};
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.div`
  background-color: ${({ $isDark }) => $isDark ? '#252f3d' : '#E6E6FA'};
  color: #8A2BE2;
  border-radius: 50px;
  padding: 6px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    cursor: pointer;
    font-weight: bold;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ $isDark }) => $isDark ? '#2d3748' : '#E6E6FA'};
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #8A2BE2;
  width: ${({ value }) => `${value}%`};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Button = styled.button`
  border-radius: 50px;
  border: none;
  padding: 14px 30px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #8A2BE2, #BA55D3);
  color: white;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(138, 43, 226, 0.3);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const FileName = styled.div`
  font-size: 14px;
  color: #8A2BE2;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  svg { color: #BA55D3; }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px solid ${({ $isDark }) => $isDark ? '#4b5563' : '#d1d5db'};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const SecondaryButton = styled(Button)`
  background: ${({ $isDark }) => $isDark ? '#252f3d' : 'white'};
  color: #8A2BE2;
  border: 2px solid ${({ $isDark }) => $isDark ? '#4b5563' : '#9370DB60'};
  box-shadow: none;
  &:hover {
    background: ${({ $isDark }) => $isDark ? '#2d3748' : '#E6E6FA'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ $isDark }) => $isDark ? 'rgba(138,43,226,0.3)' : 'rgba(138,43,226,0.15)'};
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: ${({ type }) => (type === "success" ? "#4CAF50" : "#F44336")};
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease;
  z-index: 10000;
`;

// ─── Composant UploadVideo ─────────────────────────────────────────────────
const UploadVideo = ({ setOpen }) => {
  const [video, setVideo] = useState(null);
  const [img, setImg] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [currentTag, setCurrentTag] = useState("");
  const [imgPreview, setImgPreview] = useState(null);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Récupération du thème global
  const { isDark } = useTheme();

  // Drag du modal
  const startDrag = (e) => {
    if (e.target === wrapperRef.current || wrapperRef.current.contains(e.target)) {
      pos.current = {
        x: e.clientX - wrapperRef.current.offsetLeft,
        y: e.clientY - wrapperRef.current.offsetTop,
      };
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    }
  };

  const onDrag = (e) => {
    wrapperRef.current.style.left = `${e.clientX - pos.current.x}px`;
    wrapperRef.current.style.top = `${e.clientY - pos.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  // Gestion des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title': setTitle(value); break;
      case 'desc': setDesc(value); break;
      case 'tags': setCurrentTag(value); break;
      default: break;
    }
  };

  // Gestion des tags
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Gestion des fichiers
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      setVideoUrl(null);
      setVideoProgress(0);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImg(file);
      setImgUrl(null);
      setImgProgress(0);
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Soumettre les données
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video) {
      alert("Titre et vidéo requis");
      return;
    }

    setLoading(true);
    setSubmitProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("tags", JSON.stringify(tags));
    formData.append("video", video);
    if (img) formData.append("img", img);

    try {
      const res = await axios.post(`${url}/videos`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setSubmitProgress(percent);
        },
      });

      navigate(`/videos/${res.data._id}`);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (video || img || title || desc || tags.length > 0) {
      if (window.confirm("Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.")) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <Container onMouseDown={startDrag}>
      <Wrapper ref={wrapperRef} $isDark={isDark}>
        <Close onClick={handleCancel} $isDark={isDark}>×</Close>

        <Title $isDark={isDark}>Télécharger une vidéo</Title>
        <Subtitle $isDark={isDark}>Partagez votre contenu avec la communauté</Subtitle>

        <FormGroup>
          <Label $isDark={isDark}>Vidéo :</Label>
          <FileDropZone
            isDragging={isDraggingVideo}
            fileSelected={!!video}
            $isDark={isDark}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
            onDragLeave={() => setIsDraggingVideo(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingVideo(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("video/")) {
                setVideo(file);
                setVideoUrl(null);
                setVideoProgress(0);
              }
            }}
          >
            <UploadIcon fileSelected={!!video} $isDark={isDark}>
              {video ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              )}
            </UploadIcon>
            <UploadText fileSelected={!!video} $isDark={isDark}>
              {video ? "Vidéo prête à télécharger" : "Glissez-déposez votre vidéo ici ou cliquez pour sélectionner"}
            </UploadText>
            <FileInput
              name="video"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />
          </FileDropZone>

          {video && (
            <>
              <FileName $isDark={isDark}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                {video.name}
              </FileName>
              <ProgressBar $isDark={isDark}>
                <Progress value={videoProgress} />
              </ProgressBar>
            </>
          )}
        </FormGroup>

        <FormGroup>
          <Label $isDark={isDark}>Titre :</Label>
          <Input
            name="title"
            type="text"
            placeholder="Titre de votre vidéo"
            value={title}
            onChange={handleChange}
            required
            $isDark={isDark}
          />
        </FormGroup>

        <FormGroup>
          <Label $isDark={isDark}>Description :</Label>
          <Desc
            name="desc"
            placeholder="Décrivez votre vidéo..."
            rows={5}
            value={desc}
            onChange={handleChange}
            $isDark={isDark}
          />
        </FormGroup>

        <FormGroup>
          <Label $isDark={isDark}>Tags :</Label>
          <Input
            name="tags"
            type="text"
            placeholder="Ajouter un tag et appuyer sur Entrée"
            value={currentTag}
            onChange={handleChange}
            onKeyDown={handleAddTag}
            $isDark={isDark}
          />
          {tags.length > 0 && (
            <TagsContainer>
              {tags.map((tag, index) => (
                <Tag key={index} $isDark={isDark}>
                  {tag} <span onClick={() => handleRemoveTag(tag)}>×</span>
                </Tag>
              ))}
            </TagsContainer>
          )}
        </FormGroup>

        <FormGroup>
          <Label $isDark={isDark}>Image de couverture (Thumbnail) :</Label>
          <FileDropZone
            isDragging={isDraggingImg}
            fileSelected={!!img}
            $isDark={isDark}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingImg(true); }}
            onDragLeave={() => setIsDraggingImg(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImg(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                setImg(file);
                setImgUrl(null);
                setImgProgress(0);
                const reader = new FileReader();
                reader.onloadend = () => setImgPreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          >
            <UploadIcon fileSelected={!!img} $isDark={isDark}>
              {img ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              )}
            </UploadIcon>
            <UploadText fileSelected={!!img} $isDark={isDark}>
              {img ? "Image prête à télécharger" : "Glissez-déposez votre image de couverture ici ou cliquez pour sélectionner"}
            </UploadText>
            <FileInput
              name="img"
              type="file"
              accept="image/*"
              onChange={handleImgChange}
            />
          </FileDropZone>

          {img && (
            <>
              <FileName $isDark={isDark}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                {img.name}
              </FileName>
              <ProgressBar $isDark={isDark}>
                <Progress value={imgProgress} />
              </ProgressBar>
              {imgPreview && (
                <PreviewImage src={imgPreview} alt="Aperçu de la miniature" $isDark={isDark} />
              )}
            </>
          )}
        </FormGroup>

        <ButtonsContainer>
          <SecondaryButton onClick={handleCancel} $isDark={isDark}>
            Annuler
          </SecondaryButton>

          <Button
            onClick={handleSubmit}
            disabled={loading || !title || !video}
            $isDark={isDark}
          >
            {loading ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Publier la vidéo
              </>
            )}
          </Button>
        </ButtonsContainer>

        {loading && submitProgress > 0 && (
          <ProgressBar $isDark={isDark}>
            <Progress value={submitProgress} />
          </ProgressBar>
        )}
      </Wrapper>

      {notification.show && (
        <Notification type={notification.type}>
          {notification.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          {notification.message}
        </Notification>
      )}
    </Container>
  );
};

export default UploadVideo;