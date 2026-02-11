import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';

const Hero = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
            
            {/* --- Background Glow Effects (Dark Theme) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#556B2F]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#8FBC8F]/10 rounded-full blur-[120px]" />

            {/* --- Logo Badge --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2 mb-8 bg-[#2a2a2a] border border-[#556B2F]/30 px-4 py-2 rounded-full"
            >
                <Leaf className="w-5 h-5 text-[#8FBC8F]" />
                <span className="text-[#E8F5E9] font-medium tracking-wide">VitaScan AI </span>
            </motion.div>

            {/* --- Main Heading --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl"
            >
                <h1 className="text-5xl md:text-7xl font-thin text-[#E8F5E9] mb-6 leading-tight">
                    Your Personal <br />
                    <span className="font-bold text-[#8FBC8F]">AI Health Assistant</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                   A machine learning based system that detects possible vitamin deficiencies from symptoms, images, or medical data, enabling quick and non-invasive early health screening 
                </p>
            </motion.div>

            {/* --- CTA Button --- */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative flex items-center gap-3 px-8 py-4 bg-[#E8F5E9] text-[#1a1a1a] rounded-full text-lg font-bold tracking-wide hover:bg-[#8FBC8F] transition-all shadow-[0_0_20px_rgba(232,245,233,0.2)] hover:shadow-[0_0_30px_rgba(143,188,143,0.5)]"
            >
                Start Diagnosis 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* --- Feature Grid (Footer) --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#333] pt-10 max-w-4xl w-full"
            >
                <div className="flex flex-col items-center gap-2">
                    <Zap className="w-6 h-6 text-[#556B2F]" />
                    <h3 className="text-gray-200 font-semibold">Instant Analysis</h3>
                    <p className="text-sm text-gray-500">Results in seconds</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#556B2F]" />
                    <h3 className="text-gray-200 font-semibold">Privacy First</h3>
                    <p className="text-sm text-gray-500">No data stored</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Activity className="w-6 h-6 text-[#556B2F]" />
                    <h3 className="text-gray-200 font-semibold">High Accuracy</h3>
                    <p className="text-sm text-gray-500">Powered by ResNet50</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;