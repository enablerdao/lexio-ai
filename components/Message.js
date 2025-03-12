import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import CodeBlock from './CodeBlock';
import { useChat } from '../contexts/ChatContext';

export default function Message({ message, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const { editMessage, deleteMessage } = useChat();
  const textareaRef = useRef(null);
  const isUser = message.role === 'user';
  
  // If message is very long, truncate it and show a "Read more" button
  const isLongMessage = message.content.length > 500;
  const displayContent = isLongMessage && !isExpanded 
    ? message.content.substring(0, 500) + '...' 
    : message.content;

  // Handle code blocks in markdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return <CodeBlock code={String(children).replace(/\n$/, '')} language={language} />;
      }
      
      return inline ? (
        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      ) : (
        <CodeBlock code={String(children).replace(/\n$/, '')} />
      );
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, 0);
  };

  const handleSaveEdit = () => {
    editMessage(index, editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(index);
    }
  };

  const handleTextareaChange = (e) => {
    setEditedContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`group flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white font-bold text-xs">L</span>
        </div>
      )}
      
      <div className={`relative max-w-[80%] ${isUser ? 'message-user' : 'message-assistant'}`}>
        {/* Message actions */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUser && (
            <button 
              onClick={handleEdit}
              className="p-1 text-white/70 hover:text-white bg-black/20 rounded"
              title="Edit message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="p-1 text-white/70 hover:text-white bg-black/20 rounded"
            title="Delete message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {isEditing ? (
          <div className="w-full">
            <textarea
              ref={textareaRef}
              value={editedContent}
              onChange={handleTextareaChange}
              className="w-full bg-black/30 border border-white/20 rounded p-2 text-white resize-none min-h-[100px]"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={handleCancelEdit}
                className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-2 py-1 text-sm bg-primary-600 hover:bg-primary-500 rounded text-white"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
              rehypePlugins={[rehypeHighlight]} 
              components={components}
            >
              {displayContent}
            </ReactMarkdown>
            
            {isLongMessage && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary-300 hover:text-primary-200 text-sm mt-2 focus:outline-none"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
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