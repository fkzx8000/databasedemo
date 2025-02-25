"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedEntityProps {
  entityName: string;
  color?: string; // נאפשר שליטה על הצבע
}

const AnimatedEntity: React.FC<AnimatedEntityProps> = ({
  entityName,
  color,
}) => {
  const borderColor = color || "#0073e6";
  const bgColor = color ? "#f0faff" : "#e6f7ff";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      style={{
        width: "150px",
        height: "80px",
        border: `3px solid ${borderColor}`,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        margin: "10px",
      }}
    >
      <h3 style={{ margin: 0, color: borderColor }}>{entityName}</h3>
    </motion.div>
  );
};

export default AnimatedEntity;
