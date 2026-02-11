import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import UserForm from './components/UserForm';
import AnalysisHub from './components/AnalysisHub';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'personalization', 'analysis'
  const [userName, setUserName] = useState('');

  // --- Handlers ---
  const handleStart = () => {
    setView('personalization');
  };

  const handleUserSubmit = (name) => {
    setUserName(name);
    setView('analysis');
  };

  // Optional: If you want a full "Logout" feature later
  const handleReset = () => {
    setUserName('');
    setView('landing');
  };

  return (
    // Updated background to match the Dark Theme (#1a1a1a)
    <div className="bg-[#1a1a1a] min-h-screen text-gray-100 font-sans overflow-hidden relative">
      
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: HERO LANDING */}
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Hero onStart={handleStart} />
          </motion.div>
        )}

        {/* VIEW 2: USER FORM */}
        {view === 'personalization' && (
          <motion.div
            key="personalization"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <UserForm onComplete={handleUserSubmit} />
          </motion.div>
        )}

        {/* VIEW 3: MAIN ANALYSIS HUB */}
        {view === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <AnalysisHub userName={userName} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;