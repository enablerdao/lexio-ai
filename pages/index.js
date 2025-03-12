import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
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
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>lexio.ai - AI Assistant</title>
        <meta name="description" content="lexio.ai - Advanced AI Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">lexio.ai</h1>
        <p className="description">Your advanced AI assistant</p>

        <div className="chat-container">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>👋 Hello! I'm lexio, your AI assistant. How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <div className="dot-typing"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p>© 2024 lexio.ai - All rights reserved</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          color: #0070f3;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1rem 0;
        }

        .chat-container {
          width: 100%;
          max-width: 800px;
          height: 70vh;
          display: flex;
          flex-direction: column;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-message {
          text-align: center;
          color: #666;
          margin: auto 0;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          word-break: break-word;
        }

        .user {
          align-self: flex-end;
          background-color: #0070f3;
          color: white;
          border-bottom-right-radius: 0.25rem;
        }

        .assistant {
          align-self: flex-start;
          background-color: #f0f0f0;
          color: #333;
          border-bottom-left-radius: 0.25rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 24px;
        }

        .dot-typing {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #666;
          color: #666;
          animation: dot-typing 1.5s infinite linear;
        }

        .dot-typing::before,
        .dot-typing::after {
          content: '';
          position: absolute;
          top: 0;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #666;
          color: #666;
        }

        .dot-typing::before {
          left: -12px;
          animation: dot-typing 1.5s infinite linear;
          animation-delay: 0s;
        }

        .dot-typing::after {
          left: 12px;
          animation: dot-typing 1.5s infinite linear;
          animation-delay: 0.75s;
        }

        @keyframes dot-typing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .input-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #eaeaea;
        }

        .input-form input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #eaeaea;
          border-radius: 0.5rem;
          margin-right: 0.5rem;
          font-size: 1rem;
        }

        .input-form button {
          padding: 0.75rem 1.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .input-form button:hover {
          background-color: #0051a8;
        }

        .input-form button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}