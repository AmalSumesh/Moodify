import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import api from "../services/api";

function Dashboard() {
    const [mood, setMood] = useState("");
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [detectedEmotion, setDetectedEmotion] = useState("");
    const [detectionMode, setDetectionMode] = useState("manual"); // 'manual', 'text'
    const [userText, setUserText] = useState("");
    const { user, logout } = useContext(AuthContext);
    const { currentSong, isPlaying, playSong, togglePlay } = useContext(PlayerContext);
    const navigate = useNavigate();

    const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

    const handleDetect = async () => {
        if (!mood || loading) return;
        handleDetectMood(mood);
    };

    const handleDetectMood = async (targetMood) => {
        if (!targetMood || loading) return;
        setLoading(true);
        setError("");
        try {
            const { data } = await api.post("/mood/detect", { mood: targetMood });
            setSongs(data.recommendedSongs || data.songs || []);
            setDetectedEmotion(data.mood || targetMood);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleTextAnalysis = async () => {
        if (!userText.trim()) return;

        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/mood/ai-analysis", {
                text: userText
            });

            setMood(data.mood);
            setSongs(data.recommendedSongs);
            setDetectedEmotion(data.mood);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#0b0e17] text-white selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Top Navigation Bar pinned to top-left */}
            <header className="w-full px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0b0e17]/85 backdrop-blur-xl sticky top-0 z-40">
                {/* Brand Logo & Name */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                >
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00d2ff]/30 to-[#9d4edd]/30 rounded-2xl blur-md group-hover:scale-110 transition-transform duration-300"></div>
                        <svg
                            className="w-10 h-10 relative z-10 drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]"
                            viewBox="0 0 40 40"
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="dashHpMusicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d2ff" />
                                    <stop offset="50%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#9d4edd" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 8.5 21 C 8.5 11, 13.5 5.5, 20 5.5 C 26.5 5.5, 31.5 11, 31.5 21"
                                stroke="url(#dashHpMusicGrad)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 14 8 C 16.5 6.8, 20 6.5, 26 8"
                                stroke="url(#dashHpMusicGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <rect x="5" y="18" width="7" height="14" rx="3.5" fill="url(#dashHpMusicGrad)" />
                            <rect x="28" y="18" width="7" height="14" rx="3.5" fill="url(#dashHpMusicGrad)" />
                            <path
                                d="M 16 23 V 27 M 20 19 V 31 M 24 23 V 27"
                                stroke="url(#dashHpMusicGrad)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent font-sans">
                        Moodify
                    </span>
                    <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-slate-500 font-semibold border-l border-slate-800 pl-3">
                        Dashboard
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/history")}
                        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0b0e17] bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] px-4 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        History
                    </button>

                    <div className="relative">
                        <div
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-700/60 hover:border-cyan-400/40 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00e5ff] to-[#9d4edd] flex items-center justify-center text-[#0b0e17] font-black text-xs">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-slate-200 hidden md:inline-block max-w-[120px] truncate">
                                {user?.name}
                            </span>
                        </div>

                        {showProfile && (
                            <div className="absolute right-0 mt-3 w-64 bg-[#0d1222]/95 border border-slate-700/60 rounded-2xl p-5 shadow-2xl z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3">Profile Info</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-bold text-cyan-300">{user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-xs text-slate-300 font-mono truncate">{user?.email}</p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-800 space-y-2">
                                        <button
                                            onClick={() => navigate("/history")}
                                            className="w-full text-left text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
                                        >
                                            View History
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left text-xs font-semibold text-red-400 hover:text-red-300 transition"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Interaction Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
                            {/* Mode Switching Tabs */}
                            <div className="flex gap-4 mb-8 border-b border-slate-800 pb-3">
                                {[
                                    {
                                        id: "manual",
                                        label: "Quick Select",
                                        icon: (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                        )
                                    },
                                    {
                                        id: "text",
                                        label: "AI Analysis",
                                        icon: (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                                            </svg>
                                        )
                                    }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => {
                                            setDetectionMode(mode.id);
                                            setDetectedEmotion("");
                                            setSongs([]);
                                            setMood("");
                                            setError("");
                                        }}
                                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 cursor-pointer ${
                                            detectionMode === mode.id ? "text-cyan-400" : "text-slate-500 hover:text-white"
                                        }`}
                                    >
                                        {mode.icon}
                                        {mode.label}
                                        {detectionMode === mode.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00d2ff] to-[#9d4edd] shadow-[0_0_10px_rgba(0,210,255,0.8)]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {detectionMode === "manual" && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                                        How are you feeling right now?
                                    </h2>
                                    <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-xl">
                                        Select your current emotional state to discover AI-recommended songs tailored to your frequency.
                                    </p>

                                    <div className="flex gap-3 flex-wrap mb-8">
                                        {["happy", "calm", "angry", "sad", "energetic", "neutral"].map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMood(m)}
                                                className={`px-6 py-2.5 rounded-xl border text-xs sm:text-sm font-bold capitalize transition-all duration-300 cursor-pointer ${
                                                    mood === m
                                                        ? "bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] text-white border-transparent shadow-[0_0_20px_rgba(0,210,255,0.4)] scale-105"
                                                        : "bg-[#121826] border-slate-700/60 text-slate-300 hover:border-cyan-400/50 hover:text-white"
                                                }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleDetect}
                                        disabled={!mood || loading}
                                        className="bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] text-[#0b0e17] font-bold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? "Analyzing Frequencies..." : "Show Recommendations"}
                                    </button>
                                </div>
                            )}

                            {detectionMode === "text" && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                                        Describe Your Emotional State
                                    </h2>
                                    <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-xl">
                                        Tell us about your day, your feelings, or current vibes. Our AI model will decipher your exact emotional tone.
                                    </p>
                                    <textarea
                                        value={userText}
                                        onChange={(e) => setUserText(e.target.value)}
                                        placeholder="e.g. It was a long day at work and I'm feeling a bit overwhelmed, but looking for some peaceful tunes..."
                                        className="w-full bg-[#121826] border border-slate-700/60 rounded-2xl p-5 text-white text-sm placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all mb-6 h-36 resize-none"
                                    />
                                    <button
                                        onClick={handleTextAnalysis}
                                        disabled={loading || !userText.trim()}
                                        className="bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] text-[#0b0e17] font-bold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? "AI Underway — Analyzing..." : "Analyze with AI & Suggest Songs"}
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Error & Emotion Indicator */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-center font-semibold text-xs sm:text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {detectedEmotion && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <span className="px-6 py-2.5 bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] text-white font-extrabold rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,210,255,0.4)] inline-block">
                                        Detected Frequency: {detectedEmotion}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Songs Library */}
                        {songs.length > 0 ? (
                            <section className="space-y-4 animate-in fade-in duration-500">
                                <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                        Recommended Tracks
                                    </span>
                                    <span className="text-xs text-slate-400 font-normal">Click any track to play</span>
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {songs.map((song) => {
                                        const isThisPlaying = currentSong?._id === song._id && isPlaying;
                                        const isThisCurrent = currentSong?._id === song._id;

                                        return (
                                            <div
                                                key={song._id}
                                                onClick={() => {
                                                    if (isThisCurrent) {
                                                        togglePlay();
                                                    } else {
                                                        playSong(song, songs);
                                                    }
                                                }}
                                                className={`p-5 rounded-2xl border transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                                                    isThisPlaying
                                                        ? "bg-[#0d1222] border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.25)]"
                                                        : isThisCurrent
                                                        ? "bg-[#0d1222] border-purple-500/60"
                                                        : "bg-[#0d1222]/90 backdrop-blur-xl border-slate-700/50 hover:border-cyan-400/50 hover:bg-[#121826]"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="min-w-0 pr-3">
                                                        <h4 className={`font-bold text-base truncate transition-colors ${
                                                            isThisPlaying ? "text-cyan-300" : "text-white group-hover:text-cyan-300"
                                                        }`}>
                                                            {song.title}
                                                        </h4>
                                                        <p className="text-slate-400 text-xs mt-0.5 truncate">{song.artist}</p>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md uppercase shrink-0">
                                                        {song.genre}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                            isThisPlaying
                                                                ? "bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-[#0b0e17] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                                                                : "bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-[#0b0e17]"
                                                        }`}>
                                                            {isThisPlaying ? (
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                                                            {isThisPlaying ? "Now Playing" : "Play Track"}
                                                        </span>
                                                    </div>

                                                    {isThisPlaying && (
                                                        <div className="flex items-end gap-[2px] h-4">
                                                            <div className="w-[3px] h-full bg-cyan-400 animate-pulse rounded-full"></div>
                                                            <div className="w-[3px] h-2/3 bg-cyan-300 animate-pulse delay-75 rounded-full"></div>
                                                            <div className="w-[3px] h-full bg-purple-400 animate-pulse delay-150 rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : (
                            detectedEmotion &&
                            !loading && (
                                <div className="p-8 bg-[#0d1222]/80 rounded-2xl border border-slate-700/50 text-center">
                                    <p className="text-slate-400 text-sm">
                                        No songs currently found for frequency:{" "}
                                        <span className="text-cyan-400 font-bold capitalize">{detectedEmotion}</span>
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Sidebar Suggestions & Insights */}
                    <div className="space-y-6">
                        <div className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
                                <span>Mood Resonance</span>
                                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            </h4>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] w-3/4 rounded-full"></div>
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    High resonance today in <span className="text-cyan-300 font-semibold">{detectedEmotion || "Calm"}</span> tracks.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-3">
                                Audio Insights
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 text-sm">
                                        ♫
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Neural Mapping</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Music tempo dynamically mirrors your emotional state.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 text-sm">
                                        ⚡
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Frequency Shift</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Curated to uplift your energy and lower cognitive stress.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
