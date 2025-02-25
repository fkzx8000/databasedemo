"use client";

import React from "react";
import ERDExplanation from "./ERDExplanation";
// import ERDDiagram from "./ERDDiagram";

/**
 * ERDApp – מציג הסברים מפורטים על ERD (כולל ישויות חלשות)
 * ולאחר מכן מציג דיאגרמה מונפשת עם דוגמה מלאה.
 */
const ERDApp: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#e8f0fe",
        minHeight: "100vh",
      }}
    >
      {/* הסבר תיאורטי על ERD */}
      <ERDExplanation />

      {/* כותרת לחלק הוויזואלי */}
      {/* <h2 style={{ textAlign: "center", color: "#333", marginTop: "30px" }}>
        הדגמת ERD ויזואלית (כולל ישות חלשה)
      </h2>

      {/* דיאגרמת ERD עם אנימציות 
      <div style={{ marginTop: "20px", marginBottom: "40px" }}>
        <ERDDiagram />
      </div> */}
    </div>
  );
};

export default ERDApp;
