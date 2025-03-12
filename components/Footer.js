import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-black/20 backdrop-blur-lg border-t border-white/10 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <p className="text-white/80 text-sm">
              © 2024 lexio.ai - All rights reserved
            </p>
          </div>
          
          <div className="flex space-x-6">
            {[
              { name: 'Twitter', href: '/twitter' },
              { name: 'GitHub', href: '/github' },
              { name: 'Discord', href: '/discord' },
              { name: 'Contact', href: '/contact' }
            ].map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}