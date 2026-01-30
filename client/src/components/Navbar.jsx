import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-black text-indigo-600 tracking-tighter">SkillSwap.</Link>
                <div className="space-x-6">
                    <Link to="/login" className="text-slate-600 font-bold hover:text-indigo-600">Login</Link>
                    <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:shadow-lg">Join</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;