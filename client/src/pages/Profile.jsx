import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Award, Edit3, ShieldCheck, Sparkles } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Professional Fallback Avatar
    const userAvatar = user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff&bold=true`;

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            {/* Minimalist Header */}
            <header className="mb-12 flex justify-between items-end px-2">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Account</h1>
                    <p className="text-slate-400 font-medium mt-2">Personalize your identity on SkillSwap</p>
                </div>
                <div className="hidden md:block">
                    <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {user?.helpPoints > 100 ? '⭐ Elite Member' : '⚡ Active Swapper'}
                    </span>
                </div>
            </header>

            <div className="relative">
                {/* Main Profile Card */}
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    
                    {/* Artistic Cover Area */}
                    <div className="h-56 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>
                    
                    <div className="px-12 pb-12">
                        {/* Avatar & Action Button Area */}
                        <div className="relative -mt-24 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="relative group p-2 bg-white rounded-[3.5rem] shadow-2xl">
                                <img 
                                    src={userAvatar} 
                                    alt="Profile" 
                                    className="w-44 h-44 rounded-[3rem] object-cover border-2 border-slate-50 shadow-inner"
                                />
                                <div className="absolute bottom-1 right-1 bg-green-500 p-2.5 rounded-2xl border-4 border-white shadow-lg">
                                    <ShieldCheck size={22} className="text-white" />
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/profile/edit')}
                                className="group flex items-center space-x-3 bg-slate-900 text-white px-10 py-4.5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                            >
                                <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                                <span>Customize Profile</span>
                            </button>
                        </div>

                        {/* Profile Identity Text */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center">
                                {user?.name}
                                <Sparkles size={24} className="ml-3 text-amber-400" />
                            </h2>
                            <p className="text-slate-400 font-bold mt-1 uppercase text-[11px] tracking-widest">Member since 2024</p>
                        </div>

                        {/* Balanced 3-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* Official Name */}
                            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all group">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Official Name</p>
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <User size={24} />
                                    </div>
                                    <span className="font-bold text-slate-700 text-lg leading-tight">{user?.name}</span>
                                </div>
                            </div>

                            {/* Account Email */}
                            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all group">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Account Email</p>
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <span className="font-bold text-slate-700 text-lg break-all leading-tight">{user?.email}</span>
                                </div>
                            </div>

                            {/* Help Credits Balance - Now integrated into the row */}
                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-6">Help Credits</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <span className="text-3xl font-black block leading-none">{user?.helpPoints || 0}</span>
                                            <span className="text-[10px] font-bold text-indigo-200/80 uppercase tracking-tighter">Available Balance</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Icon */}
                                <Award size={100} className="absolute -right-6 -bottom-6 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;