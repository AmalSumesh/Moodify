import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";

export default function MusicPlayer() {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        audioFrequencyData,
        togglePlay,
        seek,
        nextSong,
        prevSong,
        setVolume,
        toggleMute,
        closePlayer,
    } = useContext(PlayerContext);

    const [isHovered, setIsHovered] = useState(false);

    if (!currentSong) return null;

    // Helper format seconds to mm:ss
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fixed bottom-3 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6 max-w-5xl mx-auto z-50 select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff]/20 via-[#38bdf8]/15 to-[#9d4edd]/25 rounded-3xl blur-xl opacity-80 pointer-events-none"></div>

                <div className="relative bg-[#0d1222]/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(0,210,255,0.12)]">
                    {/* Top Row: Track details, Audio Visualizer, Controls, Volume */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                        {/* Left: Track Information & Spinning Disc */}
                        <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00d2ff]/25 to-[#9d4edd]/30 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                                <motion.div
                                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                                    transition={isPlaying ? { repeat: Infinity, duration: 6, ease: "linear" } : { duration: 0.3 }}
                                    className="w-8 h-8 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center text-cyan-300"
                                >
                                    <span className="text-xs">♫</span>
                                </motion.div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-cyan-300 transition-colors">
                                    {currentSong.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                                        {currentSong.artist}
                                    </p>
                                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                                        {currentSong.genre}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Center: Realtime Audio Frequency Wave Visualizer & Controls */}
                        <div className="flex flex-col items-center w-full md:w-2/4">
                            {/* Real-Time Audio Frequency Bars */}
                            <div className="h-6 w-full max-w-sm flex items-end justify-center gap-[3px] px-2 mb-1.5 overflow-hidden">
                                {Array.from({ length: 28 }).map((_, i) => {
                                    const rawVal = audioFrequencyData[i] || 0;
                                    const heightPercent = isPlaying
                                        ? Math.max(12, Math.min(100, (rawVal / 255) * 100))
                                        : 10;

                                    return (
                                        <motion.div
                                            key={i}
                                            animate={{ height: `${heightPercent}%` }}
                                            transition={{ duration: 0.08, ease: "linear" }}
                                            className="w-[3px] rounded-full bg-gradient-to-t from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] shadow-[0_0_6px_rgba(0,210,255,0.4)]"
                                        />
                                    );
                                })}
                            </div>

                            {/* Playback Buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={prevSong}
                                    title="Previous Track"
                                    className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={togglePlay}
                                    title={isPlaying ? "Pause" : "Play"}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] text-[#0b0e17] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    {isPlaying ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </button>

                                <button
                                    onClick={nextSong}
                                    title="Next Track"
                                    className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right: Volume & Dismiss Controls */}
                        <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                    title={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted || volume === 0 ? (
                                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.02"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-16 sm:w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                />
                            </div>

                            <button
                                onClick={closePlayer}
                                title="Close Player"
                                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Interactive Scrub / Timeline Bar */}
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-mono w-9 text-right shrink-0">
                            {formatTime(currentTime)}
                        </span>

                        <div className="relative flex-1 group cursor-pointer flex items-center">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.1"
                                value={currentTime}
                                onChange={(e) => seek(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400 group-hover:h-2 transition-all"
                            />
                            {/* Glowing progress accent fill */}
                            <div
                                style={{ width: `${progressPercent}%` }}
                                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] rounded-full pointer-events-none"
                            ></div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono w-9 text-left shrink-0">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
