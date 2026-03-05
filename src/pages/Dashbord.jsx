import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/Card";

// ── Import du ThemeContext ──
import { useTheme } from "../context/ThemeContext";

const API_URL = process.env.REACT_APP_API_URL;

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Styled Components avec thème dynamique ────────────────────────────────
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  font-family: 'DM Sans', system-ui, sans-serif;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  position: relative;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  position: relative;
  z-index: 1;
`;

const CoverBand = styled.div`
  height: 300px;
  background: ${({ $isDark }) => $isDark 
    ? 'linear-gradient(135deg, #4c1d95 0%, #1e293b 50%, #0f1117 100%)' 
    : 'linear-gradient(135deg, #6d28d9 0%, #d5d2d8 50%, #ffffff 100%)'};
  position: relative;
  overflow: hidden;
  border-radius: 20px 0 0;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 20% 50%, rgba(109,40,217,0.4) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 80% 30%, rgba(245,158,11,0.12) 0%, transparent 60%);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
  }
  @media (max-width: 768px) { height: 220px; }
`;

const ProfileRow = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: flex-start;
  gap: 32px;
  margin-top: -80px;
  @media (max-width: 768px) {
    padding: 0 20px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -60px;
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid ${({ $isDark }) => $isDark ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.5)"};
  object-fit: cover;
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "#6d28d9"};
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  position: relative;
  z-index: 1;
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ $isDark }) => $isDark 
      ? "0 0 0 10px rgba(109,40,217,0.3), 0 30px 60px rgba(0,0,0,0.7)" 
      : "0 0 0 10px rgba(109,40,217,0.2), 0 30px 60px rgba(0,0,0,0.6)"};
  }
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const UserInfoBlock = styled.div`
  flex: 1;
  padding-top: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  @media (max-width: 768px) { justify-content: center; }
`;

const UserName = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 2.4rem;
  font-weight: 800;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
  @media (max-width: 768px) { font-size: 1.9rem; }
`;

const UserEmail = styled.div`
  font-size: 0.97rem;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  margin: 12px 0 16px;
  letter-spacing: 0.02em;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  @media (max-width: 768px) { justify-content: center; }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StatNumber = styled.span`
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#6d28d9"};
  line-height: 2;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background: ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  align-self: center;
`;

const DescriptionSection = styled.div`
  max-width: 1200px;
  margin: 28px auto 0;
  padding: 0 40px;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: 0.2s;
  @media (max-width: 768px) { padding: 0 20px; }
`;

const DescriptionCard = styled.div`
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "rgba(139,92,246,0.04)"};
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  border-radius: 16px;
  padding: 20px 24px;
  color: ${({ $isDark }) => $isDark ? "#cbd5e1" : "#475569"};
  font-size: 0.97rem;
  line-height: 1.7;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
`;

const Btn = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

const EditBtn = styled(Btn)`
  background: ${({ $isDark }) => $isDark ? "#252f3d" : "white"};
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8b5cf6"};
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  &:hover {
    background: ${({ $isDark }) => $isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.22)"};
    border-color: ${({ $isDark }) => $isDark ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.5)"};
  }
`;

const SubscribeBtn = styled(Btn)`
  background: ${({ $subscribed, $isDark }) => 
    $subscribed 
      ? $isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)" 
      : "#8A2BE2"};
  color: ${({ $subscribed, $isDark }) => 
    $subscribed 
      ? $isDark ? "#94a3b8" : "#64748b" 
      : "white"};
  border: ${({ $subscribed, $isDark }) => 
    $subscribed 
      ? `1px solid ${$isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"}` 
      : "none"};
  &:hover {
    background: ${({ $subscribed, $isDark }) => 
      $subscribed 
        ? $isDark ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.18)" 
        : "#7c3aed"};
  }
`;

const ContentArea = styled.main`
  max-width: 1200px;
  margin: 48px auto 0;
  padding: 0 40px 60px;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: 0.3s;
  @media (max-width: 768px) { padding: 0 20px 40px; }
`;

const SectionHeading = styled.h2`
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#6d28d9"};
  margin: 0 0 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
`;

const VideoCardWrap = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease;
  &:hover { transform: translateY(-4px); }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 30px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1.05rem;
  background: ${({ $isDark }) => $isDark ? "rgba(139,92,246,0.08)" : "rgba(139,92,246,0.04)"};
  border-radius: 24px;
  border: 1px dashed ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
`;

const ErrorBox = styled.div`
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)"};
  color: #fca5a5;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 1200px;
  border-left: 3px solid #ef4444;
  font-weight: 500;
  font-size: 0.93rem;
  position: relative;
  z-index: 2;
  padding-left: 40px;
  padding-right: 40px;
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg,
    ${({ $isDark }) => $isDark ? "rgba(30,37,53,0.6)" : "rgba(255,255,255,0.04)"} 25%,
    ${({ $isDark }) => $isDark ? "rgba(45,55,72,0.8)" : "rgba(255,255,255,0.08)"} 50%,
    ${({ $isDark }) => $isDark ? "rgba(30,37,53,0.6)" : "rgba(255,255,255,0.04)"} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s infinite;
  border-radius: 16px;
`;

