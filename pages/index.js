import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import Welcome from '../components/Welcome';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/query', {
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
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your request. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    handleSubmit(example);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <Head>
        <title>lexio.ai - Advanced AI Assistant</title>
        <meta name="description" content="lexio.ai - Your advanced AI assistant powered by GPT-4o" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-1 flex flex-col pt-20 pb-24">
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

      <div className="fixed bottom-0 left-0 right-0">
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      <Footer />
    </div>
  );
}