"use client";

import React, { useState, MouseEvent } from "react";

/** סוגי אלמנטים */
type ElementType = "ENTITY" | "RELATIONSHIP" | "ATTRIBUTE" | "INHERITANCE";

/** אלמנט בדיאגרמה */
interface DiagramElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;

  name: string;

  // לישויות
  isWeak?: boolean;

  // לתכונות
  ownerId?: string; // איזו ישות היא הבעלים

  // קשר חלש - אם type==="RELATIONSHIP", אז יכול להיות isWeakRel?: boolean
  isWeakRel?: boolean;

  // לירושה (INHERITANCE)
  parentId?: string; // איזו ישות מוגדרת כאב?  (אם צריך)
}

/** Edge - חיבור */
interface Edge {
  id: string;
  fromId: string;
  toId: string;
  fromCard: "1" | "N";
  toCard: "1" | "N";
}

/** הקומפוננטה הראשית */
const FullERDApp: React.FC = () => {
  // מצב
  const [elements, setElements] = useState<DiagramElement[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // גרירה
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastPos, setLastPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // מצב "חיבור"
  const [connectMode, setConnectMode] = useState<boolean>(false);
  const [pendingConn, setPendingConn] = useState<string | null>(null);

  // אפשרויות שונות
  const [weakRelOption, setWeakRelOption] = useState<boolean>(false); // האם אנחנו יוצרים קשר חלש?
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  //----------------- כלי בסרגל ------------------

  // הוספת ישות
  const addEntity = (weak: boolean) => {
    const id = "E_" + Date.now();
    const newEl: DiagramElement = {
      id,
      type: "ENTITY",
      x: 60,
      y: 60,
      width: 100,
      height: 50,
      name: weak ? "Weak Entity" : "Entity",
      isWeak: weak,
    };
    setElements((prev) => [...prev, newEl]);
  };

  // הוספת קשר
  const addRelationship = () => {
    const id = "R_" + Date.now();
    const newEl: DiagramElement = {
      id,
      type: "RELATIONSHIP",
      x: 250,
      y: 100,
      width: 60,
      height: 60,
      name: "R",
      isWeakRel: weakRelOption, // אם המשתמש סימן "קשר חלש"
    };
    setElements((prev) => [...prev, newEl]);
  };

  // הוספת תכונה => נדרש לבחור ישות => נצייר עיגול + ניצור Edge?
  const addAttribute = () => {
    if (!selectedEntityId) {
      alert("בחר ישות שאליה תוסיף תכונה.");
      return;
    }
    const ent = elements.find(
      (e) => e.id === selectedEntityId && e.type === "ENTITY"
    );
    if (!ent) {
      alert("Selection is not an ENTITY or not found.");
      return;
    }
    const id = "A_" + Date.now();
    const attr: DiagramElement = {
      id,
      type: "ATTRIBUTE",
      x: ent.x + ent.width + 40,
      y: ent.y,
      width: 40,
      height: 40,
      name: "attr",
      ownerId: ent.id, // זה הבעלים
    };
    setElements((prev) => [...prev, attr]);

    // יוצרים קו בין התכונה לישות, קרדינליות=1
    const edgeId = "edge_" + Date.now();
    const newEdge: Edge = {
      id: edgeId,
      fromId: id,
      toId: ent.id,
      fromCard: "1", // תמיד
      toCard: "1", // אפשר להגדיר "1" גם כאן
    };
    setEdges((prev) => [...prev, newEdge]);
  };

  // הוספת ירושה (INHERITANCE)
  const addInheritance = () => {
    const id = "I_" + Date.now();
    const newEl: DiagramElement = {
      id,
      type: "INHERITANCE",
      x: 300,
      y: 200,
      width: 60,
      height: 50,
      name: "is-a",
    };
    setElements((prev) => [...prev, newEl]);
  };

  // שמירה / טעינה
  const saveDiagram = () => {
    const data = { elements, edges };
    localStorage.setItem("erdDiagram", JSON.stringify(data));
    alert("נשמר בהצלחה!");
  };
  const loadDiagram = () => {
    const str = localStorage.getItem("erdDiagram");
    if (!str) {
      alert("אין שרטוט שמור.");
      return;
    }
    try {
      const data = JSON.parse(str);
      if (data && data.elements && data.edges) {
        setElements(data.elements);
        setEdges(data.edges);
        alert("טעינה הושלמה.");
      }
    } catch (e) {
      alert("שגיאה בטעינה: " + e);
    }
  };

  // תרגום ל-RM
  const translateToRM = () => {
    let result = "";
    // נאסוף ישויות
    const entList = elements.filter((e) => e.type === "ENTITY");
    entList.forEach((ent) => {
      // שם הטבלה
      const tableName = ent.name.replace(/\s+/g, "_");
      // תכונות
      // מוצאים את כל התכונות שמחוברים ב־edges or ownerId
      const myAttrs = edges
        .filter((ed) => ed.fromId === ent.id || ed.toId === ent.id)
        .map((ed) => {
          // אם fromId === ent => זה-> edges?
          // כאן פשטות: אך נבדוק if the other side is attribute
          let otherId = ed.fromId === ent.id ? ed.toId : ed.fromId;
          const otherEl = elements.find(
            (a) => a.id === otherId && a.type === "ATTRIBUTE"
          );
          if (otherEl) {
            return otherEl.name;
          }
          return null;
        })
        .filter(Boolean) as string[];

      // בנוסף, יכולים להיות attributes עם ownerId===ent.id (בפרט בקוד שלנו זה קיים)
      const directOwned = elements
        .filter((a) => a.type === "ATTRIBUTE" && a.ownerId === ent.id)
        .map((a) => a.name);
      const allAttributes = Array.from(new Set([...myAttrs, ...directOwned]));
      result += `${tableName}(${allAttributes.join(", ")})\n`;
    });
    alert("תרגום ל-RM:\n" + result);
  };

  //------------------- createConnection -------------------
  function createConnection(id1: string, id2: string) {
    if (id1 === id2) return;
    const e1 = elements.find((e) => e.id === id1);
    const e2 = elements.find((e) => e.id === id2);
    if (!e1 || !e2) return;

    // בדיקת ENTITY↔ENTITY ?
    if (e1.type === "ENTITY" && e2.type === "ENTITY") {
      alert("לא מחברים ישות↔ישות ישירות. השתמש בקשר או ירושה is-a.");
      return;
    }
    // קשר↔קשר?
    if (e1.type === "RELATIONSHIP" && e2.type === "RELATIONSHIP") {
      alert("אין לחבר קשר↔קשר.");
      return;
    }
    // ENTITY↔ATTRIBUTE? כבר מטופל ע״י ownerId+edge
    // אבל אם מישהו מנסה…:
    if (
      (e1.type === "ENTITY" && e2.type === "ATTRIBUTE") ||
      (e1.type === "ATTRIBUTE" && e2.type === "ENTITY")
    ) {
      alert("תכונה משויכת לישות ע״י ownerId. לא מחברים ידנית.");
      return;
    }
    // ATTRIBUTE↔ATTRIBUTE?
    if (e1.type === "ATTRIBUTE" && e2.type === "ATTRIBUTE") {
      alert("אין לחבר תכונה↔תכונה.");
      return;
    }
    // INHERITANCE↔INHERITANCE?
    if (e1.type === "INHERITANCE" && e2.type === "INHERITANCE") {
      alert("לא מחברים משולש is-a למשולש נוסף.");
      return;
    }

    // בדיקת כפילות edges
    const exist = edges.find(
      (ed) =>
        (ed.fromId === id1 && ed.toId === id2) ||
        (ed.fromId === id2 && ed.toId === id1)
    );
    if (exist) {
      alert("קשר כבר קיים.");
      return;
    }

    // יוצרים Edge חדש, ברירת מחדל fromCard="N",toCard="N"
    let newEdge: Edge = {
      id: "edge_" + Date.now(),
      fromId: id1,
      toId: id2,
      fromCard: "N",
      toCard: "N",
    };

    // 1) אם אחד הקצוות הוא isWeakRel===true (RELATIONSHIP), וחיברנו ישות רגילה + ישות חלשה
    //   אז side=1 side=N
    if (e1.type === "RELATIONSHIP" && e1.isWeakRel && e2.type === "ENTITY") {
      // בודקים אם e2.isWeak => set fromCard=1/toCard=N או להיפך
      if (e2.isWeak) {
        // relationship => from => e1
        // entity weak => e2 => card=N
        // entity רגילה => card=1
        // אבל פה e2 weak => => card=N, relationship => side=?
        // נניח relationship doesn't have isWeak property in the sense of "regular"
        // we forcibly set fromCard=1, toCard=N
        // Actually, we want "regular entity"=1, "weak entity"=N
        alert("קשר חלש מחייב ישות רגילה (1) וישות חלשה (N).");
        return;
      } else {
        // e2 רגילה => from=relationship => card=N, to=entity => card=1?
        newEdge.fromCard = "N";
        newEdge.toCard = "1";
      }
    } else if (
      e2.type === "RELATIONSHIP" &&
      e2.isWeakRel &&
      e1.type === "ENTITY"
    ) {
      if (e1.isWeak) {
        // e1 isWeak => => side=?
        alert("חייבת להיות ישות רגילה ב-1, וחלשה ב-N. כאן שניהם or??");
        return;
      } else {
        // e1 רגילה => card=1, relationship => N
        newEdge.fromCard = "1";
        newEdge.toCard = "N";
      }
    }

    // 2) אם e1.type==="INHERITANCE" או e2.type==="INHERITANCE",
    //    נאפשר חיבור is-a ↔ ENTITY
    //    user יכול לקבוע "אב" => card=1, "ילד" => card=N
    //    לצורך פשטות: נשאל prompt "אב או ילד?"
    if (e1.type === "INHERITANCE" && e2.type === "ENTITY") {
      const r = prompt("is this אב=1 or ילד=N ? (type 1 or N)", "1");
      if (!r) return;
      let val = r === "1" ? "1" : "N";
      if (val === "1") {
        // e2 = אב
        newEdge.fromCard = "1";
        newEdge.toCard = "N";
      } else {
        // e2 = ילד
        newEdge.fromCard = "N";
        newEdge.toCard = "1";
      }
    } else if (e2.type === "INHERITANCE" && e1.type === "ENTITY") {
      const r = prompt("is this אב=1 or ילד=N?", "1");
      if (!r) return;
      let val = r === "1" ? "1" : "N";
      if (val === "1") {
        newEdge.fromCard = "N";
        newEdge.toCard = "1"; // e1=אב
      } else {
        newEdge.fromCard = "1";
        newEdge.toCard = "N"; // e1=ילד
      }
    }

    // כעת מוסיפים
    setEdges((prev) => {
      // בדיקה של "אם בקשר מעל 2 ישויות, רק אחת יכולה להיות '1'"
      // כאן צריך לממש checking if fromEl/toEl is RELATIONSHIP and how many edges
      return [...prev, newEdge];
    });
  }

  //------------------- Handlers לעכבר -------------------
  function onElementMouseDown(evt: MouseEvent, el: DiagramElement) {
    evt.stopPropagation();
    // אם זה ישות -> נגדיר selectedEntityId = el.id
    if (el.type === "ENTITY") {
      setSelectedEntityId(el.id);
    }

    if (connectMode) {
      if (!pendingConn) {
        setPendingConn(el.id);
      } else {
        createConnection(pendingConn, el.id);
        setPendingConn(null);
      }
      return;
    }

    // drag mode
    const mx = evt.clientX;
    const my = evt.clientY;
    setOffset({ x: mx - el.x, y: my - el.y });
    setDraggingId(el.id);
  }

  function onMouseUp() {
    if (draggingId) setDraggingId(null);
  }
  function onMouseMove(evt: MouseEvent) {
    if (!draggingId) return;
    const mx = evt.clientX;
    const my = evt.clientY;
    setElements((prev) => {
      return prev.map((e) => {
        if (e.id !== draggingId) return e;
        let nx = mx - offset.x;
        let ny = my - offset.y;
        // מניעת חפיפה
        for (let o of prev) {
          if (o.id === e.id) continue;
          if (!noOverlap(nx, ny, e.width, e.height, o)) {
            return e;
          }
        }
        setLastPos({ x: nx, y: ny });
        return { ...e, x: nx, y: ny };
      });
    });
  }

  function noOverlap(
    nx: number,
    ny: number,
    w: number,
    h: number,
    other: DiagramElement
  ): boolean {
    // ריבוע פשוט
    return (
      nx + w < other.x ||
      nx > other.x + other.width ||
      ny + h < other.y ||
      ny > other.y + other.height
    );
  }

  function removeElement(id: string) {
    // הסר edges
    setEdges((prev) => prev.filter((ed) => ed.fromId !== id && ed.toId !== id));
    // אם זו ישות => הסר גם תכונות ששייכות אליה
    setElements((prev) =>
      prev.filter((e) => {
        if (e.id === id) return false;
        // אם e.type==="ATTRIBUTE" && e.ownerId===id => false
        if (e.type === "ATTRIBUTE" && e.ownerId === id) return false;
        return true;
      })
    );
    if (selectedEntityId === id) setSelectedEntityId(null);
  }

  function onDoubleClickEl(el: DiagramElement) {
    const newName = prompt("שם חדש:", el.name);
    if (newName) {
      setElements((prev) =>
        prev.map((e) => (e.id === el.id ? { ...e, name: newName } : e))
      );
    }
  }

  // ציור edges עם חץ אם card=1
  return (
    <div
      style={{ display: "flex" }}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {/* סרגל כלים */}
      <div
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>כלים</h3>
        <button onClick={() => addEntity(false)}>+ ישות רגילה</button>
        <br />
        <button onClick={() => addEntity(true)}>+ ישות חלשה</button>
        <br />
        <button onClick={addRelationship}>+ קשר</button>
        <br />
        <button onClick={addInheritance}>+ is-a (ירושה)</button>
        <br />
        <button onClick={addAttribute}>+ תכונה</button>
        <br />

        <hr />
        <label>
          <input
            type="checkbox"
            checked={weakRelOption}
            onChange={(e) => setWeakRelOption(e.target.checked)}
          />
          קשר חלש?
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={connectMode}
            onChange={(e) => setConnectMode(e.target.checked)}
          />
          מצב חיבור
        </label>
        <br />

        <hr />
        <button onClick={saveDiagram}>שמור</button>
        <button onClick={loadDiagram}>טעון</button>
        <br />
        <hr />
        <button onClick={translateToRM}>תרגם ל-RM</button>
      </div>

      {/* לוח */}
      <div style={{ position: "relative" }}>
        <svg
          width={900}
          height={600}
          style={{ background: "#f9f9f9", border: "1px solid #ccc" }}
        >
          {/* Edges */}
          {edges.map((edge) => {
            const e1 = elements.find((e) => e.id === edge.fromId);
            const e2 = elements.find((e) => e.id === edge.toId);
            if (!e1 || !e2) return null;
            const fx = e1.x + e1.width / 2;
            const fy = e1.y + e1.height / 2;
            const tx = e2.x + e2.width / 2;
            const ty = e2.y + e2.height / 2;

            return (
              <g key={edge.id}>
                {/* הקו */}
                <line
                  x1={fx}
                  y1={fy}
                  x2={tx}
                  y2={ty}
                  stroke="#000"
                  strokeWidth={2}
                />
                {/* חץ אם fromCard===1 */}
                {edge.fromCard === "1" && (
                  <polygon
                    fill="#000"
                    points={`
                      ${fx},${fy}
                      ${fx + 6},${fy - 3}
                      ${fx + 6},${fy + 3}
                    `}
                  />
                )}
                {/* חץ אם toCard===1 */}
                {edge.toCard === "1" && (
                  <polygon
                    fill="#000"
                    points={`
                      ${tx},${ty}
                      ${tx - 6},${ty - 3}
                      ${tx - 6},${ty + 3}
                    `}
                  />
                )}
                {/* טקסט מעל הקו, בערך באמצע: fromCard / toCard */}
                <text
                  x={(fx + tx) / 2 - (tx - fx) * 0.2}
                  y={(fy + ty) / 2 - (ty - fy) * 0.2}
                  fill="blue"
                  fontSize={12}
                >
                  {edge.fromCard}
                </text>
                <text
                  x={(fx + tx) / 2 - (tx - fx) * 0.8}
                  y={(fy + ty) / 2 - (ty - fy) * 0.8}
                  fill="blue"
                  fontSize={12}
                >
                  {edge.toCard}
                </text>
              </g>
            );
          })}

          {/* אלמנטים */}
          {elements.map((el) => {
            return (
              <g
                key={el.id}
                onMouseDown={(evt) => onElementMouseDown(evt, el)}
                onDoubleClick={() => onDoubleClickEl(el)}
              >
                {el.type === "ENTITY" ? (
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="#e6f7ff"
                    stroke="#0073e6"
                    strokeWidth={2}
                    strokeDasharray={el.isWeak ? "4,3" : undefined}
                  />
                ) : el.type === "RELATIONSHIP" ? (
                  <polygon
                    points={`
                      ${el.x + el.width / 2},${el.y}
                      ${el.x + el.width},${el.y + el.height / 2}
                      ${el.x + el.width / 2},${el.y + el.height}
                      ${el.x},${el.y + el.height / 2}
                    `}
                    fill={el.isWeakRel ? "#fff0f0" : "#fff4e6"}
                    stroke={el.isWeakRel ? "red" : "#ff9900"}
                    strokeWidth={2}
                  />
                ) : el.type === "ATTRIBUTE" ? (
                  <circle
                    cx={el.x + el.width / 2}
                    cy={el.y + el.height / 2}
                    r={Math.min(el.width, el.height) / 2}
                    fill="#fff"
                    stroke="#333"
                    strokeWidth={2}
                  />
                ) : (
                  // INHERITANCE - משולש
                  <polygon
                    points={`
                      ${el.x + el.width / 2},${el.y}
                      ${el.x + el.width},${el.y + el.height}
                      ${el.x},${el.y + el.height}
                    `}
                    fill="#fff"
                    stroke="#990099"
                    strokeWidth={2}
                  />
                )}
                {/* שם האלמנט */}
                <text
                  x={el.x + el.width / 2}
                  y={el.y + el.height / 2 + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#333"
                >
                  {el.name}
                </text>

                {/* כפתור מחיקה */}
                <text
                  x={el.x + el.width - 12}
                  y={el.y + 14}
                  fill="red"
                  fontSize={12}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(el.id);
                  }}
                >
                  X
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ fontSize: "14px", marginTop: "5px" }}>
          אחרון שהוזז: (x:{lastPos.x}, y:{lastPos.y})
        </div>
      </div>
    </div>
  );
};

export default FullERDApp;
