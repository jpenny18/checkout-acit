import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, orderBy, addDoc, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { MessageSquare, Send, User } from 'lucide-react';

const Container = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  background: #1a1a1a;
  margin: 20px;
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 0;
    height: calc(100vh - 60px);
    border-radius: 0;
    position: relative;
  }
`;

const Header = styled.div`
  background: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc62d;
  font-weight: bold;

  @media (max-width: 768px) {
    padding: 0.75rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    justify-content: center;
  }
`;

const ConversationsList = styled.div`
  width: 300px;
  background: #242424;
  border-right: 1px solid #333;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.showChat ? 'none' : 'block'};
    margin-top: 56px; /* Header height */
  }
`;

const ConversationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  background: ${props => props.selected ? '#333' : 'transparent'};
  
  &:hover {
    background: #2a2a2a;
  }

  h3 {
    margin: 0 0 5px;
    color: #fff;
    font-size: 14px;
  }

  p {
    margin: 0;
    color: #999;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;

  @media (max-width: 768px) {
    display: ${props => props.showChat ? 'flex' : 'none'};
    position: fixed;
    top: 56px; /* Header height */
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
  }
`;

const BackButton = styled.button`
  display: none;
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  color: #ffc62d;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: ${props => props.show ? 'block' : 'none'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MessagesList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Message = styled.div`
  max-width: 70%;
  margin: 5px 0;
  padding: 10px 15px;
  border-radius: 10px;
  align-self: ${props => props.isAdmin ? 'flex-end' : 'flex-start'};
  background: ${props => props.isAdmin ? '#ffc62d' : '#333'};
  color: ${props => props.isAdmin ? '#000' : '#fff'};

  p {
    margin: 0;
    font-size: 14px;
  }

  small {
    display: block;
    margin-top: 5px;
    font-size: 11px;
    opacity: 0.7;
  }
`;

const InputForm = styled.form`
  display: flex;
  padding: 20px;
  background: #242424;
  border-top: 1px solid #333;

  @media (max-width: 768px) {
    padding: 15px;
    position: sticky;
    bottom: 0;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #333;
  color: #fff;
  margin-right: 10px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 198, 45, 0.5);
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #ffc62d;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoConversation = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
`;

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get all conversations
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsMap = new Map();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const message = { 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp ? data.timestamp : null
        };
        
        if (!conversationsMap.has(message.userId)) {
          conversationsMap.set(message.userId, {
            userId: message.userId,
            userEmail: message.userEmail,
            lastMessage: message.content,
            timestamp: message.timestamp,
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    }, (error) => {
      console.error("Error in conversations listener:", error);
    });

    return () => unsubscribe();
  }, []);

  // Get messages for selected user
  useEffect(() => {
    if (!selectedUser) return;

    const q = query(
      collection(db, 'messages'),
      where('userId', '==', selectedUser.userId),
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
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || !selectedUser) return;

    setLoading(true);
    try {
      const messageData = {
        userId: selectedUser.userId,
        userEmail: selectedUser.userEmail,
        content: newMessage.trim(),
        isUser: false,
        isAdmin: true,
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

  const getInitials = (email) => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  return (
    <Container>
      <Header>
        <BackButton show={selectedUser} onClick={handleBackClick}>
          ←
        </BackButton>
        <MessageSquare />
        {selectedUser ? selectedUser.userEmail : 'Support Messages'}
      </Header>
      
      <ConversationsList showChat={selectedUser}>
        {conversations.map(conv => (
          <ConversationItem 
            key={conv.userId}
            selected={selectedUser?.userId === conv.userId}
            onClick={() => setSelectedUser(conv)}
          >
            <h3>{conv.userEmail}</h3>
            <p>{conv.lastMessage}</p>
          </ConversationItem>
        ))}
      </ConversationsList>
      
      <ChatSection showChat={selectedUser}>
        {selectedUser ? (
          <>
            <MessagesList>
              {messages.map(message => (
                <Message 
                  key={message.id} 
                  isAdmin={message.isAdmin}
                >
                  <p>{message.content}</p>
                  <small>
                    {message.timestamp ? formatTimestamp(message.timestamp) : ''}
                  </small>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessagesList>
            
            <InputForm onSubmit={handleSubmit}>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
              />
              <SendButton type="submit" disabled={loading || !newMessage.trim()}>
                Send
              </SendButton>
            </InputForm>
          </>
        ) : (
          <MessagesList>
            <p style={{ color: '#999', textAlign: 'center' }}>
              Select a conversation to start messaging
            </p>
          </MessagesList>
        )}
      </ChatSection>
    </Container>
  );
};

export default AdminMessages; 