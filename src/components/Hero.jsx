import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';

const Hero = ({ onStart }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-[#F5F5DC] via-white to-[#E0E0E0] opacity-80" />
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2 mb-8"
            >
                <div className="bg-primary/10 p-3 rounded-full">
                    <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary tracking-wide">VitaScan AI</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-2xl"
            >
                <h2 className="text-5xl md:text-7xl font-bold text-text-dark mb-6 leading-tight">
                    Your Personal <span className="text-primary">AI Health</span> Assistant
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto">
                    VitaScan AI is a machine learning–based system that detects possible vitamin deficiencies from symptoms, images, or medical data, enabling quick and non-invasive early health screening.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="btn-primary flex items-center gap-3 text-lg px-8 py-4 shadow-xl shadow-primary/20"
            >
                Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 text-sm text-gray-400"
            >
                Powered by VitaScan Technology
            </motion.footer>
        </div>
    );
};

export default Hero;
