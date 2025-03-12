import { motion } from 'framer-motion';

export default function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2 flex-shrink-0">
        <span className="text-white font-bold text-xs">L</span>
      </div>
      
      <div className="message-assistant">
        <div className="typing-indicator">
          <div className="typing-indicator-dot"></div>
          <div className="typing-indicator-dot"></div>
          <div className="typing-indicator-dot"></div>
        </div>
      </div>
    </motion.div>
  );
}