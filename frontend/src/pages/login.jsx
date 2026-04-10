import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            login(data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to continue your musical journey</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4 text-neon-green text-sm text-center"
                        >
                            {successMessage}
                        </motion.div>
                    )}

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
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary w-full mt-8"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-400">
                        Don't have an account?{" "}
                        <motion.button
                            onClick={() => navigate("/register")}
                            whileHover={{ scale: 1.05 }}
                            className="text-neon-cyan font-semibold hover:text-neon-cyan/80 transition-colors"
                        >
                            Create one
                        </motion.button>
                    </p>
                </div>

                {/* Tech Stack Info */}
                <p className="text-center text-xs text-gray-600 mt-6">
                    Secured & encrypted | Your data is safe with us
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
