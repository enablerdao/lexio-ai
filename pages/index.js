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
      // Determine which API to use based on the input
      const useAgentApi = inputText.toLowerCase().includes('search') || 
                          inputText.toLowerCase().includes('find') ||
                          inputText.toLowerCase().includes('look up') ||
                          inputText.toLowerCase().includes('what is') ||
                          inputText.toLowerCase().includes('who is') ||
                          inputText.toLowerCase().includes('how to') ||
                          inputText.toLowerCase().includes('when') ||
                          inputText.toLowerCase().includes('where') ||
                          inputText.toLowerCase().includes('why') ||
                          inputText.toLowerCase().includes('news') ||
                          inputText.toLowerCase().includes('weather') ||
                          inputText.toLowerCase().includes('calculate');
      
      // Check if the request is specifically for browser use
      const useBrowserApi = inputText.toLowerCase().includes('browser') ||
                           inputText.toLowerCase().includes('web') ||
                           inputText.toLowerCase().includes('visit') ||
                           inputText.toLowerCase().includes('open site') ||
                           inputText.toLowerCase().includes('navigate to') ||
                           inputText.toLowerCase().includes('go to');
      
      // In production or when using special APIs
      if (typeof window !== 'undefined' && (window.location.hostname !== 'localhost' || useAgentApi || useBrowserApi)) {
        let agentResponse;
        
        if (useBrowserApi) {
          // Use browser agent
          try {
            // In production, use mock browser response
            if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Import the browser agent utilities for client-side execution
              const { executeBrowserTask, formatBrowserResult } = await import('../utils/browserAgent');
              const browserResult = await executeBrowserTask(inputText);
              agentResponse = formatBrowserResult(browserResult);
            } else {
              // In development, use the browser API
              const response = await fetch('/api/browser', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  task: inputText,
                }),
              });
              
              if (!response.ok) {
                throw new Error('Failed to get response from browser API');
              }
              
              const data = await response.json();
              agentResponse = data.response;
            }
          } catch (error) {
            console.error('Browser API error:', error);
            agentResponse = `I encountered an error while trying to use the browser: ${error.message}`;
          }
        } else if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' || useAgentApi) {
          // Use regular agent API
          if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            // In production, use mock agent response
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Import the agent loop utilities for client-side execution in production
            const { executeAgentLoop } = await import('../utils/agentLoop');
            const result = await executeAgentLoop(inputText, messages.map(msg => ({ role: msg.role, content: msg.content })));
            agentResponse = result.response;
          } else {
            // In development, use the agent API
            const response = await fetch('/api/agent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: inputText,
                history: messages.map(msg => ({ role: msg.role, content: msg.content })),
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to get response from agent API');
            }
            
            const data = await response.json();
            agentResponse = data.response;
          }
        }
        
        addMessage({ role: 'assistant', content: agentResponse });
        setIsLoading(false);
        return;
      }
      
      // For non-agent queries in development, use the regular backend API
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