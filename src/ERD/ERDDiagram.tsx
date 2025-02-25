"use client";

import React from "react";
import { motion } from "framer-motion";

// ישות רגילה עם תכונות
interface EntityProps {
  name: string;
  attributes: string[];
  borderColor?: string;
  bgColor?: string;
}

const Entity: React.FC<EntityProps> = ({
  name,
  attributes,
  borderColor,
  bgColor,
}) => {
  const bc = borderColor || "#0073e6";
  const background = bgColor || "#e6f7ff";
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        border: `2px solid ${bc}`,
        borderRadius: "8px",
        padding: "8px",
        backgroundColor: background,
        minWidth: "150px",
        margin: "10px",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0", color: bc }}>{name}</h3>
      <ul
        style={{
          margin: 0,
          paddingLeft: "20px",
          fontSize: "14px",
          color: "#333",
        }}
      >
        {attributes.map((attr, i) => (
          <li key={i}>{attr}</li>
        ))}
      </ul>
    </motion.div>
  );
};

// ישות חלשה – מלבן מקווקו כפול
interface WeakEntityProps {
  name: string;
  attributes: string[];
}

const WeakEntity: React.FC<WeakEntityProps> = ({ name, attributes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        margin: "10px",
        padding: "10px",
        width: "180px",
        minHeight: "80px",
      }}
    >
      {/* מסגרת חיצונית מקווקו */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "2px dashed #ff6600",
          borderRadius: "8px",
          pointerEvents: "none",
        }}
      />
      {/* מסגרת פנימית */}
      <div
        style={{
          position: "relative",
          padding: "10px",
          backgroundColor: "#fff5e6",
          borderRadius: "6px",
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "5px", color: "#ff6600" }}>
          {name}
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {attributes.map((attr, i) => (
            <li key={i}>{attr}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// קשרים (קו SVG) + טקסט באמצע
interface RelationshipProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: boolean; // אם נרצה קו מקווקו (לקשר מזהה של ישות חלשה)
}

const Relationship: React.FC<RelationshipProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  label,
  stroke = "#333",
  strokeWidth = 2,
  dash = false,
}) => {
  const pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  const dashArray = dash ? "5,5" : undefined;

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <motion.path
        d={pathData}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
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
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {label}
        </motion.text>
      )}
    </svg>
  );
};

// הקומפוננטה שמציגה את הדיאגרמה כולה
const ERDDiagram: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "800px",
    height: "500px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
  };

  // מיקומים עבור היישויות
  const clientPos = { x: 80, y: 60 };
  const orderPos = { x: 330, y: 60 };
  const productPos = { x: 600, y: 60 };
  const orderItemPos = { x: 330, y: 280 };

  return (
    <div style={containerStyle}>
      {/* לקוח */}
      <div
        style={{ position: "absolute", left: clientPos.x, top: clientPos.y }}
      >
        <Entity
          name="לקוח"
          attributes={["customer_id (PK)", "name", "phone", "address"]}
          borderColor="#0073e6"
          bgColor="#e6f7ff"
        />
      </div>

      {/* הזמנה */}
      <div style={{ position: "absolute", left: orderPos.x, top: orderPos.y }}>
        <Entity
          name="הזמנה"
          attributes={[
            "order_id (PK)",
            "order_date",
            "total_amount",
            "customer_id (FK)",
          ]}
          borderColor="#0073e6"
          bgColor="#e6f7ff"
        />
      </div>

      {/* מוצר */}
      <div
        style={{ position: "absolute", left: productPos.x, top: productPos.y }}
      >
        <Entity
          name="מוצר"
          attributes={["product_id (PK)", "product_name", "price"]}
          borderColor="#009966"
          bgColor="#ecfff2"
        />
      </div>

      {/* פרטי הזמנה (ישות חלשה) */}
      <div
        style={{
          position: "absolute",
          left: orderItemPos.x,
          top: orderItemPos.y,
        }}
      >
        <WeakEntity
          name="פרטי הזמנה"
          attributes={[
            "(order_id + line_no) (PK)",
            "quantity",
            "unit_price",
            "product_id (FK)",
          ]}
        />
      </div>

      {/* קשרים */}
      {/* לקוח - הזמנה: 1:N (נקרא גם N:1 מהצד של הזמנה) */}
      <Relationship
        fromX={clientPos.x + 130}
        fromY={clientPos.y + 40}
        toX={orderPos.x - 10}
        toY={orderPos.y + 40}
        label="1:N"
      />

      {/* הזמנה - פרטי הזמנה: Identifying Relationship (ישות חלשה) */}
      <Relationship
        fromX={orderPos.x + 130}
        fromY={orderPos.y + 60}
        toX={orderItemPos.x + 80}
        toY={orderItemPos.y}
        label="מזהה"
        dash={true} // קו מקווקו
        strokeWidth={3}
      />

      {/* מוצר - פרטי הזמנה: נניח M:N (או 1:N, תלוי במודל) */}
      <Relationship
        fromX={productPos.x - 10}
        fromY={productPos.y + 40}
        toX={orderItemPos.x + 180}
        toY={orderItemPos.y + 40}
        label="M:N"
      />
    </div>
  );
};

export default ERDDiagram;
