import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const cards = [
    {
      id: 'patient',
      title: 'Patient Dashboard',
      description: 'Access patient records and manage appointments',
      path: '/patient-dashboard',
      icon: '👨‍⚕️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'doctor',
      title: 'Doctor Dashboard',
      description: 'View assigned patients and update treatments',
      path: '/doctor-dashboard',
      icon: '👨‍⚕️',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'receptionist',
      title: 'Receptionist Dashboard',
      description: 'Manage patient registrations and appointments',
      path: '/receptionist-dashboard',
      icon: '👩‍💼',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * 100 - 50],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Hospital Management</span>
              <span className="block text-blue-400">System</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Choose your role to access the appropriate dashboard
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setHoveredCard(card.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`relative bg-gradient-to-br ${card.color} rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300" />
                  <div className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white/10 text-white text-2xl mb-4">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-medium text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-200">{card.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(card.path)}
                      className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      Access Dashboard
                    </motion.button>
                  </div>
                  {hoveredCard === card.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 