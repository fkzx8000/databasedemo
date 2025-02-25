// NormalizationAnimationFull.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// הגדרות טיפוס לטבלאות בודדות
interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

// טיפוס לטבלאות מרובות (למשל, במצבים של 3NF, BCNF, 4NF)
interface MultiTableData {
  orders: TableData;
  customers: TableData;
}

// איחוד של טבלה בודדת או טבלאות מרובות
type TableDataType = TableData | MultiTableData;

// ----------------------
// דוגמאות לטבלאות עבור כל סוג נרמול (דוגמאות מותאמות לקהל ישראלי)
// ----------------------
const examples: {
  [key: string]: { before: TableDataType; after: TableDataType };
} = {
  "1NF": {
    before: {
      headers: ["מספר זיהוי", "שמות", "טלפונים"],
      rows: [[101, "נועה, יוסי", "03-1234567, 03-7654321"]],
    },
    after: {
      headers: ["מספר זיהוי", "שם", "טלפון"],
      rows: [
        [101, "נועה", "03-1234567"],
        [101, "יוסי", "03-7654321"],
      ],
    },
  },
  "3NF": {
    before: {
      headers: ["מספר הזמנה", "שם לקוח", "כתובת לקוח", "מוצר"],
      rows: [
        [201, "דנה", "רחוב הרצל 15, תל אביב", "טלפון חכם"],
        [202, "אבי", "רחוב בן גוריון 22, חיפה", "מחשב נייד"],
        [203, "דנה", "רחוב הרצל 15, תל אביב", "אוזניות"],
      ],
    },
    after: {
      orders: {
        headers: ["מספר הזמנה", "שם לקוח", "מוצר"],
        rows: [
          [201, "דנה", "טלפון חכם"],
          [202, "אבי", "מחשב נייד"],
          [203, "דנה", "אוזניות"],
        ],
      },
      customers: {
        headers: ["שם לקוח", "כתובת לקוח"],
        rows: [
          ["דנה", "רחוב הרצל 15, תל אביב"],
          ["אבי", "רחוב בן גוריון 22, חיפה"],
        ],
      },
    },
  },
  BCNF: {
    before: {
      headers: ["קורס", "מרצה", "ספר לימוד"],
      rows: [
        ["מערכות מידע", 'ד"ר לחם', "מבוא למערכות מידע"],
        ["מערכות מידע", 'ד"ר לחם', "מערכות מידע מתקדמות"],
        ["אלגוריתמים", 'ד"ר ירון', "תכנון אלגוריתמים"],
      ],
    },
    after: {
      orders: {
        headers: ["קורס", "מרצה"],
        rows: [
          ["מערכות מידע", 'ד"ר לחם'],
          ["אלגוריתמים", 'ד"ר ירון'],
        ],
      },
      customers: {
        headers: ["קורס", "ספר לימוד"],
        rows: [
          ["מערכות מידע", "מבוא למערכות מידע"],
          ["מערכות מידע", "מערכות מידע מתקדמות"],
          ["אלגוריתמים", "תכנון אלגוריתמים"],
        ],
      },
    },
  },
  "4NF": {
    before: {
      headers: ["תלמיד", "תחביב", "שפה"],
      rows: [
        ["רון", "כדורגל", "עברית"],
        ["רון", "כדורגל", "אנגלית"],
        ["רון", "קריאה", "עברית"],
        ["רון", "קריאה", "אנגלית"],
      ],
    },
    after: {
      orders: {
        headers: ["תלמיד", "תחביב"],
        rows: [
          ["רון", "כדורגל"],
          ["רון", "קריאה"],
        ],
      },
      customers: {
        headers: ["תלמיד", "שפה"],
        rows: [
          ["רון", "עברית"],
          ["רון", "אנגלית"],
        ],
      },
    },
  },
};

// ----------------------
// סגנון בסיסי לתאים
const cellStyle: React.CSSProperties = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ccc",
};

