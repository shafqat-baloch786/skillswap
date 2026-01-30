import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Clock, Trash2 } from 'lucide-react';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const fetchMyPosts = async () => {
        try {
            const { data } = await API.get('/posts/my-posts');
            const fetchedPosts = data.posts || (Array.isArray(data) ? data : []);
            setPosts(fetchedPosts);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching your posts", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigating to details when clicking delete
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await API.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p._id !== id));
        } catch (err) {
            alert("Failed to delete post");
        }
    };

    return (
        <div className="max-w-[1500px] mx-auto px-8">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">My Listings.</h1>
                    <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] mt-2">Manage your skill offers and requests</p>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading your listings...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post) => {
                        const isOffer = post.type === 'Offer';
                        
                        return (
                            <div 
                                key={post._id} 
                                onClick={() => navigate(`/posts/${post._id}`)}
                                className={`bg-white p-8 rounded-[2.8rem] shadow-sm border-t-4 border-x border-b border-slate-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                                    isOffer ? 'border-t-amber-400' : 'border-t-emerald-400'
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-100">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-tighter rounded-xl border border-indigo-100">
                                                <Clock size={13} className="mr-1.5" /> {getTimeAgo(post.createdAt)}
                                            </span>
                                        </div>
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${
                                            isOffer 
                                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        }`}>
                                            {post.type}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${isOffer ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                        <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-slate-500 mt-4 text-base font-medium line-clamp-2 min-h-[48px]">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        <span className="text-sm font-bold text-slate-800 leading-none mt-1">
                                            Active Listing
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => handleDelete(e, post._id)}
                                        className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm border border-red-100"
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {posts.length === 0 && !loading && (
                <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">You haven't posted any skills yet.</p>
                    <Link to="/dashboard" className="inline-block bg-[#333131] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all">
                        Create Your First Post
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyPosts;