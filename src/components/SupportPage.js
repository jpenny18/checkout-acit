import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { collection, query, orderBy, addDoc, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { MessageSquare, Send, Mail } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Card = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  color: #ffc62d;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessagesContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(26, 26, 26, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  scrollbar-width: thin;
  scrollbar-color: #333 #1a1a1a;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? '#ffc62d' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isUser ? '#1a1a1a' : 'white'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border-bottom-right-radius: ${props => props.isUser ? '4px' : '12px'};
  border-bottom-left-radius: ${props => !props.isUser ? '4px' : '12px'};
  max-width: 70%;
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex: 1;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  &::placeholder {
    color: #666;
  }
`;

const SendButton = styled.button`
  background: #ffc62d;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e6b229;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SupportEmailCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 198, 45, 0.1);
  border-color: rgba(255, 198, 45, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
`;

const EmailSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffc62d;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const EmailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmailLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const EmailAddress = styled.div`
  font-weight: 500;
`;

const EmailButton = styled.a`
  background: #ffc62d;
  color: #1a1a1a;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #e6b229;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageData.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp ? data.timestamp : null
        });
      });
      setMessages(messageData);
      scrollToBottom();
    }, (error) => {
      console.error("Error in messages listener:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || !user) return;

    setLoading(true);
    try {
      const messageData = {
        userId: user.uid,
        userEmail: user.email,
        content: newMessage.trim(),
        isUser: true,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }).format(timestamp instanceof Date ? timestamp : timestamp.toDate());
  };

  return (
    <Container>
      <Card>
        <Title>
          <MessageSquare />
          Live Support
        </Title>
        <MessagesContainer>
          {messages.map((message) => (
            <Message key={message.id} isUser={message.isUser}>
              <MessageContent isUser={message.isUser}>
                {message.content}
              </MessageContent>
              <MessageTime>
                {message.timestamp ? formatTimestamp(message.timestamp) : ''}
              </MessageTime>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer onSubmit={handleSubmit}>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
          />
          <SendButton type="submit" disabled={!newMessage.trim() || loading}>
            <Send />
          </SendButton>
        </InputContainer>
      </Card>

      <SupportEmailCard>
        <EmailSection>
          <Mail />
          <EmailText>
            <EmailLabel>Email Support</EmailLabel>
            <EmailAddress>support@ascendantcapital.ca</EmailAddress>
          </EmailText>
        </EmailSection>
        <EmailButton href="mailto:support@ascendantcapital.ca">
          Send Email
          <Mail />
        </EmailButton>
      </SupportEmailCard>
    </Container>
  );
};

export default SupportPage; 