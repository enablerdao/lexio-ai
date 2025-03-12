import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
  const { 
    conversations, 
    activeConversationId, 
    switchConversation, 
    createNewConversation, 
    deleteConversation,
    renameConversation,
    clearConversation
  } = useChat();
  const { isDarkMode, toggleTheme } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  
  // Handle conversation switching and close sidebar on mobile
  const handleConversationClick = (id) => {
    switchConversation(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleRename = (id, currentTitle) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };

  const saveRename = (id) => {
    if (newTitle.trim()) {
      renameConversation(id, newTitle);
    }
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-gray-900 border-r border-white/10 z-50 flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Conversations</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <button
                onClick={createNewConversation}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New Conversation</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              {conversations.length === 0 ? (
                <div className="text-center text-white/50 p-4">
                  No conversations yet
                </div>
              ) : (
                <div className="space-y-1 px-2">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`relative group rounded-lg transition-colors ${
                        activeConversationId === conversation.id 
                          ? 'bg-white/10' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {editingId === conversation.id ? (
                        <div className="p-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(conversation.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-full bg-black/30 border border-white/20 rounded p-1 text-white text-sm"
                          />
                          <div className="flex justify-end space-x-1 mt-1">
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => saveRename(conversation.id)}
                              className="px-2 py-0.5 text-xs bg-primary-600 hover:bg-primary-500 rounded text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConversationClick(conversation.id)}
                          className="w-full text-left p-2 text-white/90 flex flex-col"
                        >
                          <span className="font-medium truncate">{conversation.title}</span>
                          <span className="text-xs text-white/50">
                            {formatDate(conversation.createdAt)}
                          </span>
                        </button>
                      )}
                      
                      {/* Actions */}
                      {editingId !== conversation.id && (
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRename(conversation.id, conversation.title);
                            }}
                            className="p-1 text-white/70 hover:text-white bg-black/20 rounded"
                            title="Rename"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this conversation?')) {
                                deleteConversation(conversation.id);
                              }
                            }}
                            className="p-1 text-white/70 hover:text-white bg-black/20 rounded"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/10 space-y-2">
              {activeConversationId && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear the current conversation?')) {
                      clearConversation();
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Clear Conversation</span>
                </button>
              )}
              
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}