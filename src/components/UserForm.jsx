import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';

const UserForm = ({ onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F9F7]">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-dark mb-2">Welcome</h2>
                        <p className="text-gray-500">Let's get to know you better.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                                What is your name?
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
                                    placeholder="Enter your name"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <motion.button
                            disabled={!name.trim()}
                            whileHover={name.trim() ? { scale: 1.02 } : {}}
                            whileTap={name.trim() ? { scale: 0.98 } : {}}
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${name.trim()
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Next Step <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UserForm;
