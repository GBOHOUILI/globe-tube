import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
const url="https://bakend-globe-tube.onrender.com/api";

const theme = {
  primaryColor: '#8A2BE2',
  secondaryColor: '#9370DB',
  accentColor: '#BA55D3',
  lightColor: '#E6E6FA',
  darkColor: '#4B0082',
  textColor: '#2E0854',
  errorColor: '#d32f2f',
};

// Styled components
const ProfileContainer = styled.div`
  position: relative;
  padding: 0;
  width: 90%;
  margin: 20px auto;
  background: linear-gradient(135deg, ${theme.lightColor} 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 768px) {
    margin: 10px;
    padding: 16px;
  }
`;

const ProfileHeader = styled.div`
padding:20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 40%;
  object-fit: cover;
  border: 3px solid ${theme.primaryColor};
  background: ${theme.lightColor};

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.textColor};
  margin: 0 0 8px;
`;

const Email = styled.p`
  font-size: 0.95rem;
  color: ${theme.textColor}80;
  margin: 0 0 8px;
`;

const Description = styled.div`
  font-size: 0.95rem;
  color: ${theme.textColor};
  background: ${theme.lightColor}40;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${theme.primaryColor}20;
  box-shadow: 0 2px 6px rgba(138, 43, 226, 0.1);
  line-height: 1.4;
  max-height: 120px;
  overflow-y: auto;
  margin: 0 0 12px;

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
`;

const Stat = styled.p`
  font-size: 0.9rem;
  color: ${theme.textColor}80;
  margin: 0;

  span {
    font-weight: 600;
    color: ${theme.textColor};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
  color: white;
  margin-left:120px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${theme.darkColor}, ${theme.primaryColor});
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(138, 43, 226, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: 0 2px 6px rgba(138, 43, 226, 0.2);
  }
`;

const SubscribeButton = styled(EditButton)`
  background: ${props =>
    props.isSubscribed
      ? 'linear-gradient(135deg, #808080, #a9a9a9)'
      : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`};

  &:hover:not(:disabled) {
    background: ${props =>
      props.isSubscribed
        ? 'linear-gradient(135deg, #696969, #808080)'
        : `linear-gradient(135deg, ${theme.darkColor}, ${theme.primaryColor})`};
  }
`;

const VideosSection = styled.section`
  box-shadow: 0 6px 6px rgba(138, 43, 226, 0.1);
  height:100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px 60px;
  margin-top: 24px;
  border-radius: 20px;
  border: 2px solid ${theme.primaryColor}10;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const VideosTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.textColor};
  margin: 16px;
`;

const VideosGrid = styled.div`
width:100%;
    display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 50px;
`;


const VideoCardWrapper = styled.div`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color:none;

  &:hover {
    transform: translateY(-4px);
  }
`;

const NoVideosMessage = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: ${theme.textColor}80;
  padding: 20px;
  background: ${theme.lightColor}40;
  border-radius: 8px;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormInput = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid ${theme.lightColor}60;
  background: #fff;
  font-size: 0.95rem;
  color: ${theme.textColor};
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px ${theme.accentColor}20;
  }
`;

const FormTextarea = styled.textarea`
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid ${theme.lightColor}60;
  background: #fff;
  font-size: 0.95rem;
  color: ${theme.textColor};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px ${theme.accentColor}20;
  }
`;

const FormFileInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 2px solid ${theme.lightColor}60;
  background: #fff;
  font-size: 0.95rem;
  color: ${theme.textColor};
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px ${theme.accentColor}20;
  }

  &::file-selector-button {
    background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, ${theme.darkColor}, ${theme.primaryColor});
    }
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled(EditButton)`
  background: linear-gradient(135deg, #ffffff, ${theme.lightColor});
  color: ${theme.textColor};
  border: 1px solid ${theme.lightColor}60;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${theme.lightColor}, #ffffff);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: ${theme.errorColor};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  border-left: 4px solid ${theme.errorColor};
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1rem;
  color: ${theme.textColor};
  padding: 20px;
  background: ${theme.lightColor}20;
  border-radius: 8px;
`;

