import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

export default function About() {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Alex has over 15 years of experience in AI and machine learning. Previously led AI research teams at major tech companies before founding lexio.ai.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sophia Rodriguez",
      role: "CTO",
      bio: "Sophia is an expert in natural language processing and conversational AI. She oversees the technical development and architecture of lexio.ai.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Product",
      bio: "Marcus brings a user-centered approach to product development, ensuring lexio.ai is intuitive, helpful, and delightful to use.",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      name: "Aisha Patel",
      role: "Lead AI Engineer",
      bio: "Aisha specializes in large language models and agent systems. She leads the development of lexio.ai's core intelligence.",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'
    }`}>
      <Head>
        <title>About - lexio.ai</title>
        <meta name="description" content="Learn about lexio.ai - our mission, story, and the team behind the advanced AI assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onSidebarOpen={() => setIsSidebarOpen(true)} />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              About lexio.ai
            </h1>
            <p className="text-xl max-w-3xl mx-auto dark:text-white/80 text-gray-600">
              Our mission is to make advanced AI accessible and helpful for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Our Story</h2>
              <div className="prose dark:prose-invert prose-lg">
                <p>
                  lexio.ai was founded in 2023 with a simple but powerful vision: to create an AI assistant that truly understands and helps people.
                </p>
                <p>
                  We saw that while AI was advancing rapidly, most applications were either too limited in their capabilities or too complex for everyday use. We set out to bridge this gap by building an assistant that combines powerful AI with intuitive design.
                </p>
                <p>
                  Today, lexio.ai is used by thousands of people around the world for research, learning, problem-solving, and creative work. We're constantly improving and expanding our capabilities to better serve our users.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Our Values</h2>
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <h3 className="font-semibold mb-1">User-Centered Design</h3>
                  <p className="dark:text-white/70 text-gray-600">We build for real people with real needs, prioritizing clarity, accessibility, and delight.</p>
                </div>
                <div className="glass-panel p-4">
                  <h3 className="font-semibold mb-1">Continuous Learning</h3>
                  <p className="dark:text-white/70 text-gray-600">We're committed to constant improvement, both for our AI and for ourselves as a team.</p>
                </div>
                <div className="glass-panel p-4">
                  <h3 className="font-semibold mb-1">Transparency & Trust</h3>
                  <p className="dark:text-white/70 text-gray-600">We're open about what our AI can and cannot do, and we respect user privacy and data.</p>
                </div>
                <div className="glass-panel p-4">
                  <h3 className="font-semibold mb-1">Responsible Innovation</h3>
                  <p className="dark:text-white/70 text-gray-600">We advance AI capabilities while being mindful of potential impacts and ethical considerations.</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold mb-8 text-center dark:text-white text-gray-900">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="glass-panel p-6 text-center"
                >
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm dark:text-primary-300 text-primary-600 mb-2">{member.role}</p>
                  <p className="text-sm dark:text-white/70 text-gray-600">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Join Us on Our Journey</h2>
            <p className="text-lg max-w-3xl mx-auto mb-8 dark:text-white/80 text-gray-600">
              We're just getting started, and we're excited about the future of AI assistants. Whether you're a user, developer, or potential partner, we'd love to connect with you.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center">
              <span>Get in Touch</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}