import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ArrowLeft, Camera, Loader2, User, Mail, CheckCircle2 } from 'lucide-react';

const EditProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff&bold=true`);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        
        // This must match upload.single('avatar') in your backend route
        if (avatar) formData.append('avatar', avatar);

        try {
            // Path: /api/auth/update (based on your app.js)
            // Method: PATCH (based on your authRoute.js)
            const res = await API.patch('/auth/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setUser(res.data.user);
            alert("Profile Updated! ✨");
            navigate('/profile');
        } catch (err) {
            // DETAILED DEBUGGING LOGS
            if (err.response) {
                // The server responded with a status outside 2xx
                console.error("Backend Error Data:", err.response.data);
                console.error("Backend Status:", err.response.status);
                alert(`Error: ${err.response.data.message || 'Server Error'}`);
            } else if (err.request) {
                // The request was made but no response was received (CORS or Network issue)
                console.error("No Response Received:", err.request);
                alert("Network error: Server is not responding. Check your API URL and CORS settings.");
            } else {
                // Something else happened while setting up the request
                console.error("Request Setup Error:", err.message);
                alert("Request failed. Check your internet connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 px-4">
            <div className="mb-10 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/profile')}
                    className="group flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.2em] transition-all"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Cancel & Exit</span>
                </button>
                <div className="h-1 flex-1 mx-8 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-indigo-500 transition-all duration-700 ${loading ? 'w-full animate-pulse' : 'w-1/3'}`}></div>
                </div>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>
                
                <div className="p-12 md:p-16">
                    <header className="mb-12 text-center">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Personal Details</h2>
                        <p className="text-slate-400 font-medium mt-2">Keep your profile fresh and updated</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white p-2 rounded-[3.2rem] shadow-xl">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="w-40 h-40 rounded-[2.8rem] object-cover border-2 border-slate-50"
                                    />
                                    <label className="absolute inset-2 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-[2.8rem] opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-dashed border-white/40">
                                        <Camera className="text-white mb-2" size={28} />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mb-3 ml-1">Full Identity</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all text-lg placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mb-3 ml-1">Email Connection</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all text-lg placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit"
                            className="relative w-full group overflow-hidden bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-70"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                            <div className="relative flex items-center justify-center space-x-3">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Update Profile</span>
                                        <CheckCircle2 size={18} className="text-indigo-400 group-hover:text-white transition-colors" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;