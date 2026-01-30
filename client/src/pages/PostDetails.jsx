import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Zap, User, Tag, Info } from 'lucide-react';
import API from '../api/axios';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await API.get(`/posts/${id}`);
                setPost(res.data.post);
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-slate-900" size={32} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Details...</p>
        </div>
    );

    if (!post) return <div className="text-center py-20 font-black text-slate-400">POST NOT FOUND</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Simple Back Navigation */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-slate-400 hover:text-black font-black text-[10px] uppercase tracking-[0.2em] mb-10 transition-colors"
            >
                <ArrowLeft size={14} className="mr-2" /> Back to Marketplace
            </button>

            {/* 1. Title on Top */}
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-6 italic">
                    {post.title}.
                </h1>

                {/* 2. Category & Type with Nice Backgrounds */}
                <div className="flex flex-wrap gap-3">
                    <span className="flex items-center px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm">
                        <Tag size={12} className="mr-2" /> {post.category}
                    </span>
                    <span className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                        {post.type}ing Expertise
                    </span>
                    <span className="flex items-center px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100">
                        <Zap size={12} className="mr-1 fill-amber-600" /> 1 HelpPoint
                    </span>
                </div>
            </header>

            <div className="space-y-16">
                {/* 3. Description Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-1 bg-slate-900 rounded-full"></div>
                        <h3 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em]">Description</h3>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                            {post.description}
                        </p>
                    </div>
                </section>

                {/* 4. About Owner Section */}
                <section className="pb-20">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
                        <h3 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em]">About Owner</h3>
                    </div>
                    
                    <div className="flex items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <img 
                            src={post.owner?.avatar?.url || `https://ui-avatars.com/api/?name=${post.owner?.name}&background=333131&color=fff&bold=true`} 
                            className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white" 
                            alt="Owner"
                        />
                        <div className="ml-6">
                            <h4 className="font-black text-slate-900 text-xl leading-none mb-2">{post.owner?.name}</h4>
                            <div className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                <User size={12} className="mr-1" /> Verified Skill Share Member
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PostDetails;