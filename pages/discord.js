import { useEffect } from 'react';
import Head from 'next/head';

export default function Discord() {
  useEffect(() => {
    // Redirect to Discord invite
    window.location.href = 'https://discord.gg/lexioai';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <Head>
        <title>Redirecting to Discord - lexio.ai</title>
        <meta name="description" content="Redirecting to the lexio.ai Discord community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">L</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">Redirecting to Discord...</h1>
        <p className="text-white/70 mb-6">You'll be redirected to our Discord community in a moment.</p>
        <a 
          href="https://discord.gg/lexioai" 
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 font-medium"
        >
          Click here if you're not redirected automatically
        </a>
      </div>
    </div>
  );
}