// Modal
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${({ $isDark }) => $isDark ? "#1a1030" : "#ffffff"};
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  padding: 36px;
  box-shadow: ${({ $isDark }) => $isDark 
    ? "0 0 40px rgba(109,40,217,0.45), 0 20px 60px rgba(0,0,0,0.7)" 
    : "0 0 40px rgba(109,40,217,0.35), 0 20px 60px rgba(0,0,0,0.5)"};
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeUp} 0.3s ease;
`;

const ModalTitle = styled.h2`
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  margin: 0 0 28px;
`;

const FieldWrap = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#475569"};
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
  }
  input, textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.25)"};
    background: ${({ $isDark }) => $isDark ? "#252f3d" : "rgba(139,92,246,0.06)"};
    color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px ${({ $isDark }) => $isDark ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.15)"};
    }
    &::placeholder { color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#94a3b8"}; opacity: 0.6; }
  }
  textarea { resize: vertical; }
  input[type="file"] {
    padding: 10px 16px;
    cursor: pointer;
    color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#475569"};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  background: ${({ $isDark }) => $isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.06)"};
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#475569"};
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(139,92,246,0.3)"};
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  &:hover { background: ${({ $isDark }) => $isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.1)"}; }
`;

const SaveBtn = styled.button`
  background: #8A2BE2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  &:hover { background: #7c3aed; }
`;

