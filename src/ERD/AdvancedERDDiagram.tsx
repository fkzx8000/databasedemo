"use client";

import React from "react";

/**
 * טיפוס לעיצוב "תכונה":
 * - name: שם התכונה
 * - isKey: האם זו תכונה שהיא מפתח ראשי (PK)?
 * - isPartialKey: האם זו תכונה שהיא מפתח חלקי (בישות חלשה)?
 *   (נסמן בקו מקווקו)
 * - x, y: מיקום העיגול (center)
 */
interface AttributeProps {
  name: string;
  x: number;
  y: number;
  isKey?: boolean; // קו מלא מתחת לשם
  isPartialKey?: boolean; // קו מקווקו מתחת לשם
}

/**
 * קומפוננטה לציור תכונה (עיגול) עם טקסט בתוכו, וקו (underline) אם נדרש.
 */
const Attribute: React.FC<AttributeProps> = ({
  name,
  x,
  y,
  isKey,
  isPartialKey,
}) => {
  // רדיוס לעיגול
  const R = 30;
  // נשרטט טקסט במרכז העיגול
  const textX = x;
  const textY = y + 5;

  // כדי לסמן קו תחתון לטקסט, נצייר קו קצר מתחתיו
  // נחשב את אורך שם התכונה (בערך) כדי לקבוע היכן עובר הקו
  const textWidthApprox = name.length * 7;
  const halfW = textWidthApprox / 2;
  const lineY = textY + 4; // מעט מתחת לטקסט

  // אם זה מפתח חלקי -> dashed, אם זה מפתח ראשי -> solid
  let underlineStroke = "none";
  let underlineDash = "";
  if (isKey) {
    underlineStroke = "#000";
  }
  if (isPartialKey) {
    underlineStroke = "#000";
    underlineDash = "4,3"; // מקווקו
  }

  return (
    <>
      {/* עיגול התכונה */}
      <circle
        cx={x}
        cy={y}
        r={R}
        fill="#cce5ff"
        stroke="#333"
        strokeWidth={1.5}
      />
      {/* שם התכונה */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontSize="14"
        fill="#333"
        style={{ userSelect: "none" }}
      >
        {name}
      </text>
      {/* קו תחתון (אם מפתח) */}
      {underlineStroke !== "none" && (
        <line
          x1={textX - halfW}
          y1={lineY}
          x2={textX + halfW}
          y2={lineY}
          stroke={underlineStroke}
          strokeWidth={1}
          strokeDasharray={underlineDash}
        />
      )}
    </>
  );
};

/**
 * קומפוננטה המתארת יישות (מלבן).
 * - x,y: פינת המלבן
 * - width,height: גודל המלבן
 * - name: שם הישות
 * - isWeak: האם הישות חלשה (נשרטט מלבן כפול)
 */
interface EntityProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isWeak?: boolean;
}

const EntityBox: React.FC<EntityProps> = ({
  x,
  y,
  width,
  height,
  name,
  isWeak,
}) => {
  // מלבן חיצוני (אם ישות חלשה -> dashed border ? או מלבן כפול)
  // כאן נבחר במלבן כפול
  const outerRectProps = {
    x,
    y,
    width,
    height,
    fill: "#e6f2ff",
    stroke: "#333",
    strokeWidth: isWeak ? 2 : 2,
    strokeDasharray: isWeak ? "5,5" : undefined,
    rx: 5,
    ry: 5,
  };

  // מלבן פנימי אם isWeak === true
  const innerRectMargin = 5;
  const innerRectProps = {
    x: x + innerRectMargin,
    y: y + innerRectMargin,
    width: width - 2 * innerRectMargin,
    height: height - 2 * innerRectMargin,
    fill: "#e6f2ff",
    stroke: "#333",
    strokeWidth: 2,
    rx: 3,
    ry: 3,
  };

  // מיקום הטקסט
  const textX = x + width / 2;
  const textY = y + height / 2 + 5;

  return (
    <>
      {/* מלבן חיצוני */}
      <rect {...outerRectProps} />
      {isWeak && <rect {...innerRectProps} />}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontSize="16"
        fill="#333"
        style={{ userSelect: "none" }}
      >
        {name}
      </text>
    </>
  );
};

/**
 * קומפוננטה ליחס (Relationship) כמעוין
 * - centerX, centerY: מרכז המעוין
 * - name: שם היחס
 * - isIdentifying: אם זה קשר מזהה לישות חלשה => מעוין כפול
 */
interface RelationshipDiamondProps {
  centerX: number;
  centerY: number;
  name: string;
  isIdentifying?: boolean;
}

