import React, { useState } from 'react';
import styled from 'styled-components';

// ── Import du ThemeContext pour le thème global ──
import { useTheme } from "../context/ThemeContext";

function InviteModal() {
  const [roomId] = useState(() => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  });

  const inviteLink = `${window.location.origin}/watchparty/${roomId}`;
  const [isCopied, setIsCopied] = useState(false);

  // Récupération du thème global
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setIsCopied(true);
      alert('Lien copié ! Partage-le avec tes amis.');
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch((err) => {
      console.error('Failed to copy link:', err);
      alert('Échec de la copie du lien. Veuillez réessayer.');
    });
  };

  return (
    <InviteModalContainer $isDark={isDark} role="dialog" aria-label="Inviter des amis à la watchparty">
      <InviteTitle $isDark={isDark}>Invitez vos amis :</InviteTitle>

      <InviteInputWrapper>
        <InviteInput
          value={inviteLink}
          readOnly
          aria-label="Lien d'invitation à la watchparty"
          $isDark={isDark}
        />

        <InviteButton
          onClick={handleCopy}
          disabled={isCopied}
          aria-label={isCopied ? 'Lien copié' : 'Copier le lien d\'invitation'}
          $isDark={isDark}
        >
          {isCopied ? 'Copié !' : 'Copier'}
        </InviteButton>
      </InviteInputWrapper>
    </InviteModalContainer>
  );
}

// ─── Styled Components avec couleurs dynamiques ─────────────────────────────
const InviteModalContainer = styled.div`
  position: relative;
  padding: 20px;
  background: ${({ $isDark }) => $isDark 
    ? '#161b22' 
    : 'linear-gradient(135deg, #E6E6FA 0%, #ffffff 100%)'};
  border-radius: 12px;
  box-shadow: ${({ $isDark }) => $isDark 
    ? '0 4px 12px rgba(0,0,0,0.6)' 
    : '0 4px 12px rgba(0,0,0,0.1)'};
  border: 1px solid ${({ $isDark }) => $isDark 
    ? 'rgba(138,43,226,0.3)' 
    : 'rgba(138,43,226,0.1)'};
  width: 95%;
  max-width: 800px;
  margin: 20px auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  @media (max-width: 768px) {
    margin: 10px;
    padding: 16px;
  }
`;

const InviteTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2E0854'};
  margin-bottom: 12px;
`;

const InviteInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const InviteInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid ${({ $isDark }) => $isDark ? 'rgba(148,163,184,0.3)' : '#E6E6FA60'};
  background: ${({ $isDark }) => $isDark ? '#1e2535' : '#fff'};
  font-size: 0.95rem;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2E0854'};
  font-family: inherit;
  cursor: text;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #BA55D3;
    box-shadow: 0 0 0 3px ${({ $isDark }) => $isDark ? 'rgba(186,85,211,0.3)' : 'rgba(186,85,211,0.2)'};
  }
  &:read-only {
    background: ${({ $isDark }) => $isDark ? '#252f3d' : '#E6E6FA20'};
    cursor: default;
    color: ${({ $isDark }) => $isDark ? '#94a3b8' : '#666'};
  }
`;

const InviteButton = styled.button`
  background: linear-gradient(135deg, #8A2BE2, #BA55D3);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #4B0082, #8A2BE2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(138, 43, 226, 0.4);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 6px rgba(138, 43, 226, 0.2);
    background: linear-gradient(135deg, #8A2BE2, #BA55D3);
  }
`;

export default InviteModal;