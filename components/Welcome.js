import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Welcome({ onExampleClick }) {
  const examples = [
    "What can you help me with?",
    "Search for the latest news",
    "What is quantum computing?",
    "Use the browser to find information about AI",
    "Go to github.com and show me the trending repositories",
    "Calculate 125 * 37"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mb-6 shadow-glow"
      >
        <span className="text-white font-bold text-4xl">L</span>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
      >
        Welcome to lexio.ai
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-white/80 max-w-2xl mb-4"
      >
        Your advanced AI assistant with web search capabilities. Ask me anything or try one of the examples below.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="text-white/70 max-w-2xl mb-8 text-center"
      >
        <p className="text-sm mb-2">I can help with:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Web Search', 'Information Retrieval', 'Calculations', 'Code Examples', 'Current Time'].map((feature, i) => (
            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs">
              {feature}
            </span>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {examples.map((example, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onExampleClick(example)}
            className="glass-panel p-4 text-left hover:shadow-glow transition-all duration-200"
          >
            <p className="text-white/90">{example}</p>
          </motion.button>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 text-white/50 text-sm"
      >
        <p>Type a message below to get started</p>
        <div className="mt-2 animate-bounce-slow">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8"
      >
        <Link href="/workspace" passHref>
          <a className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Try Advanced Workspace
          </a>
        </Link>
      </motion.div>
    </motion.div>
  );
}