import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Clock, Zap } from 'lucide-react';

const Marketplace = () => {
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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await API.get('/posts');
                const fetchedPosts = res.data.posts || (Array.isArray(res.data) ? res.data : []);
                setPosts(fetchedPosts);
            } catch (err) {
                console.error("Error fetching posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleSwapRequest = (e, post) => {
        e.stopPropagation(); 
        try {
            API.post('/swaps/request', { postId: post._id });
            const actionText = post.type === 'Request' ? 'offer' : 'request';
            alert(`Swap ${actionText} sent! Check 'My Swaps' for updates. 🚀`);
        } catch (err) {
            alert(err.response?.data?.message || "Error sending request");
        }
    };

    return (
        /* Expanded container to allow 3 cards to sit comfortably */
        <div className="max-w-[1500px] mx-auto px-8">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Marketplace.</h1>
                <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] mt-2">Discover skills to learn or teach</p>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Fetching Skills...</p>
                </div>
            ) : (
                /* 3 Columns with a larger gap (gap-12) */
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
                                    {/* Top Badges Row */}
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
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 text-[13px] font-black border border-slate-200 uppercase">
                                                {post.owner?.name?.charAt(0) || "U"}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-50">
                                                <Zap className="text-amber-400 fill-amber-400" size={12} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted by</span>
                                            <span className="text-sm font-bold text-slate-800 leading-none">
                                                {post.owner?.name || 'Member'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => handleSwapRequest(e, post)}
                                        className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                                            post.type === 'Request' 
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                                                : 'bg-[#333131] text-white hover:bg-indigo-600 shadow-slate-200'
                                        }`}
                                    >
                                        {post.type === 'Request' ? 'Offer' : 'Request'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {posts.length === 0 && !loading && (
                <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">The marketplace is empty. Be the first to post!</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;