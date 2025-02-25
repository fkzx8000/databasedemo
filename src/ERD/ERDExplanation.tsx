"use client";

import React from "react";

const ERDExplanation: React.FC = () => {
  return (
    <div style={{ padding: "40px", backgroundColor: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        הסבר מקיף על ERD (Entity Relationship Diagram)
      </h1>

      <p
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        ERD (ראשי תיבות של Entity Relationship Diagram) הוא כלי גרפי הנועד לתכנן
        את מבנה בסיס הנתונים. בעזרת ERD מייצגים בצורה ויזואלית את כל היישויות
        (Entities), את הקשרים (Relationships) ביניהן, ואת המאפיינים (Attributes)
        של כל יישות.
      </p>

      <h2 style={{ color: "#0073e6", textAlign: "center", marginTop: "40px" }}>
        ישויות (Entities)
      </h2>
      <p
        style={{
          maxWidth: "800px",
          margin: "10px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        ישות היא אובייקט בעולם האמיתי שאנו רוצים לאחסן עליו מידע בבסיס הנתונים.
        לדוגמה, "לקוח", "מוצר", "הזמנה" או "ספק". לכל ישות יש מאפיינים
        (Attributes) כמו שם, כתובת, מספר טלפון וכו'. אחד או יותר מהמאפיינים משמש
        כמפתח ראשי (Primary Key) – מזהה ייחודי של הרשומה.
      </p>

      <h2 style={{ color: "#0073e6", textAlign: "center", marginTop: "40px" }}>
        ישויות חלשות (Weak Entities)
      </h2>
      <p
        style={{
          maxWidth: "800px",
          margin: "10px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        ישות חלשה היא ישות שאין לה מפתח ראשי עצמאי, ולכן היא תלויה בישות אחרת
        ("ישות בעלת") על מנת להזדהות. לדוגמה: "פריט בהזמנה" (Order Item) יכול
        להיחשב לישות חלשה אם הוא מזדהה באמצעות "מספר הזמנה" + "מספר שורה". ב־ERD
        נהוג לסמן ישות חלשה באמצעות מלבן כפול, והקשר שמגדיר אותה (Identifying
        Relationship) מסומן לעיתים בקו כפול.
      </p>

      <h2 style={{ color: "#0073e6", textAlign: "center", marginTop: "40px" }}>
        סוגי קשרים (Relationships)
      </h2>
      <ul
        style={{
          maxWidth: "800px",
          margin: "10px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        <li>
          <strong>1:1 (One to One)</strong> – לכל מופע בישות א׳ יש מופע יחיד
          בישות ב׳, ולהפך.
        </li>
        <li>
          <strong>1:N (One to Many)</strong> – לכל מופע בישות א׳ יכולים להיות
          מופעים רבים בישות ב׳, אבל למופע בישות ב׳ יש רק מופע אחד בישות א׳.
        </li>
        <li>
          <strong>N:1 (Many to One)</strong> – הפוך מ-1:N, תלוי בפרספקטיבה של
          הישות.
        </li>
        <li>
          <strong>M:N (Many to Many)</strong> – לכל מופע בישות אחת יכולים להיות
          מספר מופעים בישות האחרת ולהיפך. לעיתים ממומש באמצעות טבלת קשר
          (Association Table) נוספת.
        </li>
        <li>
          <strong>Identifying Relationship</strong> – קשר שמזהה ישות חלשה, מסומן
          בקו כפול לעיתים, בו הישות החלשה תלויה במפתח של הישות החזקה.
        </li>
      </ul>

      <h2 style={{ color: "#0073e6", textAlign: "center", marginTop: "40px" }}>
        דוגמה כללית
      </h2>
      <p
        style={{
          maxWidth: "800px",
          margin: "10px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        נניח שיש לנו מערכת שמנהלת "לקוחות", "הזמנות" ו"פרטי הזמנה" (Order Item).
        ישות "פרטי הזמנה" יכולה להיחשב ישות חלשה, כיוון שאין לה מפתח עצמאי, והיא
        מזדהה על ידי "מזהה הזמנה" + "מספר שורה". ב־ERD נסמן את "פרטי הזמנה"
        כישות חלשה ונקשר אותה אל "הזמנה" בקשר מזהה (Identifying Relationship).
      </p>

      <p
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        בהמשך תוכלו לראות הדגמות ויזואליות של ישויות, ישויות חלשות וקשרים שונים
        באנימציה, כדי להבין טוב יותר את המבנה.
      </p>
    </div>
  );
};

export default ERDExplanation;
