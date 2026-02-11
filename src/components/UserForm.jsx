import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight } from 'lucide-react';

const UserForm = ({ onComplete }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete(name);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-[#242424] p-8 md:p-10 rounded-3xl shadow-2xl border border-[#333] relative overflow-hidden">
                    
                    {/* --- Decorative Top Bar --- */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#556B2F] to-[#8FBC8F]" />

                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-light text-[#E8F5E9] mb-2">Welcome</h2>
                        <p className="text-gray-500">Please Enter your Name </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-bold text-[#556B2F] uppercase tracking-wider ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8FBC8F] transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder=""
                                    className="w-full bg-[#1a1a1a] border border-[#333] text-gray-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all placeholder:text-gray-600 text-lg"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={!name.trim()}
                            whileHover={name.trim() ? { scale: 1.02 } : {}}
                            whileTap={name.trim() ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                name.trim()
                                    ? 'bg-[#E8F5E9] text-[#1a1a1a] hover:bg-[#8FBC8F] cursor-pointer shadow-[0_0_15px_rgba(143,188,143,0.3)]'
                                    : 'bg-[#333] text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Continue <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </form>

                </div>
            </motion.div>
        </div>
    );
};

export default UserForm;