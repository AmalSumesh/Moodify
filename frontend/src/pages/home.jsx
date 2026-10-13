import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-[#0b0e17] text-white flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white">
            {/* Top Navigation - Full Width pushing logo to the left */}
            <header className="w-full px-6 sm:px-10 py-6 sm:py-7 flex items-center justify-between">
                {/* Brand Logo & Name */}
                <div 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3.5 cursor-pointer group select-none"
                >
                    <div className="relative w-11 h-11 flex items-center justify-center">
                        {/* Glowing backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00d2ff]/30 to-[#9d4edd]/30 rounded-2xl blur-md group-hover:scale-110 transition-transform duration-300"></div>
                        {/* Bolder Headphone SVG */}
                        <svg
                            className="w-11 h-11 relative z-10 drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]"
                            viewBox="0 0 40 40"
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="homeHpMusicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d2ff" />
                                    <stop offset="50%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#9d4edd" />
                                </linearGradient>
                            </defs>
                            {/* Bolder Headband */}
                            <path
                                d="M 8.5 21 C 8.5 11, 13.5 5.5, 20 5.5 C 26.5 5.5, 31.5 11, 31.5 21"
                                stroke="url(#homeHpMusicGrad)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            />
                            {/* Headband top cushion */}
                            <path
                                d="M 14 8 C 16.5 6.8, 20 6.5, 26 8"
                                stroke="url(#homeHpMusicGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            {/* Bolder Left earcup */}
                            <rect x="5" y="18" width="7" height="14" rx="3.5" fill="url(#homeHpMusicGrad)" />
                            {/* Bolder Right earcup */}
                            <rect x="28" y="18" width="7" height="14" rx="3.5" fill="url(#homeHpMusicGrad)" />
                            {/* Bolder Soundwave audio pulse inside */}
                            <path
                                d="M 16 23 V 27 M 20 19 V 31 M 24 23 V 27"
                                stroke="url(#homeHpMusicGrad)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent font-sans">
                        Moodify
                    </span>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 rounded-lg border border-cyan-400 text-white hover:text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10 transition font-medium text-sm"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-6 py-2 rounded-lg bg-[#00e5ff] text-[#0b0e17] font-semibold text-sm hover:brightness-110 transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto my-auto py-12">
                {/* Main Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.08] mb-6">
                    Feel Your{" "}
                    <span className="bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent">
                        Music
                    </span>
                    <br />
                    Heal Your Soul
                </h1>

                {/* Subtitle */}
                <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
                    AI-powered music recommendations that understand your emotions in real-time. Your mood, your music, your moment.
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(user ? "/dashboard" : "/register")}
                        className="px-8 py-3 rounded-lg bg-[#00e5ff] text-[#0b0e17] font-semibold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    >
                        Start Exploring
                    </button>
                    <button
                        onClick={() => navigate(user ? "/dashboard" : "/login")}
                        className="px-8 py-3 rounded-lg border border-cyan-400 text-cyan-300 font-medium text-sm sm:text-base hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-200 transition-all"
                    >
                        Learn More
                    </button>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="w-full py-8 text-center text-xs sm:text-sm text-slate-500">
                © 2026 Moodify | Bringing Emotions & Music Together
            </footer>
        </div>
    );
}
