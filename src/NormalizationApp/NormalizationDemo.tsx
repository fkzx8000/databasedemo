"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import exercisesData, { Exercise } from "./exercisesData";

// =====================  Interfaces/Types  =====================

// טיפוס לטבלאות בודדות
interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

// טיפוס לטבלאות מרובות (כמו ב-3NF ו-4NF, שמכילות orders ו-customers למשל)
interface MultiTableData {
  orders: TableData;
  customers: TableData;
}

// איחוד של בודדת/מרובות
type TableDataType = TableData | MultiTableData;

// כל שלב (Stage) בתהליך הנרמול
interface Stage {
  title: string;
  description: string;
  tableData: TableDataType;
}

// מידע עבור כל סוג נרמול: תיאוריה, הגדרה פורמלית, מונחים טכניים, שלבים, ותרגילים
interface NormalizationInfo {
  theory: string;
  formalDefinition: string;
  technicalTerms: string[];
  stages: Stage[];
  exercises: Exercise[];
}

// =====================  Normalization Data  =====================
const normalizationData: { [key: string]: NormalizationInfo } = {
  "1NF": {
    theory: `נרמול 1NF דורש שלכל תא יהיה ערך אטומי יחיד. הרעיון הוא להימנע מאחסון רשימות או מערכים בתוך שדה אחד. אם נשמור כל ערך בנפרד, נוכל לעדכן ולחפש את הנתונים בקלות.`,
    formalDefinition: `
      R ∈ 1NF ⇨ ∀ t ∈ R, ∀ A ∈ R: 
        t[A] ∈ Domain(A) ∧ ¬∃ {v₁, v₂, ... vₙ} ⊂ t[A]
      (משמעות הדבר שכל שדה (תא) אכן מכיל ערך בודד ואטומי)
    `,
    technicalTerms: ["אטומיות", "טופס נורמלי ראשון"],
    stages: [
      {
        title: "מצב לא מנורמלי",
        description:
          "בדוגמה זו, עמודות 'Names' ו-'Phones' מכילות רשימות של ערכים במקום ערך בודד.",
        tableData: {
          headers: ["ID", "Names", "Phones"],
          rows: [
            [1, "Alice, Bob", "123-456, 789-012"],
            [2, "Charlie", "345-678"],
          ],
        },
      },
      {
        title: "נרמול ל-1NF",
        description:
          "הפרדנו כל ערך לעמודה משלו. כעת לכל תא יש ערך יחיד, דבר המאפשר עדכון וחיפוש יעילים.",
        tableData: {
          headers: ["ID", "Name", "Phone"],
          rows: [
            [1, "Alice", "123-456"],
            [1, "Bob", "789-012"],
            [2, "Charlie", "345-678"],
          ],
        },
      },
      {
        title: "משחק הבנה (1NF)",
        description: `לפניכם טבלה שבה עמודה אחת עדיין מכילה ערכים כפולים. מצאו איזו עמודה מפרה את עקרון ה־1NF ונסו להציע כיצד לפצל אותה כך שכל ערך יהיה אטומי:`,
        tableData: {
          headers: ["UserID", "Emails", "Age"],
          rows: [
            [101, "alice@mail.com, alice2@mail.com", 30],
            [102, "bob@mail.com", 25],
          ],
        },
      },
    ],
    exercises: exercisesData["1NF"],
  },

  "3NF": {
    theory: `נרמול 3NF מתמודד עם תלות טרנזיטיבית: לא די בכך שהטבלה תהיה ב־1NF, אלא יש למנוע מצב שבו עמודה תלויה בעמודה אחרת (שאינה מפתח) אשר תלויה במפתח הראשי. כך נמנעים עדכונים כפולים ושגיאות עקביות.`,
    formalDefinition: `
      R ∈ 3NF ⇨ ∀ X → Y (non-trivial):
        (X is superkey) ∨ (Y is prime attribute)
      (כלומר, או ש־X הוא מפתח-על, או ש־Y הוא עמודת מפתח)
    `,
    technicalTerms: ["תלות טרנזיטיבית", "טופס נורמלי שלישי"],
    stages: [
      {
        title: "מצב לא מנורמלי",
        description: `בטבלה זו, "CustomerAddress" תלויה למעשה ב-"CustomerName" במקום במפתח הראשי (OrderID). הדבר מוביל לתלות טרנזיטיבית.`,
        tableData: {
          headers: ["OrderID", "CustomerName", "CustomerAddress", "Product"],
          rows: [
            [101, "Alice", "123 Main St", "Laptop"],
            [102, "Bob", "456 Elm St", "Smartphone"],
            [103, "Alice", "123 Main St", "Mouse"],
          ],
        },
      },
      {
        title: "זיהוי הבעיות",
        description: `אנו רואים שאם נשנה את כתובת הלקוח של Alice, נצטרך לעשות זאת בכמה רשומות שונות. דבר זה גורם לסיכון לשגיאות ועדכונים לא עקביים.`,
        tableData: {
          headers: ["OrderID", "CustomerName", "CustomerAddress", "Product"],
          rows: [
            [101, "Alice", "123 Main St", "Laptop"],
            [102, "Bob", "456 Elm St", "Smartphone"],
            [103, "Alice", "123 Main St", "Mouse"],
          ],
        },
      },
      {
        title: "נרמול ל-3NF",
        description: `כדי להסיר את התלות הטרנזיטיבית, יצרנו שתי טבלאות: הזמנות (OrderID, CustomerName, Product) ולקוחות (CustomerName, CustomerAddress). כעת עדכון כתובת לקוח מתבצע רק בטבלת הלקוחות, מה שמבטיח עקביות.`,
        tableData: {
          orders: {
            headers: ["OrderID", "CustomerName", "Product"],
            rows: [
              [101, "Alice", "Laptop"],
              [102, "Bob", "Smartphone"],
              [103, "Alice", "Mouse"],
            ],
          },
          customers: {
            headers: ["CustomerName", "CustomerAddress"],
            rows: [
              ["Alice", "123 Main St"],
              ["Bob", "456 Elm St"],
            ],
          },
        },
      },
      {
        title: "משחק הבנה (3NF)",
        description: `נתונה טבלה שבה מופיעים פרטי מוצרים, ספקים ומיקומם. זיהו האם קיימת תלות טרנזיטיבית בין עמודות שאינן המפתח, והציעו כיצד לפצל את הטבלה במידת הצורך:`,
        tableData: {
          headers: [
            "ProductID",
            "ProductName",
            "SupplierName",
            "SupplierLocation",
          ],
          rows: [
            [201, "Notebook", "OfficeSup", "City A"],
            [202, "Pencil", "OfficeSup", "City A"],
            [203, "Mouse", "TechPro", "City B"],
          ],
        },
      },
    ],
    exercises: exercisesData["3NF"],
  },

  BCNF: {
    theory: `BCNF (Boyce-Codd Normal Form) מרחיבה עוד את 3NF, ודורשת שכל תלות פונקציונלית תהיה תלויה במפתח-על (superkey). כלומר, אם X → Y, אז X חייב להיות מפתח-על. כאשר טבלה אינה עומדת בתנאי זה, נוצרים מצבים של עדכונים כפולים ושגיאות אפשריות.`,
    formalDefinition: `
      R ∈ BCNF ⇨ ∀ X → Y (non-trivial):
        X is superkey
      (כל תלות פונקציונלית בטבלה חייבת להיות מושתתת על מפתח-על)
    `,
    technicalTerms: ["BCNF", "Superkey", "תלות פונקציונלית"],
    stages: [
      {
        title: "מצב לא ב-BCNF",
        description: `בדוגמה זו, Course → Instructor אינה בהכרח תלות במפתח, כיוון שייתכן ש־Instructor משתנה על אותו קורס. הדבר גורם לבעיות בעדכון והוספת נתונים.`,
        tableData: {
          headers: ["Course", "Instructor", "Textbook"],
          rows: [
            ["Database Systems", "Dr. Green", "Intro to DB"],
            ["Database Systems", "Dr. Blue", "Advanced DB"],
            ["Algorithms", "Dr. Red", "Algorithm Design"],
          ],
        },
      },
      {
        title: "נרמול ל-BCNF",
        description: `פיצלנו את הטבלה לשתיים: אחת (Course, Instructor) והשנייה (Course, Textbook). כעת כל תלות פונקציונלית מתבצעת על מפתח-על, ומונעת כפילות ושגיאות.`,
        tableData: {
          orders: {
            headers: ["Course", "Instructor"],
            rows: [
              ["Database Systems", "Dr. Green"],
              ["Algorithms", "Dr. Red"],
            ],
          },
          customers: {
            headers: ["Course", "Textbook"],
            rows: [
              ["Database Systems", "Intro to DB"],
              ["Database Systems", "Advanced DB"],
              ["Algorithms", "Algorithm Design"],
            ],
          },
        },
      },
      {
        title: "משחק הבנה (BCNF)",
        description: `לפניכם טבלה המתארת קורסים, מרצים וכיתות. בדקו האם התלות הפונקציונלית מושתתת על מפתח-על או לא, והציעו תיקון אם לא:`,
        tableData: {
          headers: ["Course", "Instructor", "Classroom"],
          rows: [
            ["Data Structures", "Dr. Green", "Room 101"],
            ["Data Structures", "Dr. Green", "Room 102"],
            ["Networking", "Dr. Blue", "Room 203"],
          ],
        },
      },
    ],
    exercises: exercisesData["BCNF"],
  },

  "4NF": {
    theory: `נרמול 4NF מתמקד בהסרת תלות מרובת ערכים (Multivalued Dependency). מצב זה מתרחש כאשר למפתח ראשי X קיימים שני מאפיינים Y ו-Z שאינם תלויים זה בזה, אך מאוחסנים יחד באותה טבלה. הדבר עלול לגרום להכפלה מיותרת של נתונים, בעיות עדכון וקושי בשמירה על עקביות הנתונים. על מנת להגיע ל־4NF, יש לוודא שכל תלות מרובת ערכים בטבלה תלויה ב־superkey ולא יוצרת כפילויות מיותרות.`,
    formalDefinition: `
      R ∈ 4NF ⇨ ∀ X →→ Y (non-trivial):
        X is superkey
      (כל תלות מרובת ערכים חייבת להיות מושתתת על מפתח-על)
    `,
    technicalTerms: [
      "4NF",
      "תלות מרובת ערכים",
      "Multivalued Dependency",
      "Superkey",
    ],
    stages: [
      {
        title: "הבנת תלות מרובת ערכים",
        description: `תלות מרובת ערכים פירושה שלאותו מפתח קיימות מספר רשומות מרובות עבור מספר עמודות שונות, והעמודות הללו אינן תלויות זו בזו. הדבר גורם לאחסון כפול ולהפיכת העדכונים למסובכים יותר.`,
        tableData: {
          headers: ["Student", "Hobby", "Language"],
          rows: [
            ["Doron", "Gameing", "English"],
            ["Doron", "Gameing", "Spanish"],
            ["Doron", "WorkOut", "English"],
            ["Doron", "WorkOut", "Spanish"],
          ],
        },
      },
      {
        title: "מצב לא ב-4NF",
        description: `במצב הנוכחי, תחביביו של Doron ושפותיו מאוחסנים באותה טבלה, למרות שאין תלות ישירה ביניהם. נוצרת כאן כפילות מיותרת (4 רשומות) במקום המידע הבסיסי הנחוץ.`,
        tableData: {
          headers: ["Student", "Hobby", "Language"],
          rows: [
            ["Doron", "Gameing", "English"],
            ["Doron", "Gameing", "Spanish"],
            ["Doron", "WorkOut", "English"],
            ["Doron", "WorkOut", "Spanish"],
          ],
        },
      },
      {
        title: "נרמול ל-4NF",
        description: `בחלוקה לטבלאות נפרדות – אחת לתחביבי התלמיד ואחת לשפותיו – כל תלות מרובת ערכים מנוהלת בנפרד. כך מסירים כפילויות ושומרים על שלמות הנתונים.`,
        tableData: {
          orders: {
            headers: ["Student", "Hobby"],
            rows: [
              ["Doron", "Gameing"],
              ["Doron", "WorkOut"],
            ],
          },
          customers: {
            headers: ["Student", "Language"],
            rows: [
              ["Doron", "English"],
              ["Doron", "Spanish"],
            ],
          },
        },
      },
      {
        title: "משחק הבנה (4NF)",
        description: `לפניכם טבלה בה מופיעים "ספק", "קטגוריה" ו"סוג משלוח" – בדקו האם יש כאן תלות מרובת ערכים. אם כן, כיצד נכון לפצל כדי למנוע כפילויות?`,
        tableData: {
          headers: ["Supplier", "Category", "ShippingMethod"],
          rows: [
            ["OfficeSup", "Stationery", "Air"],
            ["OfficeSup", "Stationery", "Sea"],
            ["OfficeSup", "Furniture", "Air"],
            ["OfficeSup", "Furniture", "Sea"],
          ],
        },
      },
    ],
    exercises: exercisesData["4NF"],
  },
};

