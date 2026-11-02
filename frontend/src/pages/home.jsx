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
                    <img
                        src="/favicon.svg"
                        alt="Moodify"
                        className="w-11 h-11"
                    />
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
                        Login
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