const RelationshipDiamond: React.FC<RelationshipDiamondProps> = ({
  centerX,
  centerY,
  name,
  isIdentifying,
}) => {
  // נשרטט מעוין על ידי polygon
  const size = 40;
  // ארבע נקודות סביב center
  const p1 = `${centerX},${centerY - size / 2}`; // למעלה
  const p2 = `${centerX + size / 2},${centerY}`; // ימין
  const p3 = `${centerX},${centerY + size / 2}`; // למטה
  const p4 = `${centerX - size / 2},${centerY}`; // שמאל
  const points = `${p1} ${p2} ${p3} ${p4}`;

  // אם isIdentifying => נשורטט שני מעוינים
  // קודם מעוין חיצוני, ואז מעוין פנימי
  const fillColor = "#fff";
  const strokeColor = "#333";

  return (
    <>
      {isIdentifying ? (
        <>
          {/* מעוין חיצוני גדול מעט */}
          <polygon
            points={points}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* מעוין פנימי קטן יותר */}
          <polygon
            points={
              `${centerX},${centerY - size / 2 + 4} ` +
              `${centerX + size / 2 - 4},${centerY} ` +
              `${centerX},${centerY + size / 2 - 4} ` +
              `${centerX - size / 2 + 4},${centerY}`
            }
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
        </>
      ) : (
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />
      )}
      {/* שם היחס */}
      <text
        x={centerX}
        y={centerY + 5}
        textAnchor="middle"
        fontSize="14"
        fill="#333"
        style={{ userSelect: "none" }}
      >
        {name}
      </text>
    </>
  );
};

/**
 * כיוון החץ: אם singleCardinality = true => מציירים חץ לכיוון
 * אם false => קו רגיל
 */
interface ConnectorProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  singleCardinality?: boolean; // אם זה 1 => חץ, אחרת קו
}

const Connector: React.FC<ConnectorProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  singleCardinality,
}) => {
  // נצייר קו
  // const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;

  return (
    <g>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="#000"
        strokeWidth={1.5}
      />
      {singleCardinality && (
        // ציור ראש חץ קטן בסוף הקו (ליד toX,toY)
        <polygon
          fill="#000"
          points={`
            ${toX},${toY} 
            ${toX - 6},${toY - 3} 
            ${toX - 6},${toY + 3}
          `}
        />
      )}
    </g>
  );
};

/**
 * קומפוננטה הראשית שמדגימה ERD:
 * - ישות רגילה A (3 Attributes)
 * - ישות חלשה WE (3 Attributes, עם partial key)
 * - יחס רגיל R1 בין A לישות אחרת
 * - יחס מזהה R2 בין WE ל-A
 */
const AdvancedERDDiagram: React.FC = () => {
  const width = 900;
  const height = 600;

  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#f0f0f0", border: "1px solid #ccc" }}
    >
      {/* ישות A (strong entity) */}
      <EntityBox
        x={100}
        y={100}
        width={120}
        height={60}
        name="A"
        isWeak={false}
      />

      {/* תכונות של A (a,b,c) - נניח 'a' הוא מפתח ראשי */}
      {/* נצייר שלושה עיגולים, כל עיגול עם קו שיוצא למרכז הישות */}
      <Connector fromX={160} fromY={100} toX={160} toY={70} />
      <Attribute name="a" x={160} y={40} isKey />

      <Connector fromX={100} fromY={130} toX={50} toY={160} />
      <Attribute name="b" x={50} y={180} />

      <Connector fromX={220} fromY={130} toX={280} toY={160} />
      <Attribute name="c" x={310} y={180} />

      {/* ישות חלשה WE */}
      <EntityBox
        x={250}
        y={350}
        width={150}
        height={60}
        name="WE"
        isWeak={true}
      />
      {/* תכונות של WE (a,b,c) - נניח 'a' הוא partialKey */}
      <Connector fromX={170} fromY={300} toX={170} toY={270} />
      <Attribute
        name="a"
        x={170}
        y={240}
        isPartialKey // קו מקווקו
      />

      <Connector fromX={100} fromY={330} toX={50} toY={370} />
      <Attribute name="b" x={50} y={390} />

      <Connector fromX={250} fromY={330} toX={300} toY={370} />
      <Attribute name="c" x={330} y={390} />

      {/* יחס רגיל R1 */}
      <RelationshipDiamond
        centerX={400}
        centerY={120}
        name="R1"
        isIdentifying={false}
      />

      {/* קו מישות A לריגולרי R1: נניח singleCardinality => נוסיף חץ */}
      <Connector
        fromX={220}
        fromY={130}
        toX={400}
        toY={120}
        singleCardinality
      />

      {/* ישות אחרת X (strong) */}
      <EntityBox x={500} y={90} width={120} height={60} name="X" />
      {/* קו מR1 לX => many => no arrow */}
      <Connector
        fromX={400}
        fromY={120}
        toX={500}
        toY={120}
        singleCardinality={false}
      />

      {/* יחס מזהה (Identifying) R2 */}
      <RelationshipDiamond
        centerX={180}
        centerY={260}
        name="R2"
        isIdentifying
      />

      {/* קו מאותה ישות A לR2 (without arrow => many) */}
      <Connector
        fromX={160}
        fromY={160}
        toX={180}
        toY={260}
        singleCardinality={false}
      />

      {/* קו מR2 לישות החלשה WE (identifying) -> נניח single => חץ */}
      <Connector
        fromX={180}
        fromY={260}
        toX={170}
        toY={300}
        singleCardinality
      />
    </svg>
  );
};

export default AdvancedERDDiagram;
