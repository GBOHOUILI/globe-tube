import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const theme = {
  primaryColor: '#8A2BE2',
  secondaryColor: '#9370DB',
  accentColor: '#BA55D3',
  lightColor: '#E6E6FA',
  darkColor: '#4B0082',
  textColor: '#2E0854',
  errorColor: '#d32f2f',
};

// Singleton socket instance
let socketInstance = null;
const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
};

// Enhanced debounce for typing
const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
};

// Date validation utility
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Styled components
const ChatContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 82vh;
  max-height: 800px;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  background: linear-gradient(135deg, ${theme.lightColor} 0%, #ffffff 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.1);

  @media (max-width: 768px) {
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const Header = styled.header`
  padding: 16px 20px;
  background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.darkColor} 100%);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid ${theme.darkColor};
  border-radius: 20px 20px 0 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  }

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 12px 16px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
  background: linear-gradient(to bottom, rgba(230, 230, 250, 0.1), rgba(255, 255, 255, 0.05));

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.lightColor}40;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, ${theme.secondaryColor}, ${theme.accentColor});
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.primaryColor};
  }

  scrollbar-width: thin;
  scrollbar-color: ${theme.secondaryColor} ${theme.lightColor}40;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: ${props => props.isCurrentUser ? 'row-reverse' : 'row'};
  align-items: flex-end;
  margin-bottom: 16px;
  transition: opacity 0.3s ease;

  &:hover {
    .message-timestamp {
      opacity: 1;
    }
  }
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 75%;

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const SenderName = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${theme.textColor}80;
  margin-bottom: 4px;
  margin-${props => props.isCurrentUser ? 'right' : 'left'}: 12px;
  opacity: 0.8;
`;

const MessageBubble = styled.div`
  background: ${props => props.isCurrentUser 
    ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
    : '#ffffff'
  };
  color: ${props => props.isCurrentUser ? '#ffffff' : theme.textColor};
  padding: 12px 3px 1px 16px;
  border-radius: ${props => props.isCurrentUser 
    ? '20px 20px 4px 20px' 
    : '20px 20px 20px 4px'
  };
  word-break: break-word;
  box-shadow: ${props => props.isCurrentUser 
    ? '0 4px 12px rgba(138, 43, 226, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };
  border: ${props => props.isCurrentUser 
    ? 'none'
    : `1px solid ${theme.lightColor}60`
  };
  position: relative;
  line-height: 1.4;

  &::before {
    content: '';
    position: absolute;
    ${props => props.isCurrentUser ? 'right: -4px' : 'left: -4px'};
    bottom: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-top-color: ${props => props.isCurrentUser ? theme.secondaryColor : '#ffffff'};
    border-${props => props.isCurrentUser ? 'right' : 'left'}: none;
    transform: rotate(${props => props.isCurrentUser ? '45deg' : '-45deg'});
  }
`;

const MessageContent = styled.div`
  margin-bottom: 4px;
  margin-right: 16px;
`;

const Timestamp = styled.div`
  font-size: 0.7rem;
  color: ${props => props.isCurrentUser ? 'rgba(73, 1, 1, 0.9)' : 'rgba(38, 0, 77, 0.5)'};
  text-align: ${props => props.isCurrentUser ? 'right' : 'left'};
  margin-top: 4px;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &.message-timestamp {
    opacity: 0.8;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: ${props => props.isCurrentUser ? '0 8px 0 0' : '0 0 0 8px'};
  object-fit: cover;
  border: 2px solid ${props => props.isCurrentUser ? theme.primaryColor : theme.lightColor};
  background: ${theme.lightColor};
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid ${theme.lightColor}60;
  border-radius: 0 0 20px 20px;
  gap: 12px;

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 12px;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 2px solid ${theme.lightColor}60;
  background: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px ${theme.accentColor}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${theme.textColor}50;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 80px;
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
    transform: none;
    box-shadow: 0 2px 6px rgba(138, 43, 226, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;

  .typing-dots {
    display: flex;
    gap: 4px;
    margin-left: 8px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${theme.secondaryColor};
      animation: typing 1.4s infinite ease-in-out;

      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }

  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

function ChatBox({ roomId }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser) || {
    _id: 'user1',
    name: 'Moi',
    img: 'https://via.placeholder.com/36',
  };

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const socket = useMemo(() => getSocket(), []);

  // Typing debounce
  const emitTyping = useMemo(
    () => debounce(() => {
      socket.emit('typing', { roomId, userId: currentUser._id });
    }, 300),
    [roomId, currentUser._id, socket]
  );

  const emitStopTyping = useMemo(
    () => debounce(() => {
      socket.emit('stop-typing', { roomId, userId: currentUser._id });
    }, 1000),
    [roomId, currentUser._id, socket]
  );

  const scrollToBottom = useCallback((force = false) => {
    if (messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 100;

      if (force || isScrolledToBottom) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Socket connection management
  useEffect(() => {
    socket.emit('join-room', roomId);
    socket.emit('load-messages', { roomId });

    return () => {
      socket.emit('leave-room', roomId);
      emitStopTyping();
    };
  }, [socket, roomId, emitStopTyping]);

  // Message handling
  useEffect(() => {
    const handleMessagesLoaded = (loadedMessages) => {
      setMessages(
        loadedMessages.map((msg) => ({
          ...msg,
          timestamp: isValidDate(msg.timestamp) ? new Date(msg.timestamp) : new Date(),
        }))
      );
    };

    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (msg) => (msg.tempId && msg.tempId === message.tempId) || (msg.id && msg.id === message.id)
        );

        const newMessage = {
          ...message,
          timestamp: isValidDate(message.timestamp) ? new Date(message.timestamp) : new Date(),
        };

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newMessage;
          return updated;
        }

        return [...prev, newMessage];
      });
      setIsTyping(false);
    };

    const handleTyping = ({ userId }) => {
      if (userId !== currentUser._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleStopTyping = ({ userId }) => {
      if (userId !== currentUser._id) {
        setIsTyping(false);
      }
    };

    socket.on('messages-loaded', handleMessagesLoaded);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stop-typing', handleStopTyping);

    return () => {
      socket.off('messages-loaded', handleMessagesLoaded);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stop-typing', handleStopTyping);
      clearTimeout(typingTimeoutRef.current);
      emitTyping.cancel();
      emitStopTyping.cancel();
    };
  }, [socket, currentUser._id, emitTyping, emitStopTyping]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInput(value);

      if (value.trim()) {
        emitTyping();
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          emitStopTyping();
        }, 2000);
      } else {
        emitStopTyping();
      }
    },
    [emitTyping, emitStopTyping]
  );

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    setIsSending(true);

    const tempId = uuidv4();
    const newMessage = {
      sender: {
        id: currentUser._id,
        name: currentUser.name || 'Moi',
        avatar: currentUser.img || 'https://via.placeholder.com/36',
      },
      text: trimmedInput,
      timestamp: new Date(),
      tempId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    emitStopTyping();

    setTimeout(() => inputRef.current?.focus(), 100);

    socket.emit('send-message', {
      roomId,
      sender: newMessage.sender,
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      tempId: newMessage.tempId,
    });

    setIsSending(false);
  }, [input, isSending, currentUser, socket, roomId, emitStopTyping]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const formatTimestamp = useCallback((date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Date inconnue';
    }

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;

    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  }, []);

  return (
    <ChatContainer role="main" aria-label="Interface de chat">
      <Header>Chat Space</Header>

      <MessagesContainer
        ref={messagesContainerRef}
        aria-live="polite"
        aria-label="Messages du chat"
      >
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender.id === currentUser._id;

          return (
            <MessageRow
              key={msg.id || msg.tempId || index}
              isCurrentUser={isCurrentUser}
            >
              <Avatar
                src={msg.sender.avatar}
                alt={`Avatar de ${msg.sender.name}`}
                isCurrentUser={isCurrentUser}
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/36/8A2BE2/ffffff?text=' +
                    encodeURIComponent(msg.sender.name.charAt(0).toUpperCase());
                }}
              />

              <MessageGroup>
                {!isCurrentUser && (
                  <SenderName isCurrentUser={isCurrentUser}>
                    {msg.sender.name}
                  </SenderName>
                )}

                <MessageBubble isCurrentUser={isCurrentUser}>
                  <MessageContent>{msg.text}</MessageContent>
                  <Timestamp
                    isCurrentUser={isCurrentUser}
                    className="message-timestamp"
                  >
                    {formatTimestamp(msg.timestamp)}
                  </Timestamp>
                </MessageBubble>
              </MessageGroup>
            </MessageRow>
          );
        })}

        {isTyping && (
          <TypingIndicator>
            <Avatar
              src="https://via.placeholder.com/32/9370DB/ffffff?text=..."
              alt="Quelqu'un tape"
            />
            <div>
              Quelqu'un tape
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <ChatInput
          ref={inputRef}
          placeholder="Tapez votre message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          aria-label="Champ de saisie du message"
          maxLength={1000}
          autoComplete="off"
          spellCheck="true"
        />
        <SendButton
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          aria-label="Envoyer le message"
          title="Envoyer (Entrée)"
        >
          {isSending ? <LoadingSpinner /> : 'Send'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default React.memo(ChatBox);