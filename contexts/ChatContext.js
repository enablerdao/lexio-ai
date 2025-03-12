import { createContext, useState, useEffect, useContext } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        
        // Set the most recent conversation as active if there is one
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
          setMessages(parsed[0].messages || []);
        }
      } catch (error) {
        console.error('Error parsing saved conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Create a new conversation
  const createNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  // Switch to a different conversation
  const switchConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setMessages(conversation.messages || []);
    }
  };

  // Delete a conversation
  const deleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    setConversations(updatedConversations);
    
    // If the active conversation was deleted, switch to the first available one
    if (conversationId === activeConversationId && updatedConversations.length > 0) {
      setActiveConversationId(updatedConversations[0].id);
      setMessages(updatedConversations[0].messages || []);
    } else if (updatedConversations.length === 0) {
      // If no conversations left, clear everything
      setActiveConversationId(null);
      setMessages([]);
    }
    
    // Update localStorage
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  };

  // Rename a conversation
  const renameConversation = (conversationId, newTitle) => {
    const updatedConversations = conversations.map(c => 
      c.id === conversationId ? { ...c, title: newTitle } : c
    );
    setConversations(updatedConversations);
  };

  // Add a message to the current conversation
  const addMessage = (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Update the conversation in the list
    if (activeConversationId) {
      const updatedConversations = conversations.map(c => 
        c.id === activeConversationId 
          ? { 
              ...c, 
              messages: updatedMessages,
              // Update title based on first user message if it's still the default
              title: c.title === 'New Conversation' && message.role === 'user' 
                ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
                : c.title
            } 
          : c
      );
      setConversations(updatedConversations);
    } else if (message.role === 'user') {
      // If no active conversation, create one
      createNewConversation();
    }
  };

  // Edit a message
  const editMessage = (messageIndex, updatedContent) => {
    const updatedMessages = messages.map((msg, idx) => 
      idx === messageIndex ? { ...msg, content: updatedContent } : msg
    );
    setMessages(updatedMessages);
    
    // Update the conversation in the list
    if (activeConversationId) {
      const updatedConversations = conversations.map(c => 
        c.id === activeConversationId ? { ...c, messages: updatedMessages } : c
      );
      setConversations(updatedConversations);
    }
  };

  // Delete a message
  const deleteMessage = (messageIndex) => {
    const updatedMessages = messages.filter((_, idx) => idx !== messageIndex);
    setMessages(updatedMessages);
    
    // Update the conversation in the list
    if (activeConversationId) {
      const updatedConversations = conversations.map(c => 
        c.id === activeConversationId ? { ...c, messages: updatedMessages } : c
      );
      setConversations(updatedConversations);
    }
  };

  // Clear all messages in the current conversation
  const clearConversation = () => {
    setMessages([]);
    
    // Update the conversation in the list
    if (activeConversationId) {
      const updatedConversations = conversations.map(c => 
        c.id === activeConversationId ? { ...c, messages: [] } : c
      );
      setConversations(updatedConversations);
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversationId,
      messages,
      isLoading,
      setIsLoading,
      createNewConversation,
      switchConversation,
      deleteConversation,
      renameConversation,
      addMessage,
      editMessage,
      deleteMessage,
      clearConversation,
      setMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}