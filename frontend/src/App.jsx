import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence,motion } from "framer-motion";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import History from "./pages/history";
import Register from "./pages/register";
import MainLayout from "./layouts/MainLayout";

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <MainLayout scene={null} showNotes={false}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Home />
                </motion.div>
              </MainLayout>
            }
          />


          <Route
            path="/login"
            element={
              <MainLayout
                scene={null}
                musicColors={["#ffff00"]}
                musicCount={30}
                showNotes={true}
              >
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/register"
            element={
              <MainLayout
                scene={null}
                musicColors={["#00ff88"]}
                musicCount={30}
                showNotes={true}
              >
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Register />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <MainLayout scene={null} showNotes={false}>
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
              <MainLayout scene={null} showNotes={false}>
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
    </div>
  );
}

export default App;