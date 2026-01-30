import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ChevronRight, Clock, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [myPosts, setMyPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', category: '', description: '', type: 'Offer' });
    
    const [isOtherCategory, setIsOtherCategory] = useState(false);

    const categories = [
        "Programming & Tech", "Design & Creative", "Business & Marketing",
        "Languages", "Music & Arts", "Health & Fitness",
        "Academic Tutoring", "Lifestyle & Hobbies", "Other"
    ];

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const userAvatar = user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=EEF2FF&color=4F46E5&bold=true`;

    const fetchMyPosts = async () => {
        try {
            const { data } = await API.get('/posts/my-posts');
            setMyPosts(data.posts || []);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await API.post('/posts', newPost);
            alert("Post created successfully! 🚀");
            setIsCreating(false);
            setIsOtherCategory(false);
            setNewPost({ title: '', category: '', description: '', type: 'Offer' });
            fetchMyPosts(); 
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create post");
        }
    };

    const handleDeletePost = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this post?")) return;
        try {
            await API.delete(`/posts/${id}`);
            fetchMyPosts();
        } catch (err) {
            alert("Failed to delete post");
        }
    };

    return (
        <div className="max-w-[1500px] mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {user?.name}! 👋</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your posts and tracked Help Credits below.</p>
                </div>

                <div 
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-5 p-3.5 px-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group min-w-[240px]"
                >
                    <div className="relative flex-shrink-0">
                        <img src={userAvatar} alt="User Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-50 shadow-sm" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-1.5">Account Details</p>
                        <div className="flex items-center text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                            <span className="text-sm">View Profile</span>
                            <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-2xl transform hover:scale-[1.02] transition-transform">
                    <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px]">Current Balance</p>
                    <div className="flex items-baseline mt-4">
                        <h2 className="text-7xl font-black tracking-tighter">{user?.helpPoints || 0}</h2>
                        <span className="ml-3 text-indigo-200 font-bold italic text-xl">Help Credits</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Posts</p>
                    <h2 className="text-5xl font-black text-slate-800 mt-2">{myPosts.length}</h2>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-indigo-300 transition-colors">
                    <p className="text-slate-400 text-sm font-medium italic">New Idea?</p>
                    <button onClick={() => setIsCreating(true)} className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg">
                        + Create Post
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 px-1">
                <h3 className="text-2xl font-black text-slate-800">My Recent Listings</h3>
                <button 
                    onClick={() => navigate('/my-posts')} 
                    className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 cursor-pointer transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                {/* Shows only 6 items (2 rows) */}
                {myPosts.slice(0, 6).map((post) => {
                    const isOffer = post.type === 'Offer';
                    return (
                        <div 
                            key={post._id} 
                            onClick={() => navigate(`/posts/${post._id}`)}
                            className={`bg-white p-8 rounded-[2.8rem] shadow-sm border-t-4 border-x border-b border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between ${
                                isOffer ? 'border-t-amber-400' : 'border-t-emerald-400'
                            }`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-100">
                                        {post.category}
                                    </span>
                                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${
                                        isOffer 
                                            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        {post.type}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-4">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 text-base font-medium line-clamp-2 min-h-[48px]">
                                    {post.description}
                                </p>
                            </div>
                            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <Clock size={14} className="mr-2" /> {getTimeAgo(post.createdAt)}
                                </div>
                                <button 
                                    onClick={(e) => handleDeletePost(e, post._id)}
                                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {myPosts.length === 0 && (
                    <div className="col-span-full py-10 text-center bg-white rounded-3xl border border-dashed border-slate-100">
                        <p className="text-slate-400 italic">You haven't created any posts yet.</p>
                    </div>
                )}
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Create a New Post</h2>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Master React in 30 Days" onChange={e => setNewPost({...newPost, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                                <select 
                                    className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-medium mb-3"
                                    value={isOtherCategory ? "Other" : (newPost.category || "")}
                                    onChange={(e) => {
                                        if (e.target.value === "Other") {
                                            setIsOtherCategory(true);
                                            setNewPost({ ...newPost, category: '' });
                                        } else {
                                            setIsOtherCategory(false);
                                            setNewPost({ ...newPost, category: e.target.value });
                                        }
                                    }}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {isOtherCategory && (
                                    <input className="w-full p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Type your custom category..." value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} autoFocus required />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Post Type</label>
                                <select className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" value={newPost.type} onChange={e => setNewPost({...newPost, type: e.target.value})} required>
                                    <option value="Offer">Offering to teach</option>
                                    <option value="Request">Requesting to learn</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 h-32" placeholder="Tell us more..." onChange={e => setNewPost({...newPost, description: e.target.value})} required />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => { setIsCreating(false); setIsOtherCategory(false); }} className="flex-1 py-4 font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700">Create Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;