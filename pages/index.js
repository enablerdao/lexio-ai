import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import Welcome from '../components/Welcome';
import LoadingIndicator from '../components/LoadingIndicator';
import Sidebar from '../components/Sidebar';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { 
    messages, 
    isLoading, 
    setIsLoading, 
    addMessage 
  } = useChat();
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (inputText) => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText };
    addMessage(userMessage);
    setIsLoading(true);

    try {
      // In production, we'll use a mock response since we don't have a deployed backend
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response for demo purposes
        const mockResponse = {
          response: `This is a demo response to your message: "${inputText}"\n\nIn a production environment, this would connect to a real backend API. For now, I'm just echoing your message with some additional text.\n\n\`\`\`javascript\n// Here's a code example\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n\`\`\``,
        };
        
        addMessage({ role: 'assistant', content: mockResponse.response });
        setIsLoading(false);
        return;
      }
      
      // In development, use the real API
      const response = await fetch('/backend-api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputText,
          history: messages.map(msg => ({ role: msg.role, content: msg.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      addMessage({ role: 'assistant', content: data.response });
    } catch (error) {
      console.error('Error:', error);
      addMessage({ 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    handleSubmit(example);
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'
    }`}>
      <Head>
        <title>lexio.ai - Advanced AI Assistant</title>
        <meta name="description" content="lexio.ai - Your advanced AI assistant powered by GPT-4o" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onSidebarOpen={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col pt-20 pb-32">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {messages.length === 0 ? (
              <Welcome onExampleClick={handleExampleClick} />
            ) : (
              <div className="space-y-6 px-2">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <Message key={index} message={message} index={index} />
                  ))}
                  {isLoading && <LoadingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}