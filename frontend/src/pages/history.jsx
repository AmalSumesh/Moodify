import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";
import api from "../services/api";

function History() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idToDelete, setIdToDelete] = useState(null);
    const { currentSong, isPlaying, playSong, togglePlay } = useContext(PlayerContext);
    const navigate = useNavigate();
    const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get("/mood/history");
                setSessions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleDelete = (id) => {
        setIdToDelete(id);
    };

    const confirmDelete = async () => {
        if (!idToDelete) return;

        try {
            await api.delete(`/mood/${idToDelete}`);
            setSessions(sessions.filter(session => session._id !== idToDelete));
        } catch (error) {
            console.error("Failed to delete session:", error);
            alert("Could not remove the session. Please try again.");
        } finally {
            setIdToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0e17] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 font-bold tracking-wider uppercase text-xs">Retrieving Memories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0e17] text-white selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden font-sans">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <header className="w-full px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0b0e17]/85 backdrop-blur-xl sticky top-0 z-40">
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
                                <linearGradient id="histHpMusicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d2ff" />
                                    <stop offset="50%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#9d4edd" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 8.5 21 C 8.5 11, 13.5 5.5, 20 5.5 C 26.5 5.5, 31.5 11, 31.5 21"
                                stroke="url(#histHpMusicGrad)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 14 8 C 16.5 6.8, 20 6.5, 26 8"
                                stroke="url(#histHpMusicGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <rect x="5" y="18" width="7" height="14" rx="3.5" fill="url(#histHpMusicGrad)" />
                            <rect x="28" y="18" width="7" height="14" rx="3.5" fill="url(#histHpMusicGrad)" />
                            <path
                                d="M 16 23 V 27 M 20 19 V 31 M 24 23 V 27"
                                stroke="url(#histHpMusicGrad)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent font-sans">
                        Moodify
                    </span>
                    <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-slate-500 font-semibold border-l border-slate-800 pl-3">
                        History
                    </span>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0b0e17] bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] px-4 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
            </header>

            {/* Content Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
                {/* Title Header */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                        Your{" "}
                        <span className="bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent">
                            Emotional Journey
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                        A chronological timeline of your emotional frequencies and synchronized music recommendations.
                    </p>
                </div>

                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Total Sessions</p>
                        <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#00d2ff] to-[#38bdf8] bg-clip-text text-transparent">
                            {sessions.length}
                        </p>
                    </div>

                    <div className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Recent Frequency</p>
                        <p className="text-2xl sm:text-3xl font-black text-white uppercase truncate">
                            {sessions.length > 0 ? sessions[0].mood : "None"}
                        </p>
                    </div>

                    <div className="bg-[#0d1222]/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-cyan-300 font-medium italic">
                            "Where words fail, music speaks."
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">
                            — Hans Christian Andersen
                        </p>
                    </div>
                </div>

                {/* Sessions Timeline List */}
                {sessions.length === 0 ? (
                    <div className="text-center py-16 bg-[#0d1222]/80 rounded-3xl border border-dashed border-slate-700/60">
                        <p className="text-slate-500 text-sm">No history found yet. Start your first session from the dashboard!</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-[#0b0e17] font-bold text-xs"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 pb-16">
                        {sessions.map((session) => (
                            <div
                                key={session._id}
                                className="bg-[#0d1222]/90 backdrop-blur-xl p-6 sm:p-7 rounded-2xl shadow-xl border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 relative group"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(session._id)}
                                    className="absolute top-6 right-6 p-2.5 rounded-xl bg-red-500/10 text-red-400 opacity-75 hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                                    title="Delete Session"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                {/* Session Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2 pr-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-2xl font-black capitalize text-white">
                                                {session.mood}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-gradient-to-r from-[#00d2ff]/20 to-[#9d4edd]/20 text-cyan-300 rounded-md border border-cyan-400/30 font-bold">
                                                Recorded
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono">
                                            {new Date(session.createdAt).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}{" "}
                                            at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Songs Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {session.songs.map((song) => {
                                        const isThisPlaying = currentSong?._id === song._id && isPlaying;
                                        const isThisCurrent = currentSong?._id === song._id;

                                        return (
                                            <div
                                                key={song._id}
                                                onClick={() => {
                                                    if (isThisCurrent) {
                                                        togglePlay();
                                                    } else {
                                                        playSong(song, session.songs);
                                                    }
                                                }}
                                                className={`p-4 rounded-xl border transition-all duration-300 group cursor-pointer flex flex-col justify-between ${
                                                    isThisPlaying
                                                        ? "bg-[#0d1222] border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)]"
                                                        : isThisCurrent
                                                        ? "bg-[#0d1222] border-purple-500/60"
                                                        : "bg-[#121826] border-slate-700/50 hover:border-cyan-400/40 hover:bg-[#151c2e]"
                                                }`}
                                            >
                                                <div className="mb-2">
                                                    <h4 className={`font-bold text-sm truncate transition-colors ${
                                                        isThisPlaying ? "text-cyan-300" : "text-white group-hover:text-cyan-300"
                                                    }`}>
                                                        {song.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                                            isThisPlaying
                                                                ? "bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-[#0b0e17] shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                                                                : "bg-slate-800 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-[#0b0e17]"
                                                        }`}>
                                                            {isThisPlaying ? (
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                                                            {isThisPlaying ? "Playing" : "Play"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-wider">
                                                            {song.genre}
                                                        </span>
                                                        {isThisPlaying && (
                                                            <div className="flex items-end gap-[2px] h-3">
                                                                <div className="w-[2px] h-full bg-cyan-400 animate-pulse"></div>
                                                                <div className="w-[2px] h-2/3 bg-purple-400 animate-pulse delay-75"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {idToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIdToDelete(null)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-sm bg-[#0d1222] border border-slate-700/60 rounded-3xl p-7 shadow-2xl overflow-hidden z-10"
                        >
                            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-400">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Erase this session?</h3>
                            <p className="text-slate-400 mb-6 text-xs leading-relaxed">
                                This will permanently remove this record from your history. This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIdToDelete(null)}
                                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default History;
