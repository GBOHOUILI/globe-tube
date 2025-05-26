import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



const theme = {
  primaryColor: "#8A2BE2",
  secondaryColor: "#9370DB",
  accentColor: "#BA55D3",
  lightColor: "#E6E6FA",
  darkColor: "#4B0082",
  textColor: "#2E0854",
};

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
  width: 100vw;
  height: 100%;
  position: fixed; 
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${theme.textColor};
  backdrop-filter: blur(3px);
`;

const Wrapper = styled.div`
  top:10px;
  left:200px;
  margin:0 auto;
  overflow:hiden;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  color: ${theme.textColor};
  width: 50%;
  padding: 20px 50px;
  gap: 15px;
  box-shadow: 0 10px 40px rgba(138, 43, 226, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
  position: absolute;
  cursor: move;

  @media (max-width: 768px) {
    padding: 25px 30px;
    width: 90%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.lightColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.secondaryColor};
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 25px 30px;
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${theme.primaryColor};
  font-weight: 600;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.textColor}99;
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
  color: ${theme.darkColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.lightColor};
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
  color: ${theme.darkColor};
  margin-left: 2px;
`;

const Input = styled.input`
  border: 2px solid ${theme.secondaryColor + "40"};
  border-radius: 10px;
  padding: 14px 20px;
  width: 100%;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
    box-shadow: 0 0 0 2px ${theme.primaryColor + "30"};
  }
  
  &::placeholder {
    color: #7b7b7b;
  }
`;

const Desc = styled.textarea`
  border: 2px solid ${theme.secondaryColor + "40"};
  border-radius: 10px;
  padding: 14px 20px;
  width: 100%;
  font-size: 16px;
  min-height: 120px;
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
    box-shadow: 0 0 0 2px ${theme.primaryColor + "30"};
  }
  
  &::placeholder {
    color: #7b7b7b;
  }
