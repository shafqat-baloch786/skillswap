import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-black tracking-tighter italic">
                    SKILL<span className="text-indigo-500">SWAP</span>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors">
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold tracking-wide text-indigo-400 uppercase bg-indigo-400/10 border border-indigo-400/20 rounded-full">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    Octopus Hackathon V1.0 Submission
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">
                    Trade Skills. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Build Community.
                    </span>
                </h1>

                <p className="text-slate-400 max-w-2xl mb-10 text-xl leading-relaxed">
                    The decentralized marketplace for peer-to-peer learning. 
                    Get <span className="text-yellow-400 font-bold">5 HelpPoints</span> upon registration to start swapping skills instantly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register" className="bg-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-500/25">
                        Register Now
                    </Link>
                    <a href="#how" className="bg-slate-800 border border-slate-700 px-10 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all">
                        How it works
                    </a>
                </div>
            </header>

            {/* Linear "How it Works" Section */}
            <section id="how" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">The Student-to-Teacher Journey</h2>
                    <p className="text-slate-400">A seamless loop of sharing and learning knowledge.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <StepCard 
                        number="01" 
                        title="Share Your Expertise" 
                        desc="Create a post offering a skill you've mastered. Your offer appears in the global marketplace for others to find." 
                    />
                    <StepCard 
                        number="02" 
                        title="Accept & Schedule" 
                        desc="Receive swap requests from interested peers. Accept a request and provide your meeting link and available time." 
                    />
                    <StepCard 
                        number="03" 
                        title="Earn & Repeat" 
                        desc="Once the session is over, mark the swap as completed to earn HelpPoints. Use them to learn new skills from others!" 
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 text-center border-t border-slate-800 bg-slate-950/50">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to help others and master new skills?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">Join the SkillSwap community today and start your decentralized learning journey.</p>
                <Link to="/register" className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl font-black hover:bg-indigo-500 hover:text-white transition-all">
                    Register to Start Swapping
                </Link>
            </footer>
        </div>
    );
};

/* Helper Component */
const StepCard = ({ number, title, desc }) => (
    <div className="group p-8 bg-slate-800/40 border border-slate-700 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300">
        <div className="text-5xl font-black text-white/20 group-hover:text-white/40 transition-colors mb-4 italic">
            {number}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">
            {title}
        </h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Home;