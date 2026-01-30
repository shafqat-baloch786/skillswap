import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { 
    LayoutDashboard, ShoppingBag, Repeat, FileText, 
    LogOut, ArrowRight, ChevronLeft 
} from 'lucide-react';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate(); // Hook to handle going back
    const [pendingActions, setPendingActions] = useState([]);

    // Determine if we should show the back button (don't show on dashboard)
    const isDashboard = location.pathname === '/dashboard';

    const fetchGlobalActions = async () => {
        try {
            const res = await API.get('/swaps/my-swaps');
            const actionable = res.data.swaps.filter(s => 
                s.post !== null && 
                s.post !== undefined &&
                (s.owner?._id === user?.id || s.owner === user?.id) && 
                s.status === 'Pending'
            );
            setPendingActions(actionable);
        } catch (err) { console.error("Error fetching activity feed:", err); }
    };

    useEffect(() => {
        if (user?.id) fetchGlobalActions();
        const interval = setInterval(fetchGlobalActions, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={20} /> },
    ];

    const managementLinks = [
        { name: 'My Posts', path: '/my-posts', icon: <FileText size={20} /> },
        { name: 'Swap Requests', path: '/swaps', icon: <Repeat size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-200 p-7 flex flex-col fixed h-full z-10 shadow-sm">
                <div className="flex-1 overflow-y-auto pr-2">
                    <h2 className="text-3xl font-black text-indigo-600 mb-10 italic tracking-tighter px-3">SkillSwap.</h2>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
                    <nav className="space-y-1 mb-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                                    location.pathname === link.path 
                                    ? 'text-indigo-600 font-bold bg-indigo-50 shadow-sm' 
                                    : 'text-slate-400 font-medium hover:bg-slate-50'
                                }`}
                            >
                                {link.icon} <span className="text-sm">{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Management</p>
                    <nav className="space-y-1 mb-10">
                        {managementLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                                    location.pathname === link.path 
                                    ? 'text-indigo-600 font-bold bg-indigo-50 shadow-sm' 
                                    : 'text-slate-400 font-medium hover:bg-slate-50'
                                }`}
                            >
                                {link.icon} <span className="text-sm">{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-slate-100 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Activity Feed</p>
                            {pendingActions.length > 0 && <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>}
                        </div>

                        {pendingActions.length > 0 ? (
                            <div className="space-y-3 px-1">
                                {pendingActions.slice(0, 3).map((swap) => (
                                    <div key={swap._id} className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                                        <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                                            {swap.requester?.name} <span className="text-slate-400 font-medium italic">wants</span> {swap.post?.title}
                                        </p>
                                        <Link to="/swaps" state={{ filter: 'Pending' }} className="mt-3 flex items-center text-[11px] font-black text-indigo-600 uppercase tracking-tighter hover:gap-2 transition-all">
                                            Take Action <ArrowRight size={14} className="ml-1" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem] mx-1">
                                <p className="text-slate-300 text-xs font-bold italic">No pending tasks</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-4">
                    <button onClick={logout} className="flex items-center space-x-3 text-slate-400 font-bold hover:text-red-500 p-4 w-full rounded-2xl transition-colors group hover:bg-red-50">
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 p-10 bg-slate-50 min-h-screen">
                {/* Back Navigation Button */}
                {!isDashboard && (
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mb-6 flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                            <ChevronLeft size={18} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">Back to previous</span>
                    </button>
                )}

                {children}
            </main>
        </div>
    );
};

export default Layout;