`;

const FileDropZone = styled.div`
  border: 2px dashed ${({ isDragging, fileSelected }) => 
    fileSelected ? theme.accentColor : isDragging ? theme.primaryColor : theme.secondaryColor + "80"};
  border-radius: 16px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  background-color: ${({ isDragging, fileSelected }) =>
    fileSelected ? "#f0e6ff" : isDragging ? "#ede7f6" : "transparent"};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: ${theme.lightColor};
    border-color: ${theme.primaryColor};
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: ${({ fileSelected }) => fileSelected ? theme.primaryColor : theme.secondaryColor};
`;

const UploadText = styled.div`
  margin-bottom: 12px;
  font-weight: ${({ fileSelected }) => (fileSelected ? "500" : "400")};
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
  background-color: ${theme.lightColor};
  color: ${theme.primaryColor};
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
  background-color: ${theme.lightColor};
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${theme.primaryColor};
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
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
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
  color: ${theme.primaryColor};
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  
  svg {
    color: ${theme.accentColor};
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-top: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: ${theme.primaryColor};
  border: 2px solid ${theme.primaryColor + "60"};
  box-shadow: none;
  
  &:hover {
    background: ${theme.lightColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.15);
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease;
  z-index: 10000;
`;

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

  // Fonctions pour le drag du modal
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
    
    switch(name) {
      case 'title':
        setTitle(value);
        break;
      case 'desc':
        setDesc(value);
        break;
      case 'tags':
        setCurrentTag(value);
        break;
      default:
        break;
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

  // Upload des fichiers vers Cloudinary
  const uploadFile = async (file, setProgress, type) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gbobe_tube");

    const cloudName = "duptzhpjl";

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );
      
      console.log(`Upload ${type} success:`, res.data.secure_url);
      setNotification({
        show: true, 
        message: `${type === 'video' ? 'Vidéo' : 'Image'} téléchargé avec succès!`,
        type: "success"
      });
      
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
            console.log(res.data.secure_url);
      return res.data.secure_url;
    } catch (err) {
      console.error(`Erreur lors de l'upload ${type}:`, err);
      setNotification({
        show: true, 
        message: `Erreur lors du téléchargement ${type === 'video' ? 'de la vidéo' : 'de l\'image'}`,
        type: "error"
      });
      
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      return null;
    }
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
      
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload automatique après la sélection des fichiers
  useEffect(() => {
    const uploadVideoFile = async () => {
      if (video) {
        const url = await uploadFile(video, setVideoProgress, 'videoUrl');
        setVideoUrl(url);
      }
    };
    
    uploadVideoFile();
  }, [video]);

  useEffect(() => {
    const uploadImgFile = async () => {
      if (img) {
        const url = await uploadFile(img, setImgProgress, 'imageUrl');
        setImgUrl(url);
      }
    };
    
    uploadImgFile();
  }, [img]);

  // Soumettre les données au backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoUrl) {
      setNotification({
        show: true, 
        message: "Le titre et la vidéo sont requis!",
        type: "error"
      });
      
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      return;
    }
    
    setLoading(true);
    
    const videoData = {
      title,
      desc,
      tags,
      videoUrl,
      imgUrl: imgUrl || "",
    };
    
    try {
  
      const response = await axios.post('/videos', videoData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setSubmitProgress(percentCompleted);
        }
      });

      
      console.log('Vidéo soumise avec succès:', response.data);
      
      setNotification({
        show: true, 
        message: "Vidéo téléchargée avec succès!",
        type: "success"
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        setOpen(false);
        navigate(`videos/${response.data._id}`)
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      
      setNotification({
        show: true, 
        message: "Erreur lors de l'envoi au serveur. Veuillez réessayer.",
        type: "error"
      });
      
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    } finally {
      setLoading(false);
      setSubmitProgress(0);
    }
  };

  const handleCancel = () => {
    if (video || img || title || desc || tags.length > 0) {
      if (window.confirm("Êtes-vous sûr de vouloir annuler? Toutes les données seront perdues.")) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <Container>
      <Wrapper ref={wrapperRef} onMouseDown={startDrag}>
        <Close onClick={handleCancel}>×</Close>
        <Title>Télécharger une vidéo</Title>
        <Subtitle>Partagez votre contenu avec la communauté</Subtitle>

        <FormGroup>
          <Label>Vidéo:</Label>
          <FileDropZone
            isDragging={isDraggingVideo}
            fileSelected={!!video}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingVideo(true);
            }}
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
            <UploadIcon fileSelected={!!video}>
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
            <UploadText fileSelected={!!video}>
              {video 
                ? "Vidéo prête à télécharger" 
                : "Glissez-déposez votre vidéo ici ou cliquez pour sélectionner"}
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
              <FileName>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                {video.name}
              </FileName>
              <ProgressBar>
                <Progress value={videoProgress} />
              </ProgressBar>
            </>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Titre:</Label>
          <Input
            name="title"
            type="text"
            placeholder="Titre de votre vidéo"
            value={title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description:</Label>
          <Desc
            name="desc"
            placeholder="Décrivez votre vidéo..."
            rows={5}
            value={desc}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Tags:</Label>
          <Input
            name="tags"
            type="text"
            placeholder="Ajouter un tag et appuyer sur Entrée"
            value={currentTag}
            onChange={handleChange}
            onKeyDown={handleAddTag}
          />
          {tags.length > 0 && (
            <TagsContainer>
              {tags.map((tag, index) => (
                <Tag key={index}>
                  {tag} <span onClick={() => handleRemoveTag(tag)}>×</span>
                </Tag>
              ))}
            </TagsContainer>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Image de couverture (Thumbnail):</Label>
          <FileDropZone
            isDragging={isDraggingImg}
            fileSelected={!!img}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingImg(true);
            }}
            onDragLeave={() => setIsDraggingImg(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImg(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                setImg(file);
                setImgUrl(null);
                setImgProgress(0);
                
                // Créer une URL de prévisualisation
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImgPreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          >
            <UploadIcon fileSelected={!!img}>
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
            <UploadText fileSelected={!!img}>
              {img 
                ? "Image prête à télécharger" 
                : "Glissez-déposez votre image de couverture ici ou cliquez pour sélectionner"}
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
              <FileName>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                {img.name}
              </FileName>
              <ProgressBar>
                <Progress value={imgProgress} />
              </ProgressBar>
              {imgPreview && (
                <PreviewImage src={imgPreview} alt="Aperçu de la miniature" />
              )}
            </>
          )}
        </FormGroup>

        <ButtonsContainer>
          <SecondaryButton onClick={handleCancel}>
            Annuler
          </SecondaryButton>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !title || !videoUrl}
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
          <ProgressBar>
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