function UserProfile() {
  const { userId } = useParams();
  const currentUser = useSelector(state => state.user.currentUser);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    img: '',
    password: '',
    passwordConfirm: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);

  const isOwnProfile = currentUser && userId === currentUser._id;
  const isSubscribed = user?.subscribedUsers?.includes(currentUser?._id);

  // Fetch user data
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${url}/users/find/${userId}`)
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          description: res.data.description || '',
          img: res.data.img || '',
          password: '',
          passwordConfirm: '',
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement profil:', err);
        setError('Impossible de charger le profil. Veuillez réessayer.');
        setIsLoading(false);
      });
  }, [userId]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      setVideosLoading(true);
      setVideosError(null);
      try {
        const res = await axios.get(`${url}/videos/user/${userId}`);
        setVideos(res.data || []);
        setVideosLoading(false);
      } catch (err) {
        console.error('Erreur chargement vidéos:', err);
        setVideosError('Impossible de charger les vidéos. Veuillez réessayer.');
        setVideosLoading(false);
      }
    };
    fetchVideos();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Veuillez sélectionner une image (JPEG, PNG, GIF).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image doit être inférieure à 5 Mo.');
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubscribeToggle = async () => {
    try {
      const endpoint = isSubscribed ? `${url}/users/unsub/${userId}` : `${url}/users/sub/${userId}`;
      const res = await axios.put(endpoint);
      setUser(res.data);
    } catch (err) {
      console.error('Erreur abonnement:', err);
      setError(`Échec de ${isSubscribed ? 'la désinscription' : 'l\'abonnement'}. Veuillez réessayer.`);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Le nom d\'utilisateur est requis.';
    }
    if (!formData.email.trim()) {
      return 'L\'adresse e-mail est requise.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Veuillez entrer une adresse e-mail valide.';
    }
    if (formData.password || formData.passwordConfirm) {
      if (formData.password !== formData.passwordConfirm) {
        return 'Les mots de passe ne correspondent pas.';
      }
      if (formData.password.length < 6) {
        return 'Le mot de passe doit contenir au moins 6 caractères.';
      }
    }
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let updatedImg = formData.img;

      // Upload image to Cloudinary if a new file is selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('upload_preset', 'gbobe_tube');
        const cloudName = 'duptzhpjl';
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          uploadData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        updatedImg = uploadRes.data.secure_url;
      }

      // Update profile
      const updateData = {
        name: formData.name,
        email: formData.email,
        description: formData.description,
        img: updatedImg,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await axios.put(`${url}/users/${userId}`, updateData);
      setUser(res.data);
      setIsEditing(false);
      setImageFile(null);
      setFormData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError('Échec de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingMessage>Chargement du profil...</LoadingMessage>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <ErrorMessage>Profil non trouvé.</ErrorMessage>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer role="main" aria-label="Profil utilisateur">
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <ProfileHeader>
        <ProfilePicture
          src={user.img || `https://via.placeholder.com/80/8A2BE2/ffffff?text=${encodeURIComponent(user.name?.charAt(0).toUpperCase() || 'U')}`}
          alt={`Photo de profil de ${user.name || 'Utilisateur'}`}
          onError={e => {
            e.target.src = `https://via.placeholder.com/80/8A2BE2/ffffff?text=${encodeURIComponent(user.name?.charAt(0).toUpperCase() || 'U')}`;
          }}
        />
        <ProfileInfo>
          <Username>{user.name || 'Utilisateur'}</Username>
          <Email>{user.email}</Email>
          <Description>{user.description || 'Aucune description disponible.'}</Description>
          <Stats>
            <Stat>
              Abonnés: <span>{user.subscribers || 0}</span>
            </Stat>
            <Stat>
              Abonnements: <span>{user.subscribedUsers?.length || 0}</span>
            </Stat>
          </Stats>
        </ProfileInfo>
      </ProfileHeader>

      <ActionButtons>
        {isOwnProfile ? (
          !isEditing && (
            <EditButton onClick={handleEditToggle} aria-label="Modifier le profil">
              Edit profil
            </EditButton>
          )
        ) : (
          <SubscribeButton
            isSubscribed={isSubscribed}
            onClick={handleSubscribeToggle}
            aria-label={isSubscribed ? 'Se désabonner' : 'S\'abonner'}
          >
            {isSubscribed ? 'Se désabonner' : 'S\'abonner'}
          </SubscribeButton>
        )}
      </ActionButtons>



      {isEditing && (
        <EditForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nom d'utilisateur"
            aria-label="Nom d'utilisateur"
            maxLength={50}
          />
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Adresse e-mail"
            aria-label="Adresse e-mail"
          />
          <FormInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Nouveau mot de passe"
            aria-label="Nouveau mot de passe"
            minLength={6}
          />
          <FormInput
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            placeholder="Confirmer le mot de passe"
            aria-label="Confirmer le mot de passe"
            minLength={6}
          />
          <FormTextarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            aria-label="Description du profil"
            maxLength={1000}
          />
          <FormFileInput
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            aria-label="Télécharger une photo de profil"
          />
          <FormButtons>
            <CancelButton type="button" onClick={handleEditToggle} aria-label="Annuler les modifications">
              Annuler
            </CancelButton>
            <EditButton type="submit" aria-label="Enregistrer les modifications">
              Enregistrer
            </EditButton>
          </FormButtons>
        </EditForm>
      )}
              <VideosTitle>Vidéos de {user.name || 'Utilisateur'}</VideosTitle>
            <VideosSection>
        {videosLoading ? (
          <LoadingMessage>Chargement des vidéos...</LoadingMessage>
        ) : videosError ? (
          <ErrorMessage>{videosError}</ErrorMessage>
        ) : videos.length === 0 ? (
          <NoVideosMessage>Aucune vidéo publiée.</NoVideosMessage>
        ) : (
          <VideosGrid>
            {videos.map(video => (
              <VideoCardWrapper key={video._id}>
                <Card video={video} />
              </VideoCardWrapper>
            ))}
          </VideosGrid>
        )}
      </VideosSection>
    </ProfileContainer>
    
  );
}

export default UserProfile;