"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedRelationshipProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label?: string; // טקסט לסימון סוג הקשר (1:1, 1:N, וכו')
  identifying?: boolean; // אם זה Identifying Relationship (קשר מזהה לישות חלשה)
}

const AnimatedRelationship: React.FC<AnimatedRelationshipProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  label,
  identifying = false,
}) => {
  const path1 = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  const strokeWidth = identifying ? 6 : 3; // קשר מזהה -> קו עבה יותר / כפול
  const strokeDasharray = identifying ? "6,2" : "0"; // לדוגמה, קו מקווקו אם מזהה, או כפול

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <motion.path
        d={path1}
        stroke="#333"
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {label && (
        <motion.text
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2 - 5}
          fill="#333"
          fontSize="14"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {label}
        </motion.text>
      )}
    </svg>
  );
};

export default AnimatedRelationship;
