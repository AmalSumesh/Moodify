import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import History from "./pages/history";
import Register from "./pages/register";
import MainLayout from "./layouts/MainLayout";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

import MusicPlayer from "./components/MusicPlayer";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Home />
              </motion.div>
            }
          />

          <Route
            path="/login"
            element={
              <motion.div
                className="w-full h-screen overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Login />
              </motion.div>
            }
          />

          <Route
            path="/register"
            element={
              <motion.div
                className="w-full h-screen overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Register />
              </motion.div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/history"
            element={
              <MainLayout>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <History />
                </motion.div>
              </MainLayout>
            }
          />
        </Routes>
      </AnimatePresence>
      <MusicPlayer />
    </div>
  );
}

export default App;