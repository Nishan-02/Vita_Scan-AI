import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import UserForm from './components/UserForm';
import AnalysisHub from './components/AnalysisHub';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'personalization', 'analysis'
  const [userName, setUserName] = useState('');

  const handleStart = () => {
    setView('personalization');
  };

  const handleUserSubmit = (name) => {
    setUserName(name);
    setView('analysis');
  };

  const handleReset = () => {
    setUserName('');
    setView('landing');
  };

  return (
    <div className="bg-[#F5F5DC] min-h-screen text-text-dark font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStart={handleStart} />
          </motion.div>
        )}

        {view === 'personalization' && (
          <motion.div
            key="personalization"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <UserForm onSubmit={handleUserSubmit} />
          </motion.div>
        )}

        {view === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisHub userName={userName} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