// פונקציה המחזירה צבע רקע בהתאם לעמודה ולמצב (לפני או אחרי)
const getCellBackground = (
  nf: string,
  header: string,
  isNormalized: boolean
): string => {
  if (nf === "1NF") {
    if (!isNormalized) {
      if (header === "שמות") return "#ffe6cc"; // כתום בהיר
      if (header === "טלפונים") return "#e6ffcc"; // ירוק בהיר
    } else {
      if (header === "שם") return "#ffcccc"; // אדום בהיר
      if (header === "טלפון") return "#cce5ff"; // כחול בהיר
    }
  } else if (nf === "3NF") {
    if (!isNormalized) {
      if (header === "כתובת לקוח") return "#ffe6cc";
    } else {
      if (header === "כתובת לקוח") return "#cce5ff";
    }
  } else if (nf === "BCNF") {
    if (!isNormalized) {
      if (header === "מרצה") return "#ffe6cc";
      if (header === "ספר לימוד") return "#e6ffcc";
    } else {
      if (header === "מרצה") return "#ffcccc";
      if (header === "ספר לימוד") return "#cce5ff";
    }
  } else if (nf === "4NF") {
    if (!isNormalized) {
      if (header === "תחביב") return "#ffe6cc";
      if (header === "שפה") return "#e6ffcc";
    } else {
      if (header === "תחביב") return "#ffcccc";
      if (header === "שפה") return "#cce5ff";
    }
  }
  return "#fff";
};

// ----------------------
// קומפוננטת טבלה עם אנימציה
interface AnimatedTableProps {
  data: TableData;
  title?: string;
  nf: string;
  isNormalized: boolean;
}

const AnimatedTable: React.FC<AnimatedTableProps> = ({
  data,
  title,
  nf,
  isNormalized,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      style={{ margin: "0 auto", maxWidth: "100%" }}
    >
      {title && (
        <h3
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#0073e6",
          }}
        >
          {title}
        </h3>
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        border={1}
      >
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                style={{
                  ...cellStyle,
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <motion.td
                  key={cellIndex}
                  style={{
                    ...cellStyle,
                    backgroundColor: getCellBackground(
                      nf,
                      data.headers[cellIndex],
                      isNormalized
                    ),
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {cell}
                </motion.td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

// קומפוננטה להצגת טבלאות (תומכת גם בטבלאות בודדות וגם בטבלאות מרובות)
interface TableDisplayProps {
  tableData: TableDataType;
  nf: string;
  isNormalized: boolean;
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  tableData,
  nf,
  isNormalized,
}) => {
  if ("orders" in tableData && "customers" in tableData) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <AnimatedTable
          data={tableData.orders}
          title="טבלת הזמנות"
          nf={nf}
          isNormalized={isNormalized}
        />
        <AnimatedTable
          data={tableData.customers}
          title="טבלת לקוחות"
          nf={nf}
          isNormalized={isNormalized}
        />
      </div>
    );
  }
  return (
    <AnimatedTable
      data={tableData as TableData}
      nf={nf}
      isNormalized={isNormalized}
    />
  );
};

// ----------------------
// קומפוננטת הבחירה והאנימציה הכוללת
const NormalizationAnimationFull: React.FC = () => {
  const [selectedNF, setSelectedNF] = useState<string>("1NF");
  const [isNormalized, setIsNormalized] = useState<boolean>(false);

  // בוחרים את הדוגמה בהתאם לנרמול שנבחר
  const currentExample = examples[selectedNF];

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>
        אנימציית טבלאות – תהליך נרמול
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "18px", marginRight: "10px", color: "#333" }}>
          בחר סוג נרמול:
        </label>
        <select
          value={selectedNF}
          onChange={(e) => {
            setSelectedNF(e.target.value);
            setIsNormalized(false);
          }}
          style={{
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="1NF">1NF</option>
          <option value="3NF">3NF</option>
          <option value="BCNF">BCNF</option>
          <option value="4NF">4NF</option>
        </select>
      </div>

      <button
        onClick={() => setIsNormalized(!isNormalized)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#0073e6",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isNormalized ? "הצג מצב לפני נרמול" : "הצג מצב לאחר נרמול"}
      </button>

      <AnimatePresence mode="wait">
        <TableDisplay
          key={isNormalized ? "after" + selectedNF : "before" + selectedNF}
          tableData={
            isNormalized ? currentExample.after : currentExample.before
          }
          nf={selectedNF}
          isNormalized={isNormalized}
        />
      </AnimatePresence>
    </div>
  );
};

export default NormalizationAnimationFull;
