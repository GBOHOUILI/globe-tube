
import React, { useState } from 'react';
import styled from 'styled-components';

const theme = {
  primaryColor: '#8A2BE2',
  secondaryColor: '#9370DB',
  accentColor: '#BA55D3',
  lightColor: '#E6E6FA',
  darkColor: '#4B0082',
  textColor: '#2E0854',
};

const InviteModalContainer = styled.div`
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, ${theme.lightColor} 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.1);
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
  color: ${theme.textColor};
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
  border: 2px solid ${theme.lightColor}60;
  background: #fff;
  font-size: 0.95rem;
  color: ${theme.textColor};
  font-family: inherit;
  cursor: text;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px ${theme.accentColor}20;
  }

  &:read-only {
    background: ${theme.lightColor}20;
    cursor: default;
  }
`;

const InviteButton = styled.button`
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
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

function InviteModal() {
  const [roomId] = useState(() => {
    const url = window.location.href;
    return url.split('/').pop(); // Get room ID from URL
  });

  const inviteLink = `${window.location.origin}/watchparty/${roomId}`;
  const [isCopied, setIsCopied] = useState(false);

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
    <InviteModalContainer role="dialog" aria-label="Inviter des amis à la watchparty">
      <InviteTitle>Invitez vos amis :</InviteTitle>
      <InviteInputWrapper>
        <InviteInput
          value={inviteLink}
          readOnly
          aria-label="Lien d'invitation à la watchparty"
        />
        <InviteButton
          onClick={handleCopy}
          disabled={isCopied}
          aria-label={isCopied ? 'Lien copié' : 'Copier le lien d\'invitation'}
        >
          {isCopied ? 'Copié !' : 'Copier'}
        </InviteButton>
      </InviteInputWrapper>
    </InviteModalContainer>
  );
}

export default InviteModal;
