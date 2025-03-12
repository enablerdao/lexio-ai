import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrowserView from '../components/BrowserView';
import BrowserResult from '../components/BrowserResult';
import { useTheme } from '../contexts/ThemeContext';

export default function Workspace() {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('browser');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com');
  const [browserResult, setBrowserResult] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', content: 'Welcome to lexio.ai Terminal' },
    { type: 'system', content: 'Type commands below to interact with the system.' },
    { type: 'prompt', content: '$ ' }
  ]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, terminalOutput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { role: 'user', content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Clear input
    setInputText('');
    
    // Process command if in terminal mode
    if (activeTab === 'terminal') {
      processTerminalCommand(inputText);
      setIsLoading(false);
      return;
    }
    
    // Process browser command if in browser mode
    if (activeTab === 'browser') {
      try {
        // Import browser agent utilities
        const { executeBrowserTask, formatBrowserResult } = await import('../utils/browserAgent');
        
        // Execute browser task
        const browserTaskResult = await executeBrowserTask(inputText);
        
        // Update browser state
        if (browserTaskResult.success) {
          setBrowserResult(browserTaskResult.result);
          
          if (browserTaskResult.result.url) {
            setBrowserUrl(browserTaskResult.result.url);
          }
          
          // Format response for chat
          const formattedResponse = formatBrowserResult(browserTaskResult);
          
          // Add assistant response
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: formattedResponse
          }]);
        } else {
          // Handle error
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: `I encountered an error while trying to use the browser: ${browserTaskResult.error || 'Unknown error'}`
          }]);
        }
        
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Browser task error:', error);
        
        // Fallback to simple navigation for basic commands
        if (inputText.startsWith('go to ') || inputText.startsWith('navigate to ')) {
          const url = inputText.replace(/^(go to |navigate to )/i, '').trim();
          if (url) {
            let fullUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              fullUrl = 'https://' + url;
            }
            setBrowserUrl(fullUrl);
            
            // Add assistant response
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `Navigating to ${fullUrl}` 
            }]);
            setIsLoading(false);
            return;
          }
        }
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate response based on input
    let response;
    if (inputText.toLowerCase().includes('search') || inputText.toLowerCase().includes('find')) {
      response = `I'll search for information about "${inputText.replace(/search for|search|find/gi, '').trim()}".\n\nHere are some relevant results:\n\n1. Example search result #1\n2. Example search result #2\n3. Example search result #3`;
    } else if (inputText.toLowerCase().includes('weather')) {
      response = "Based on your location, here's the current weather:\n\nTemperature: 72°F (22°C)\nConditions: Partly Cloudy\nHumidity: 45%\nWind: 8 mph NW";
    } else if (inputText.toLowerCase().includes('code') || inputText.toLowerCase().includes('example')) {
      response = `Here's an example code snippet:\n\n\`\`\`javascript\n// Function to fetch data from an API\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    throw error;\n  }\n}\n\`\`\``;
    } else {
      response = `I've processed your request: "${inputText}"\n\nIs there anything specific you'd like me to help you with? You can ask me to search for information, check the weather, show code examples, or execute commands in the terminal.`;
    }
    
    // Add assistant response
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const processTerminalCommand = (command) => {
    // Add command to terminal output
    setTerminalOutput((prev) => [...prev, { type: 'command', content: command }]);
    
    // Process command
    let output;
    if (command.toLowerCase() === 'help') {
      output = [
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  help - Show this help message' },
        { type: 'output', content: '  clear - Clear the terminal' },
        { type: 'output', content: '  echo [text] - Display text' },
        { type: 'output', content: '  ls - List files in current directory' },
        { type: 'output', content: '  pwd - Print working directory' },
        { type: 'output', content: '  date - Show current date and time' }
      ];
    } else if (command.toLowerCase() === 'clear') {
      setTerminalOutput([
        { type: 'system', content: 'Terminal cleared' },
        { type: 'prompt', content: '$ ' }
      ]);
      return;
    } else if (command.toLowerCase().startsWith('echo ')) {
      const text = command.substring(5);
      output = [{ type: 'output', content: text }];
    } else if (command.toLowerCase() === 'ls') {
      output = [
        { type: 'output', content: 'documents  downloads  images  projects  README.md' }
      ];
    } else if (command.toLowerCase() === 'pwd') {
      output = [{ type: 'output', content: '/home/user' }];
    } else if (command.toLowerCase() === 'date') {
      output = [{ type: 'output', content: new Date().toString() }];
    } else {
      output = [{ type: 'error', content: `Command not found: ${command}` }];
    }
    
    // Add output and new prompt
    setTerminalOutput((prev) => [...prev, ...output, { type: 'prompt', content: '$ ' }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'
    }`}>
      <Head>
        <title>Workspace - lexio.ai</title>
        <meta name="description" content="lexio.ai workspace - interact with browser and terminal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onSidebarOpen={() => setIsSidebarOpen(true)} />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] gap-4">
            {/* Left side - Chat */}
            <div className="w-full md:w-1/2 flex flex-col glass-panel overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold">Chat</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-white/50 h-full flex flex-col items-center justify-center">
                    <p className="mb-4">Start a conversation to interact with the workspace.</p>
                    <p className="text-sm">Try commands like:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>"Search for quantum computing"</li>
                      <li>"Show me a JavaScript example"</li>
                      <li>"What's the weather like today?"</li>
                    </ul>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-primary-600 text-white rounded-br-none' 
                              : 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-bl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-bl-none">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-150"></div>
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none min-h-[40px] max-h-[120px]"
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className={`bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-r-lg transition-colors ${
                      !inputText.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
            
            {/* Right side - Workspace */}
            <div className="w-full md:w-1/2 flex flex-col glass-panel overflow-hidden">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('browser')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'browser' 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Browser
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'terminal' 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Terminal
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {activeTab === 'browser' ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center bg-white/5 p-2">
                      <input
                        type="text"
                        value={browserUrl}
                        onChange={(e) => setBrowserUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            let url = e.target.value;
                            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                              url = 'https://' + url;
                              setBrowserUrl(url);
                            }
                          }
                        }}
                        className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => {
                          let url = browserUrl;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                            setBrowserUrl(url);
                          }
                        }}
                        className="ml-2 p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 bg-white/5 p-4 overflow-y-auto">
                      <div className="bg-white rounded-lg p-4 h-full flex flex-col text-gray-800">
                        <div className="text-center mb-4">
                          <p className="text-lg font-semibold mb-2">Browser Interaction</p>
                          <p className="text-sm text-gray-600 mb-2">
                            Enter a command to control the browser:
                          </p>
                          <div className="flex mb-4">
                            <input 
                              type="text" 
                              value={inputText} 
                              onChange={(e) => setInputText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSubmit(e);
                                }
                              }}
                              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Example: search for quantum computing"
                            />
                            <button
                              onClick={handleSubmit}
                              disabled={!inputText.trim() || isLoading}
                              className={`bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-r-lg transition-colors ${
                                !inputText.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isLoading ? 'Processing...' : 'Execute'}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <BrowserView 
                            url={browserUrl} 
                            task={inputText}
                            result={browserResult}
                          />
                        </div>
                        
                        {browserResult && (
                          <div className="mt-4">
                            <BrowserResult result={browserResult} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gray-900 p-4 font-mono text-sm text-green-400 overflow-y-auto">
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {line.type === 'prompt' && <span>{line.content}</span>}
                        {line.type === 'command' && <span>{line.content}</span>}
                        {line.type === 'output' && <div className="pl-2">{line.content}</div>}
                        {line.type === 'error' && <div className="text-red-400 pl-2">{line.content}</div>}
                        {line.type === 'system' && <div className="text-blue-400">{line.content}</div>}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}