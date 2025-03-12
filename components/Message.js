import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Message({ message, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUser = message.role === 'user';
  
  // If message is very long, truncate it and show a "Read more" button
  const isLongMessage = message.content.length > 500;
  const displayContent = isLongMessage && !isExpanded 
    ? message.content.substring(0, 500) + '...' 
    : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white font-bold text-xs">L</span>
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'message-user' : 'message-assistant'}`}>
        <div className="prose prose-invert">
          {displayContent.split('\n').map((line, i) => (
            <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-2'}>
              {line}
            </p>
          ))}
        </div>
        
        {isLongMessage && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-300 hover:text-primary-200 text-sm mt-2 focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-white font-bold text-xs">U</span>
        </div>
      )}
    </motion.div>
  );
}