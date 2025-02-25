"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedWeakEntityProps {
  entityName: string;
}

/**
 * AnimatedWeakEntity מציגה מלבן כפול (או שילוב מסגרות) כדי לסמל ישות חלשה.
 * נשתמש בצבע/מסגרת שונה להמחשה.
 */
const AnimatedWeakEntity: React.FC<AnimatedWeakEntityProps> = ({
  entityName,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
      style={{
        position: "relative",
        margin: "10px",
        width: "150px",
        height: "80px",
      }}
    >
      {/* המסגרת החיצונית */}
      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "80px",
          border: "3px dashed #ff6600",
          borderRadius: "10px",
          top: 0,
          left: 0,
        }}
      />
      {/* המסגרת הפנימית */}
      <div
        style={{
          position: "absolute",
          width: "130px",
          height: "60px",
          border: "3px solid #ff6600",
          borderRadius: "10px",
          top: "10px",
          left: "10px",
          backgroundColor: "#fff5e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h4 style={{ margin: 0, color: "#ff6600" }}>{entityName}</h4>
      </div>
    </motion.div>
  );
};

export default AnimatedWeakEntity;
