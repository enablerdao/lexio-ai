import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

export default function Features() {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const features = [
    {
      title: "Web Search & Information Retrieval",
      description: "Search the web and retrieve up-to-date information on any topic. lexio.ai can find answers to your questions by searching across multiple sources.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      examples: ["What is quantum computing?", "Search for the latest news", "Find information about climate change"]
    },
    {
      title: "Intelligent Agent Loop",
      description: "Our advanced agent loop technology automatically selects the right tools to answer your questions. It analyzes your query, executes the appropriate tools, and synthesizes the results.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      examples: ["What's the weather like today?", "Tell me about the latest AI developments", "How do I create a React component?"]
    },
    {
      title: "Calculations & Data Processing",
      description: "Perform calculations and process data directly in your conversations. lexio.ai can handle mathematical expressions, unit conversions, and more.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      examples: ["Calculate 125 * 37", "Convert 10 kilometers to miles", "What's 15% of 230?"]
    },
    {
      title: "Code Assistance & Examples",
      description: "Get help with programming and see code examples with syntax highlighting. lexio.ai can explain code concepts and provide sample implementations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      examples: ["How do I use async/await in JavaScript?", "Show me a Python function to sort a list", "Explain React hooks"]
    },
    {
      title: "Conversation Memory",
      description: "lexio.ai remembers your conversation history, allowing for contextual follow-up questions and a more natural dialogue experience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      examples: ["Remember that I prefer vegetarian recipes", "What did we talk about earlier?", "Continue from our last conversation"]
    },
    {
      title: "Dark & Light Mode",
      description: "Customize your experience with dark and light mode options. lexio.ai adapts to your preferences and system settings.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      examples: ["Switch to dark mode", "I prefer light mode", "Use my system theme"]
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'
    }`}>
      <Head>
        <title>Features - lexio.ai</title>
        <meta name="description" content="Explore the powerful features of lexio.ai - your advanced AI assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onSidebarOpen={() => setIsSidebarOpen(true)} />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Powerful Features
            </h1>
            <p className="text-xl max-w-3xl mx-auto dark:text-white/80 text-gray-600">
              lexio.ai combines cutting-edge AI with practical tools to help you find information, solve problems, and get things done.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-panel p-6 flex flex-col h-full`}
              >
                <div className={`mb-4 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="mb-4 dark:text-white/70 text-gray-600 flex-grow">{feature.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 dark:text-white/80 text-gray-700">Example queries:</h4>
                  <ul className="space-y-1">
                    {feature.examples.map((example, i) => (
                      <li key={i} className="text-sm dark:text-white/60 text-gray-500">
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Link href="/" className="btn-primary inline-flex items-center">
              <span>Try lexio.ai Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}