import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
            });

            navigate("/login", { state: { message: "Account created successfully! Please login." } });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#0b0e17] text-white flex flex-col justify-between overflow-hidden select-none">
            {/* Ambient Lighting Background Accents (Clipped) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-[130px]"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/15 rounded-full blur-[130px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-[140px]"></div>
            </div>

            {/* Top Navigation Bar aligned more to the left */}
            <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative w-11 h-11 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00d2ff]/30 to-[#9d4edd]/30 rounded-2xl blur-md group-hover:scale-110 transition-transform duration-300"></div>
                        <svg
                            className="w-11 h-11 relative z-10 drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]"
                            viewBox="0 0 40 40"
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="regHpMusicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d2ff" />
                                    <stop offset="50%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#9d4edd" />
                                </linearGradient>
                            </defs>
                            {/* Bolder Headband */}
                            <path
                                d="M 8.5 21 C 8.5 11, 13.5 5.5, 20 5.5 C 26.5 5.5, 31.5 11, 31.5 21"
                                stroke="url(#regHpMusicGrad)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            />
                            {/* Headband top cushion */}
                            <path
                                d="M 14 8 C 16.5 6.8, 20 6.5, 26 8"
                                stroke="url(#regHpMusicGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            {/* Bolder Left earcup */}
                            <rect x="5" y="18" width="7" height="14" rx="3.5" fill="url(#regHpMusicGrad)" />
                            {/* Bolder Right earcup */}
                            <rect x="28" y="18" width="7" height="14" rx="3.5" fill="url(#regHpMusicGrad)" />
                            {/* Bolder Soundwave audio pulse inside */}
                            <path
                                d="M 16 23 V 27 M 20 19 V 31 M 24 23 V 27"
                                stroke="url(#regHpMusicGrad)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#9d4edd] bg-clip-text text-transparent font-sans">
                        Moodify
                    </span>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0b0e17] bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] px-4 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </button>
            </header>

            {/* Centered Glassmorphic Form Card */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full max-w-sm sm:max-w-md relative"
                >
                    {/* Glowing card border aura */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-2xl blur-lg opacity-75"></div>

                    <div className="relative bg-[#0d1222]/90 backdrop-blur-2xl border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.08)] px-6 py-5 sm:px-8 sm:py-6 rounded-2xl">
                        {/* Header icon badge with bolder headphone */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9d4edd]/20 via-[#38bdf8]/10 to-[#00d2ff]/15 border border-[#00d2ff]/30 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(0,210,255,0.25)]">
                            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                                <path
                                    d="M 8.5 21 C 8.5 11, 13.5 5.5, 20 5.5 C 26.5 5.5, 31.5 11, 31.5 21"
                                    stroke="url(#regHpMusicGrad)"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                />
                                <rect x="5" y="18" width="7" height="14" rx="3.5" fill="url(#regHpMusicGrad)" />
                                <rect x="28" y="18" width="7" height="14" rx="3.5" fill="url(#regHpMusicGrad)" />
                                <path
                                    d="M 16 23 V 27 M 20 19 V 31 M 24 23 V 27"
                                    stroke="url(#regHpMusicGrad)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white tracking-tight text-center">
                            Create Account
                        </h2>
                        <p className="text-slate-400 text-xs text-center mt-1 mb-4 font-normal">
                            Unlock AI-curated music tuned to your emotions
                        </p>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs text-center flex items-center justify-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Full Name Field */}
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Alex Mercer"
                                        required
                                        className="w-full pl-9 pr-3.5 py-2 bg-[#121826] border border-slate-700/60 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-200"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-9 pr-3.5 py-2 bg-[#121826] border border-slate-700/60 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 6 characters"
                                        required
                                        className="w-full pl-9 pr-10 py-2 bg-[#121826] border border-slate-700/60 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-1.5 py-2.5 sm:py-3 bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#38bdf8] hover:to-[#00e5ff] text-[#0b0e17] font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_28px_rgba(0,229,255,0.45)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-[#0b0e17] border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Start Your Free Journey</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Switch Link */}
                        <div className="mt-3.5 pt-3 border-t border-slate-800 text-center">
                            <p className="text-xs text-slate-400">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Bottom Footer */}
            <footer className="relative z-10 w-full py-2.5 text-center text-[11px] text-slate-500 shrink-0">
                © 2026 Moodify | Bringing Emotions & Music Together
            </footer>
        </div>
    );
}
