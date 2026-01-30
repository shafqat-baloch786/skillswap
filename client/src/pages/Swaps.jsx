import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
    Loader2, Zap, Clock, CheckCircle2, XCircle, Timer, 
    Trash2, ChevronLeft, ChevronRight, Calendar, Video, 
    Link as LinkIcon, ExternalLink, Mail
} from 'lucide-react';

const Swaps = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('incoming');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false); 
    const [selectedSwapId, setSelectedSwapId] = useState(null);
    const [meetingDetails, setMeetingDetails] = useState({ date: '', time: '', link: '' });
    const [linkError, setLinkError] = useState(false);

    const fetchSwaps = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/swaps/my-swaps?page=${currentPage}&limit=${limit}`);
            setSwaps(res.data.swaps || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Error fetching swaps:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSwaps();
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        if (currentPage === 1) fetchSwaps();
    }, [activeTab, statusFilter]);

    useEffect(() => {
        if (location.state?.filter) {
            setStatusFilter(location.state.filter);
            setActiveTab('incoming');
        }
    }, [location.state]);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleAcceptClick = (id) => {
        setSelectedSwapId(id);
        setLinkError(false);
        setSubmitting(false);
        setShowModal(true);
    };

    const confirmAcceptance = async () => {
        const { date, time, link } = meetingDetails;
        if (!date || !time || !link) return alert("Please provide all meeting details!");
        if (!link.toLowerCase().startsWith('http')) {
            setLinkError(true);
            return;
        }
        setSubmitting(true);
        try {
            setLinkError(false);
            await API.put(`/swaps/${selectedSwapId}/status`, { 
                status: 'Accepted',
                meetingDate: date,
                meetingTime: time,
                meetingLink: link 
            });
            setShowModal(false);
            setMeetingDetails({ date: '', time: '', link: '' });
            fetchSwaps();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (id, status) => {
        if (!id) return alert("Invalid Swap ID");
        try {
            await API.put(`/swaps/${id}/status`, { status });
            fetchSwaps();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    const finalizeSwap = async (id) => {
        if (!id) return alert("Invalid Swap ID");
        try {
            await API.post(`/swaps/${id}/complete`);
            fetchSwaps();
        } catch (err) {
            alert(err.response?.data?.message || "Completion failed");
        }
    };

    const validSwaps = swaps.filter(s => s.post !== null && s.post !== undefined);
    const incoming = validSwaps.filter(s => s.owner?._id === user?.id || s.owner === user?.id);
    const outgoing = validSwaps.filter(s => s.requester?._id === user?.id || s.requester === user?.id);
    const baseList = activeTab === 'incoming' ? incoming : outgoing;
    const displayList = statusFilter === 'All' ? baseList : baseList.filter(s => s.status === statusFilter);

    const filterOptions = ['All', 'Pending', 'Accepted', 'Completed', 'Rejected'];

    return (
        <div className="max-w-6xl mx-auto px-4 relative">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">My Swaps.</h1>
                    <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] mt-2">Manage your knowledge exchanges</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button onClick={() => setActiveTab('incoming')} className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'incoming' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>
                        Incoming 
                        <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeTab === 'incoming' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{incoming.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('outgoing')} className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'outgoing' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>
                        Outgoing 
                        <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeTab === 'outgoing' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{outgoing.length}</span>
                    </button>
                </div>
            </header>

            <div className="flex space-x-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {filterOptions.map((opt) => (
                    <button key={opt} onClick={() => setStatusFilter(opt)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all border-2 ${statusFilter === opt ? 'bg-[#333131] text-white border-[#333131] shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                        {opt}
                    </button>
                ))}
            </div>

            <div className="space-y-5 pb-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Loading Exchanges...</p>
                    </div>
                ) : displayList.length > 0 ? (
                    displayList.map((swap) => {
                        const otherUser = activeTab === 'incoming' ? swap.requester : swap.owner;
                        const otherUserAvatar = otherUser?.avatar?.url || `https://ui-avatars.com/api/?name=${otherUser?.name || 'User'}&background=EEF2FF&color=4F46E5&bold=true`;
                        
                        const isRequestType = swap.post?.type === 'Request';
                        const isCurrentUserReceiver = isRequestType 
                            ? (swap.owner?._id === user?.id || swap.owner === user?.id) 
                            : (swap.requester?._id === user?.id || swap.requester === user?.id);

                        return (
                            <div key={swap._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <Link to={`/posts/${swap.post?._id}`} className="relative flex-shrink-0 group">
                                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                                <img src={otherUserAvatar} alt="user" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 text-indigo-600">
                                                <Zap className="fill-indigo-600" size={12} />
                                            </div>
                                        </Link>

                                        <div className="flex-grow">
                                            <div className="flex items-center space-x-3">
                                                <Link to={`/posts/${swap.post?._id}`} className="group">
                                                    <h3 className="font-black text-slate-900 text-lg leading-tight hover:text-indigo-600 transition-colors">
                                                        {swap.post.title}
                                                    </h3>
                                                </Link>
                                                <span className="flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-tighter rounded-md">
                                                    <Clock size={12} className="mr-1" /> {getTimeAgo(swap.createdAt)}
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-slate-500 font-bold mt-1">
                                                {activeTab === 'incoming' ? (
                                                    isRequestType ? (
                                                        <><span className="text-slate-800">{otherUser?.name || 'Unknown User'}</span> wants to help</>
                                                    ) : (
                                                        <>Request from <span className="text-slate-800">{otherUser?.name || 'Unknown User'}</span></>
                                                    )
                                                ) : (
                                                    isRequestType ? (
                                                        <>You offered to help <span className="text-slate-800">{otherUser?.name || 'Unknown User'}</span></>
                                                    ) : (
                                                        <>Sent to <span className="text-slate-800">{otherUser?.name || 'Unknown User'}</span></>
                                                    )
                                                )}
                                            </p>

                                            <div className="mt-3">
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border-2 ${
                                                    swap.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                                    swap.status === 'Accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                    swap.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 mt-6 md:mt-0 w-full md:w-auto">
                                        {activeTab === 'incoming' && swap.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleAcceptClick(swap._id)} className="flex-1 md:flex-none bg-[#333131] text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md active:scale-95">Accept</button>
                                                <button onClick={() => updateStatus(swap._id, 'Rejected')} className="group flex items-center justify-center text-slate-400 font-black text-[11px] uppercase tracking-widest px-4 py-3 rounded-2xl hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} className="mr-2" /> Decline
                                                </button>
                                            </>
                                        )}

                                        {swap.status === 'Accepted' && isCurrentUserReceiver && (
                                            <button onClick={() => finalizeSwap(swap._id)} className="flex-1 md:flex-none bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-green-600 shadow-md active:scale-95 transition-all flex items-center justify-center whitespace-nowrap">
                                                <CheckCircle2 size={16} className="mr-2" /> Mark as completed
                                            </button>
                                        )}
                                        
                                        {swap.status === 'Accepted' && !isCurrentUserReceiver && (
                                            <div className="text-indigo-600 font-black text-[11px] uppercase tracking-widest flex items-center bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                                                <Timer size={16} className="mr-2" /> Accepted
                                            </div>
                                        )}

                                        {swap.status === 'Completed' && (
                                            <div className="text-green-600 font-black text-[11px] uppercase tracking-widest flex items-center bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                                                <CheckCircle2 size={16} className="mr-2" /> Completed
                                            </div>
                                        )}

                                        {swap.status === 'Rejected' && (
                                            <div className="text-red-400 font-black text-[11px] uppercase tracking-widest flex items-center bg-red-50 px-6 py-3 rounded-2xl border border-red-100">
                                                <XCircle size={16} className="mr-2" /> Rejected
                                            </div>
                                        )}

                                        {swap.status === 'Pending' && activeTab === 'outgoing' && (
                                            <div className="text-amber-500 font-black text-[11px] uppercase tracking-widest flex items-center bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 animate-pulse">
                                                <Clock size={16} className="mr-2" /> Awaiting
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SCHEDULED DETAILS SECTION */}
                                {swap.status === 'Accepted' && swap.meetingDate && (
                                    <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Meeting Time</span>
                                                <div className="flex items-center text-[13px] font-black text-slate-700">
                                                    <Calendar size={14} className="mr-2 text-indigo-500" /> {swap.meetingDate}
                                                    <Clock size={14} className="ml-4 mr-2 text-indigo-500" /> {swap.meetingTime}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Partner Email</span>
                                                <div className="flex items-center text-[13px] font-black text-slate-700 italic">
                                                    <Mail size={14} className="mr-2 text-indigo-500 not-italic" /> {otherUser?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <a 
                                            href={swap.meetingLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 group shadow-sm"
                                        >
                                            <Video size={16} className="mr-2" /> 
                                            Join Meeting 
                                            <ExternalLink size={14} className="ml-2 opacity-50 group-hover:opacity-100" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No {statusFilter.toLowerCase()} swaps found.</p>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8 pb-12">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3 rounded-2xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronLeft size={20} /></button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`w-12 h-12 rounded-2xl font-black text-xs ${currentPage === index + 1 ? 'bg-[#333131] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>{index + 1}</button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3 rounded-2xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronRight size={20} /></button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Schedule Session.</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">Set meeting details for this swap</p>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"><Calendar size={12} className="mr-2 text-indigo-500" /> Date</label>
                                    <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all" onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"><Clock size={12} className="mr-2 text-indigo-500" /> Time</label>
                                    <input type="time" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all" onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"><Video size={12} className="mr-2 text-indigo-500" /> Meeting Link</label>
                                <div className="relative">
                                    <input type="url" placeholder="https://meet.google.com/xyz" className={`w-full bg-slate-50 border-2 rounded-2xl pl-12 pr-5 py-4 font-bold text-sm outline-none transition-all ${linkError ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-slate-100 focus:border-indigo-500 focus:bg-white'}`} value={meetingDetails.link} onChange={(e) => { setLinkError(false); setMeetingDetails({...meetingDetails, link: e.target.value}); }} />
                                    <LinkIcon className={`absolute left-4 top-1/2 -translate-y-1/2 ${linkError ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                                </div>
                                {linkError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1 animate-pulse">Invalid URL. Must start with http:// or https://</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-10">
                            <button disabled={submitting} onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">Cancel</button>
                            <button disabled={submitting} onClick={confirmAcceptance} className="flex-[2] bg-[#333131] text-white px-4 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-70">
                                {submitting ? <><Loader2 className="animate-spin mr-2" size={16} /> Scheduling...</> : "Confirm Session"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Swaps;