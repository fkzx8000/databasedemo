import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { color } from "framer-motion";
import "./App.css";
// import AdvancedERDDiagram from "./ERD/AdvancedERDDiagram";
import EditorApp from "./ERD/EditorApp";
import ERDExplanation from "./ERD/ERDApp";
import NormalizationAnimationFull from "./NormalizationApp/NormalizationAnimationFull";
import NormalizationDemo from "./NormalizationApp/NormalizationDemo";

const components = {
  erdExplanation: {
    name: "ERD הסבר מקיף",
    component: <ERDExplanation />,
    color: "#9C27B0",
  },
  editor: {
    name: "מערכת שרטוט",
    component: <EditorApp />,
    color: "#4CAF50",
  },
  // advancedERD: {
  //   name: "Advanced ERD",
  //   component: <AdvancedERDDiagram />,
  //   color: "#2196F3",
  // },

  normalizationAnimation: {
    name: "אנימציית טבלאות",
    component: <NormalizationAnimationFull />,
    color: "#FF9800",
  },
  normalizationDemo: {
    name: "הדגמת נרמול",
    component: <NormalizationDemo />,
    color: "#E91E63",
  },
  // editor: {
  //   name: "FDs",
  //   component: <EditorApp />,
  //   color: "#4CAF50",
  // },
};

function App() {
  const [activeComponent, setActiveComponent] = useState<
    keyof typeof components | null
  >(null);

  return (
    <div
      className="app-container"
      style={{
        padding: "40px",
        backgroundColor: "#e8f0fe",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* כפתורי הניווט הצפים */}
      <AnimatePresence>
        {!activeComponent && (
          <motion.div
            className="nav-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              display: "flex",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            {Object.entries(components).map(([key, { name, color }]) => (
              <motion.button
                key={key}
                onClick={() =>
                  setActiveComponent(key as keyof typeof components)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  backgroundColor: color,
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "16px 32px",
                  fontSize: "1.1em",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* כפתור הסגירה */}
      <AnimatePresence>
        {activeComponent && (
          <motion.button
            onClick={() => setActiveComponent(null)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "1.2em",
              cursor: "pointer",
              zIndex: 1000,
            }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            ✕
          </motion.button>
        )}
      </AnimatePresence>

      {/* תוכן פעיל */}
      <AnimatePresence mode="wait">
        {activeComponent && (
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative",
              zIndex: 999,
            }}
          >
            {components[activeComponent].component}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
