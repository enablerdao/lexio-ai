import { motion } from 'framer-motion';

export default function Welcome({ onExampleClick }) {
  const examples = [
    "What can you help me with?",
    "Tell me about the latest AI developments",
    "How do I create a React component?",
    "Search for news about climate change"
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
        className="text-xl text-white/80 max-w-2xl mb-8"
      >
        Your advanced AI assistant powered by GPT-4o. Ask me anything or try one of the examples below.
      </motion.p>
      
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
        className="mt-12 text-white/50 text-sm"
      >
        <p>Type a message below to get started</p>
        <div className="mt-2 animate-bounce-slow">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}