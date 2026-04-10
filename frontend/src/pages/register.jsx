import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
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
                name,
                email,
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
        <div className="min-h-screen w-full flex items-center justify-center px-4 pt-6">
            {/* Form Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl p-8 md:p-12 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <motion.button
                            onClick={() => navigate("/")}
                            className="flex justify-center mx-auto mb-4 bg-transparent border-none p-0 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src="/moodify.png" alt="Moodify" className="w-14 h-14" />
                        </motion.button>
                        <h2 className="text-3xl font-bold">Join Moodify</h2>
                        <p className="text-gray-400">Create your account to get started</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-200">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-200">Email Address</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-200">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary w-full mt-8"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{" "}
                        <motion.button
                            onClick={() => navigate("/login")}
                            whileHover={{ scale: 1.05 }}
                            className="text-neon-cyan font-semibold hover:text-neon-cyan/80 transition-colors"
                        >
                            Sign in
                        </motion.button>
                    </p>
                </div>

                {/* Terms Info */}
                <p className="text-center text-xs text-gray-600 mt-6">
                    By signing up, you agree to our Terms of Service
                </p>
            </motion.div>
        </div>
    );
}
