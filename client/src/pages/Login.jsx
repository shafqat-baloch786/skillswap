import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Zap, ShieldCheck, Globe, Code2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, user } = useAuth(); // Destructure user to check auth status
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            // Navigate is handled by the useEffect above once the 'user' state updates,
            // but adding it here ensures an immediate jump.
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Container */}
            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] z-10 min-h-[700px]">
                
                {/* Left Side: Brand Visual */}
                <div className="hidden lg:flex bg-[#131c31] p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30">
                            <Zap className="text-white fill-white" size={24} />
                        </div>
                        <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase">
                            Trade <br /> 
                            Knowledge. <br /> 
                            <span className="text-indigo-500 text-6xl">Grow</span> <br /> 
                            Together.
                        </h2>
                        
                        <p className="text-slate-300 mt-4 font-medium max-w-sm leading-relaxed text-lg">
                            The decentralized way to master new skills through community exchange.
                        </p>
                    </div>

                    <div className="relative z-10"> 
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center space-x-4 text-slate-200">
                                <Code2 size={20} className="text-indigo-500" />
                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">Open Source Core</span>
                            </div>
                            <div className="flex items-center space-x-4 text-slate-200">
                                <Globe size={20} className="text-indigo-500" />
                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">Global Peer Network</span>
                            </div>
                        </div>
                        <div className="h-[2px] w-14 bg-indigo-500 mb-4"></div>
                        <p className="text-slate-400 font-bold text-[12px] uppercase tracking-[0.4em]">Hackathon Build v1.0</p>
                    </div>
                </div>

                {/* Right Side: Auth Fields */}
                <div className="p-10 md:p-14 lg:px-20 lg:py-12 flex flex-col justify-center bg-white">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Welcome Back.</h1>
                        <p className="text-[#333131] font-bold text-[14px] uppercase tracking-[0.25em] mt-3 ml-1 opacity-95">Log in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Address */}
                        <div className="group space-y-1 border-b-2 border-[#333131] focus-within:border-indigo-600 transition-all pb-1">
                            <label className="text-[12px] font-black uppercase tracking-[0.2em] text-[#333131]">Email Address</label>
                            <div className="flex items-center">
                                <Mail className="text-[#333131] group-focus-within:text-indigo-600 transition-colors mr-4" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    placeholder="you@example.com"
                                    className="w-full py-1 bg-transparent outline-none font-bold text-[#333131] text-base placeholder:text-slate-400 placeholder:text-sm"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group space-y-1 border-b-2 border-[#333131] focus-within:border-indigo-600 transition-all pb-1">
                            <label className="text-[12px] font-black uppercase tracking-[0.2em] text-[#333131]">Password</label>
                            <div className="flex items-center">
                                <Lock className="text-[#333131] group-focus-within:text-indigo-600 transition-colors mr-4" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••"
                                    className="w-full py-1 bg-transparent outline-none font-bold text-[#333131] text-base placeholder:text-slate-400 placeholder:text-sm"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="relative w-full group overflow-hidden bg-[#333131] text-white py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-70 mt-4"
                        >
                            <div className="absolute inset-0 bg-indigo-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                            <div className="relative flex items-center justify-center space-x-3">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span className="text-[13px]">Sign In</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-12 text-center whitespace-nowrap border-t border-slate-50 pt-6">
                        <p className="text-[#333131] font-bold text-[13px] uppercase tracking-[0.15em]">
                            New to the community? 
                            <Link to="/register" className="ml-2 text-indigo-600 hover:text-indigo-800 transition-all border-b-2 border-indigo-100 hover:border-indigo-600 pb-1 font-black italic">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 flex items-center space-x-3 text-slate-500">
                <ShieldCheck size={18} className="text-indigo-500" />
                <span className="text-[12px] font-black uppercase tracking-[0.5em]">Octopus Hackathon V1.0 Submission</span>
            </div>
        </div>
    );
};

export default Login;