// ─── Composant UserProfile ─────────────────────────────────────────────────
function UserProfile() {
  const { userId } = useParams();
  const currentUser = useSelector(state => state.user.currentUser);
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', description: '', img: '',
    password: '', passwordConfirm: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);

  const { isDark } = useTheme();

  const isOwnProfile = currentUser?._id === userId;
  const isSubscribed = user?.subscribedUsers?.includes(currentUser?._id);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [userRes, videosRes] = await Promise.all([
          axios.get(`${API_URL}/users/find/${userId}`),
          axios.get(`${API_URL}/videos/user/${userId}`)
        ]);
        setUser(userRes.data);
        setVideos(videosRes.data || []);
        setForm({
          name: userRes.data.name || '',
          email: userRes.data.email || '',
          description: userRes.data.description || '',
          img: userRes.data.img || '',
          password: '',
          passwordConfirm: '',
        });
      } catch (err) {
        console.error(err);
        setErrorMsg("Impossible de charger le profil ou les vidéos.");
      } finally {
        setLoading(false);
        setVideosLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const toggleSubscribe = async () => {
    try {
      const action = isSubscribed ? 'unsub' : 'sub';
      const res = await axios.put(`${API_URL}/users/${action}/${userId}`);
      setUser(res.data);
    } catch (err) {
      setErrorMsg(`Échec ${isSubscribed ? 'désabonnement' : 'abonnement'}.`);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrorMsg('Seules les images sont acceptées.');
    if (file.size > 5 * 1024 * 1024) return setErrorMsg('Image trop lourde (max 5 Mo).');
    setImageFile(file);
    setErrorMsg(null);
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.name.trim()) return setErrorMsg("Le nom est requis.");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return setErrorMsg("Email invalide.");
    if (form.password && form.password !== form.passwordConfirm) return setErrorMsg("Les mots de passe ne correspondent pas.");
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('description', form.description);
      if (form.password) data.append('password', form.password);
      if (imageFile) data.append('img', imageFile);
      const res = await axios.put(`${API_URL}/users/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setUser(res.data);
      setEditing(false);
      setImageFile(null);
      setForm(prev => ({ ...prev, password: '', passwordConfirm: '' }));
    } catch (err) {
      setErrorMsg("Échec de la mise à jour du profil.");
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${API_URL}/videos/${videoId}`, { withCredentials: true });
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch (err) {
      setErrorMsg("Impossible de supprimer la vidéo.");
    }
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer $isDark={isDark}>
        <CoverBand $isDark={isDark} />
        <ProfileRow>
          <SkeletonBase style={{ width: 160, height: 160, borderRadius: '50%', marginTop: -80, flexShrink: 0 }} />
          <div style={{ flex: 1, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SkeletonBase style={{ height: 40, width: '45%' }} />
            <SkeletonBase style={{ height: 20, width: '30%' }} />
            <SkeletonBase style={{ height: 20, width: '25%' }} />
          </div>
        </ProfileRow>
        <ContentArea>
          <SectionHeading $isDark={isDark}>Vidéos</SectionHeading>
          <VideosGrid>
            {Array(6).fill(null).map((_, i) => (
              <SkeletonBase key={i} style={{ height: 220 }} />
            ))}
          </VideosGrid>
        </ContentArea>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer $isDark={isDark} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h2 style={{ color: isDark ? "#94a3b8" : "#64748b", fontFamily: 'Syne, sans-serif' }}>
          Profil introuvable
        </h2>
      </PageContainer>
    );
  }

  return (
    <PageContainer $isDark={isDark}>
      {errorMsg && <ErrorBox $isDark={isDark}>{errorMsg}</ErrorBox>}

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <HeroSection>
        <CoverBand $isDark={isDark} />
        <ProfileRow>
          <AvatarWrap>
            <Avatar
              src={
                user.img ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=6d28d9&color=fff&size=256`
              }
              alt={user.name}
              $isDark={isDark}
            />
          </AvatarWrap>

          <UserInfoBlock>
            <TopRow>
              <UserName $isDark={isDark}>{user.name || 'Utilisateur'}</UserName>

              <ActionGroup>
                {isOwnProfile ? (
                  <EditBtn onClick={() => setEditing(!editing)} $isDark={isDark}>
                    {editing ? '✕ Annuler' : '✎ Modifier'}
                  </EditBtn>
                ) : (
                  <SubscribeBtn $subscribed={isSubscribed} onClick={toggleSubscribe} $isDark={isDark}>
                    {isSubscribed ? "✓ Abonné" : "+ S'abonner"}
                  </SubscribeBtn>
                )}
              </ActionGroup>
            </TopRow>

            <UserEmail $isDark={isDark}>{user.email}</UserEmail>

            <StatsRow>
              <StatItem>
                <StatNumber $isDark={isDark}>{(user.subscribers || 0).toLocaleString()}</StatNumber>
                <StatLabel $isDark={isDark}>Abonnés</StatLabel>
              </StatItem>
              <Divider $isDark={isDark} />
              <StatItem>
                <StatNumber $isDark={isDark}>{(user.subscribedUsers?.length || 0).toLocaleString()}</StatNumber>
                <StatLabel $isDark={isDark}>Abonnements</StatLabel>
              </StatItem>
              <Divider $isDark={isDark} />
              <StatItem>
                <StatNumber $isDark={isDark}>{videos.length}</StatNumber>
                <StatLabel $isDark={isDark}>Vidéos</StatLabel>
              </StatItem>
            </StatsRow>
          </UserInfoBlock>
        </ProfileRow>
      </HeroSection>

      {/* ─── Description ─────────────────────────────────────────────────────── */}
      {user.description && (
        <DescriptionSection>
          <DescriptionCard $isDark={isDark}>{user.description}</DescriptionCard>
        </DescriptionSection>
      )}

      {/* ─── Vidéos ──────────────────────────────────────────────────────────── */}
      <ContentArea>
        <SectionHeading $isDark={isDark}>Vidéos de {user.name}</SectionHeading>

        {videosLoading ? (
          <VideosGrid>
            {Array(6).fill(null).map((_, i) => <SkeletonBase key={i} style={{ height: 220 }} />)}
          </VideosGrid>
        ) : videos.length === 0 ? (
          <EmptyState $isDark={isDark}>Aucune vidéo publiée pour le moment…</EmptyState>
        ) : (
          <VideosGrid>
            {videos.map(video => (
              <VideoCardWrap key={video._id}>
                <Card video={video} />
                {isOwnProfile && (
                  <button onClick={() => deleteVideo(video._id)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer' }}>
                    ×
                  </button>
                )}
              </VideoCardWrap>
            ))}
          </VideosGrid>
        )}
      </ContentArea>

      {/* ─── Modal édition ───────────────────────────────────────────────────── */}
      {editing && (
        <Overlay onClick={e => e.target === e.currentTarget && setEditing(false)}>
          <Modal $isDark={isDark}>
            <ModalTitle $isDark={isDark}>Modifier le profil</ModalTitle>

            {errorMsg && (
              <div style={{
                background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: 20,
                fontSize: '0.9rem',
                borderLeft: `3px solid #ef4444`,
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <FieldWrap>
                <label>Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </FieldWrap>

              <FieldWrap>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </FieldWrap>

              <FieldWrap>
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Décrivez-vous en quelques mots…"
                />
              </FieldWrap>

              <FieldWrap>
                <label>Photo de profil</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </FieldWrap>

              <FieldWrap>
                <label>Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Laisser vide pour ne pas changer"
                />
              </FieldWrap>

              <FieldWrap>
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
                  placeholder="Répéter le nouveau mot de passe"
                />
              </FieldWrap>

              <ModalActions>
                <CancelBtn type="button" onClick={() => setEditing(false)} $isDark={isDark}>
                  Annuler
                </CancelBtn>
                <SaveBtn type="submit" $isDark={isDark}>
                  Enregistrer
                </SaveBtn>
              </ModalActions>
            </form>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
}

export default UserProfile;