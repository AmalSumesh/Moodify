import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white">
            {/* Navigation Header */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-6 backdrop-blur-md bg-navy-900/80 border-b border-white/5">
                <motion.button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
                    whileHover={{ scale: 1.05 }}
                >
                    <img src="/moodify.png" alt="Moodify" className="w-10 h-10" />
                    <span className="text-xl font-bold tracking-wider hidden sm:inline">Moodify</span>
                </motion.button>

                <div className="flex gap-4">
                    <motion.button
                        onClick={() => navigate("/login")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline text-sm md:text-base"
                    >
                        Login
                    </motion.button>
                    <motion.button
                        onClick={() => navigate("/register")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary text-sm md:text-base"
                    >
                        Register
                    </motion.button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative pt-20">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        <span className="gradient-text-cyan">Feel Your Music</span>
                        <br />
                        <span className="text-white">Heal Your Soul</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mt-8 leading-relaxed"
                >
                    AI-powered music recommendations that understand your emotions in real-time.
                    Your mood, your music, your moment.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex gap-4 mt-12"
                >
                    <motion.button
                        onClick={() => navigate("/register")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                    >
                        Start Exploring
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline"
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-4 md:px-12">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
                    <p>© 2026 Moodify | Bringing Emotions & Music Together</p>
                </div>
            </footer>
        </div>
    );
}