// =====================  Formula Component  =====================
const FormulaComponent: React.FC<{ formula: string }> = ({ formula }) => {
  return (
    <div
      style={{
        fontFamily: "monospace",
        backgroundColor: "#f9f9f9",
        padding: "10px",
        borderRadius: "5px",
        margin: "10px 0",
        fontSize: "16px",
        color: "#d6336c",
      }}
    >
      {formula}
    </div>
  );
};

// =====================  Table Components  =====================
interface TableComponentProps {
  tableData: TableDataType;
}

// מזהה אם יש לנו טבלה בודדת או שתי טבלאות (orders + customers),
// ומציג את האלמנט המתאים
const TableComponent: React.FC<TableComponentProps> = ({ tableData }) => {
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
        <AnimatedTable data={tableData.orders} title="Table 1" />
        <AnimatedTable data={tableData.customers} title="Table 2" />
      </div>
    );
  }
  return <AnimatedTable data={tableData as TableData} />;
};

interface AnimatedTableProps {
  data: TableData;
  title?: string;
}

// הצגת הטבלה עם אנימציית כניסה
const AnimatedTable: React.FC<AnimatedTableProps> = ({ data, title }) => {
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
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <td
                  key={cIndex}
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    fontSize: "15px",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

// =====================  Explanation Component  =====================
interface ExplanationComponentProps {
  theory: string;
  formalDefinition?: string;
  technicalTerms?: string[];
}

const ExplanationComponent: React.FC<ExplanationComponentProps> = ({
  theory,
  formalDefinition,
  technicalTerms,
}) => {
  return (
    <div
      style={{
        margin: "20px 0",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#0073e6" }}>תיאוריה</h2>
      <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
        {theory}
      </p>
      {formalDefinition && (
        <>
          <h3 style={{ color: "#d6336c", marginTop: "20px" }}>הגדרה פורמלית</h3>
          <FormulaComponent formula={formalDefinition} />
        </>
      )}
      {technicalTerms && (
        <>
          <h3 style={{ color: "#6c757d", marginTop: "20px" }}>מונחים טכניים</h3>
          <ul>
            {technicalTerms.map((term, index) => (
              <li key={index} style={{ fontSize: "15px", color: "#555" }}>
                {term}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// =====================  Random Exercise Component  =====================
interface RandomExerciseProps {
  exercises: Exercise[];
}

const RandomExerciseComponent: React.FC<RandomExerciseProps> = ({
  exercises,
}) => {
  const [remainingIndices, setRemainingIndices] = useState<number[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // אתחול מחדש כאשר רשימת התרגילים משתנה (למשל, שינוי נושא)
  useEffect(() => {
    const indices = exercises.map((_, idx) => idx);
    setRemainingIndices(indices);

    // בוחרים באופן רנדומלי שאלה ראשונה
    if (indices.length > 0) {
      const randomIndex = indices[Math.floor(Math.random() * indices.length)];
      setCurrentExercise(exercises[randomIndex]);
      setRemainingIndices(indices.filter((i) => i !== randomIndex));
    }
  }, [exercises]);

  // מעבר לשאלה הבאה
  const getNextExercise = () => {
    setShowSolution(false);
    if (remainingIndices.length === 0) {
      alert("כל השאלות הוצגו. מתחילים מחדש.");
      const indices = exercises.map((_, idx) => idx);
      setRemainingIndices(indices);
    } else {
      const randomIndex =
        remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
      setCurrentExercise(exercises[randomIndex]);
      setRemainingIndices(remainingIndices.filter((i) => i !== randomIndex));
    }
  };

  if (!currentExercise) {
    return <div>אין שאלות להצגה.</div>;
  }

  return (
    <div
      style={{
        margin: "30px auto",
        maxWidth: "900px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
        שאלה מהנושא
      </h3>
      <p
        style={{ fontSize: "16px", textAlign: "center", marginBottom: "10px" }}
      >
        {currentExercise.question}
      </p>
      <button
        onClick={() => setShowSolution(!showSolution)}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#0073e6",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {showSolution ? "הסתר פתרון" : "הצג פתרון"}
      </button>
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: "#e9f7ef",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
              border: "1px solid #c3e6cb",
              color: "#155724",
            }}
          >
            {currentExercise.solution}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={getNextExercise}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#0073e6",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        שאלה אחרת
      </button>
    </div>
  );
};

// =====================  הקומפוננטה הראשית  =====================
const NormalizationDemo: React.FC = () => {
  const [selectedNF, setSelectedNF] = useState<string>("1NF");
  const [showInfo, showInfoSet] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // הנתונים הנוכחיים בהתאם לנרמול שנבחר
  const currentData: NormalizationInfo = normalizationData[selectedNF];
  // השלב הנוכחי בשלבים
  const currentStage: Stage = currentData.stages[currentStageIndex];

  // מעבר לשלב הבא
  const handleNextStage = () => {
    if (currentStageIndex < currentData.stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  // חזרה לשלב הקודם
  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  // שינוי נרמול
  const handleNFChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNF(e.target.value);
    setCurrentStageIndex(0);
    showInfoSet(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#e8f0fe",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
        הדגמת נרמול בבסיסי נתונים
      </h1>
      <p
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "10px auto 30px",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        נרמול הוא תהליך ארגון הנתונים במטרה למנוע כפילויות, בעיות עדכון ותלות
        נתונים לא רצויה. בדוגמה זו תוכלו לראות את התיאוריה, השלבים והתרגילים
        עבור נרמול ל־1NF, 3NF, BCNF ו־4NF.
      </p>

      {/* בחר סוג נרמול */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <label
          htmlFor="normalForm"
          style={{ fontSize: "18px", marginRight: "10px", color: "#333" }}
        >
          בחר נרמול:
        </label>
        <select
          id="normalForm"
          value={selectedNF}
          onChange={handleNFChange}
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

      {/* כפתור להראות/להסתיר תיאוריה */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => showInfoSet(!showInfo)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#0073e6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {showInfo ? "הסתר תיאוריה" : "הצג תיאוריה"}
        </button>
      </div>

      {/* אם המשתמש בחר להראות תיאוריה, מציגים */}
      {showInfo && (
        <ExplanationComponent
          theory={currentData.theory}
          formalDefinition={currentData.formalDefinition}
          technicalTerms={currentData.technicalTerms}
        />
      )}

      {/* כפתורי שלבים */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handlePrevStage}
          disabled={currentStageIndex === 0}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
            cursor: currentStageIndex === 0 ? "not-allowed" : "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#0073e6",
            color: "#fff",
          }}
        >
          שלב קודם
        </button>
        <button
          onClick={handleNextStage}
          disabled={currentStageIndex === currentData.stages.length - 1}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor:
              currentStageIndex === currentData.stages.length - 1
                ? "not-allowed"
                : "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#0073e6",
            color: "#fff",
          }}
        >
          שלב הבא
        </button>
      </div>

      {/* תצוגת השלב הנוכחי */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <h2 style={{ color: "#0073e6", fontSize: "22px" }}>
          {currentStage.title}
        </h2>
        <p style={{ fontSize: "16px", color: "#444", marginBottom: "20px" }}>
          {currentStage.description}
        </p>
        <AnimatePresence mode="wait">
          <TableComponent
            key={currentStageIndex}
            tableData={currentStage.tableData}
          />
        </AnimatePresence>
      </div>

      {/* רכיב שמציג שאלה רנדומלית מהתרגילים */}
      <RandomExerciseComponent exercises={currentData.exercises} />
    </div>
  );
};

// מעטפת עיקרית
const NormalizationApp: React.FC = () => {
  return <NormalizationDemo />;
};

export default NormalizationApp;
