import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ChatProvider } from '../contexts/ChatContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default MyApp;