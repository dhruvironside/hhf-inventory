import { useState, useEffect } from "react";

// ─── Supabase Config ───────────────────────────────────────
const SUPABASE_URL = "https://wjoqxjrtzwidkeuoqizg.supabase.co";
const SUPABASE_KEY = "sb_publishable_nbAu80zQKLPz1VXqclie0g_z7JYlYZN";

const db = {
  async get(table, filters = "") {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*${filters}&limit=1000`;
    const res = await fetch(url, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      }
    });
    return res.json();
  },
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  },
  async update(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  }
};
// ──────────────────────────────────────────────────────────

const ITEMS = [
  { id: "11237", name: "Knee Brace, hinge 3XXL", qty: 1, location: "Pasadena", category: "Braces" },
  { id: "11236", name: "Knee Brace, hinge XXL", qty: 1, location: "Pasadena", category: "Braces" },
  { id: "11235", name: "Knee Brace, hinge XL", qty: 1, location: "Pasadena", category: "Braces" },
  { id: "11234", name: "Knee Brace, hinge L", qty: 1, location: "Pasadena", category: "Braces" },
  { id: "11233", name: "Knee Brace, hinge M", qty: 5, location: "Pasadena", category: "Braces" },
  { id: "100621-040", name: "Ankle Aso, L", qty: 3, location: "Pasadena", category: "Braces", desc: "Breg L1902" },
  { id: "100621-030", name: "Ankle Aso, M", qty: 3, location: "Pasadena", category: "Braces", desc: "L1902" },
  { id: "100621-050", name: "Ankle Aso, XL", qty: 2, location: "Pasadena", category: "Braces", desc: "L1902" },
  { id: "100634-100", name: "Thumb Spica Brace, LT", qty: 5, location: "Pasadena", category: "Braces", desc: "L3809" },
  { id: "100634-200", name: "Thumb Spica Brace, RT", qty: 5, location: "Pasadena", category: "Braces", desc: "L3809" },
  { id: "100632-100", name: "Wrist Brace Universal 8\" LT", qty: 2, location: "Pasadena", category: "Braces", desc: "L3908" },
  { id: "SA702009", name: "Ankle Aso Wraptor Speed XL", qty: 1, location: "Pasadena", category: "Braces", desc: "L1902" },
  { id: "SA702003", name: "Ankle Aso Wraptor Speed S", qty: 2, location: "Pasadena", category: "Braces" },
  { id: "100618-040", name: "Boots (short) L", qty: 2, location: "Pasadena", category: "Boots", desc: "Breg L4361" },
  { id: "100618-030", name: "Boots (short) M", qty: 2, location: "Pasadena", category: "Boots" },
  { id: "100618-020", name: "Boots (short) S", qty: 1, location: "Pasadena", category: "Boots" },
  { id: "100618-010", name: "Boots (short) XS", qty: 1, location: "Pasadena", category: "Boots" },
  { id: "630746120238", name: "Boot (Long) L", qty: 1, location: "Pasadena", category: "Boots" },
  { id: "100617-030", name: "Boot (Long) M", qty: 1, location: "Pasadena", category: "Boots" },
  { id: "VP20106-000", name: "DLX Shoulder Immobilizer", qty: 2, location: "Pasadena", category: "Splints", desc: "L3670" },
  { id: "VP30604-030", name: "Tennis Elbow Strap M", qty: 2, location: "Pasadena", category: "Braces", desc: "A4467" },
  { id: "10201", name: "Thumb Splint W/Stays", qty: 3, location: "Pasadena", category: "Splints", desc: "Breg L3924" },
  { id: "630745019502", name: "Ankle Wrap L/XL", qty: 2, location: "Pasadena", category: "Wraps" },
  { id: "630745019496", name: "Ankle Wrap S/M", qty: 1, location: "Pasadena", category: "Wraps" },
  { id: "25135", name: "Knee Brace OA Lateral XL", qty: 2, location: "Broadway", category: "Braces" },
  { id: "3847-S", name: "Shoulder Sling Small", qty: 4, location: "Broadway", category: "Splints" },
  { id: "02297309", name: "Walking Boot Standard M", qty: 3, location: "Broadway", category: "Boots" },
  { id: "612479166455", name: "Elbow Brace L", qty: 2, location: "Broadway", category: "Braces" },
  { id: "612479193062", name: "Wrist Support Universal", qty: 5, location: "Broadway", category: "Braces" },
  { id: "370121116912", name: "Compression Sleeve L", qty: 1, location: "Broadway", category: "Wraps" },
  { id: "840368505157", name: "Foam Heel Wedge", qty: 6, location: "Broadway", category: "Other" },
  { id: "616784120119", name: "Finger Splint Med", qty: 8, location: "Broadway", category: "Splints" },
  { id: "665973015248", name: "Ice Pack Wrap", qty: 3, location: "Friendswood", category: "Other" },
  { id: "300671201776", name: "Back Brace Large", qty: 2, location: "Friendswood", category: "Braces" },
  { id: "612479193123", name: "Ankle Stabilizer S", qty: 1, location: "Friendswood", category: "Braces" },
  { id: "612479225039", name: "Knee Sleeve XL", qty: 4, location: "Friendswood", category: "Braces" },
  { id: "100611-040", name: "Cast Boot Pediatric", qty: 1, location: "Friendswood", category: "Boots" },
  { id: "630745008940", name: "Cervical Collar Soft L", qty: 2, location: "Friendswood", category: "Splints" },
  { id: "630745064946", name: "Boot (Long) S", qty: 0, location: "Friendswood", category: "Boots" },
  { id: "100617-020", name: "Boot (Long) S Breg", qty: 2, location: "Friendswood", category: "Boots" },
];

const LOGS = [
  { id: 1, date: "2026-03-10", item: "Walking Boot Standard M", qty: 1, staff: "Dhruv Chaudhary", location: "Pasadena" },
  { id: 2, date: "2026-03-10", item: "Compression Sleeve L", qty: 1, staff: "Divya Sukumar", location: "Broadway" },
  { id: 3, date: "2026-03-10", item: "Elbow Brace L", qty: 1, staff: "Erika Herrera", location: "Broadway" },
  { id: 4, date: "2026-03-10", item: "Thumb Splint W/Stays", qty: 1, staff: "Divya Sukumar", location: "Pasadena" },
  { id: 5, date: "2026-03-09", item: "Ankle Aso, L", qty: 2, staff: "Angel Aguilar", location: "Broadway" },
];

const STAFF = [
  { name: "Dhruv Chaudhary", email: "dhruvchaudhary4590@gmail.com", role: "Admin" },
  { name: "Angel Aguilar", email: "aguilarangel016@gmail.com", role: "Staff" },
  { name: "Erika Herrera", email: "erikaherrera0020@gmail.com", role: "Staff" },
  { name: "Divya Sukumar", email: "divyasarat019@gmail.com", role: "Staff" },
  { name: "Connie Martinez", email: "martinezconnie195@gmail.com", role: "Staff" },
];

const LOCATIONS = ["Broadway", "Pasadena", "Friendswood"];
const CATEGORIES = ["All", "Braces", "Boots", "Splints", "Wraps", "Other"];

const C = {
  bg: "#080c14", bg2: "#0d1520", bg3: "#0f1e30",
  card: "#0a1628", border: "#1a2e48", border2: "#1e3a5f",
  blue: "#38bdf8", blue2: "#1d4ed8", blue3: "#0ea5e9",
  text: "#f1f5f9", text2: "#94a3b8", text3: "#475569",
  green: "#10b981", red: "#ef4444", amber: "#f59e0b",
  red2: "#1a0a0a", redborder: "#ef444430",
};

const qtyColor = (q) => q === 0 ? C.red : q <= 2 ? C.amber : C.green;

const Avatar = ({ name, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 600, color: "white", flexShrink: 0,
  }}>{name[0]}</div>
);

const Badge = ({ children, color = C.blue }) => (
  <span style={{
    background: color + "20", color, fontSize: 10, fontWeight: 600,
    padding: "2px 8px", borderRadius: 20, letterSpacing: "0.04em",
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", full = false, small = false }) => (
  <button onClick={onClick} style={{
    width: full ? "100%" : "auto",
    padding: small ? "8px 16px" : "13px 20px",
    borderRadius: 10,
    border: variant === "ghost" ? `1px solid ${C.border2}` : "none",
    background: variant === "primary" ? `linear-gradient(135deg,${C.blue2},${C.blue3})`
      : variant === "danger" ? "#7f1d1d"
      : variant === "success" ? "#064e3b"
      : "transparent",
    color: variant === "ghost" ? C.text2 : "white",
    fontSize: small ? 12 : 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
    transition: "opacity 0.15s",
  }}>{children}</button>
);

const Input = ({ label, value, onChange, placeholder, type = "text", right }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>}
    <div style={{ position: "relative" }}>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: "100%", background: C.card, border: `1px solid ${C.border2}`,
          borderRadius: 10, padding: right ? "11px 44px 11px 14px" : "11px 14px",
          color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none",
          boxSizing: "border-box",
        }}
      />
      {right && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{right}</div>}
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>}
    <select value={value} onChange={onChange} style={{
      width: "100%", background: C.card, border: `1px solid ${C.border2}`,
      borderRadius: 10, padding: "11px 14px", color: C.text,
      fontSize: 14, fontFamily: "inherit", outline: "none",
    }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Screen = ({ children, title, onBack, action }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>
    <div style={{
      padding: "14px 16px", display: "flex", alignItems: "center",
      borderBottom: `1px solid ${C.border}`, background: C.bg2, gap: 12, flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
          width: 34, height: 34, color: C.text2, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          fontFamily: "inherit", flexShrink: 0,
        }}>←</button>
      )}
      <span style={{ fontSize: 16, fontWeight: 700, color: C.text, flex: 1 }}>{title}</span>
      {action}
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>{children}</div>
  </div>
);

// HOME SCREEN
function HomeScreen({ office, setOffice, navigate, items }) {
  const officeItems = items.filter(i => i.location === office);
  const lowStock = items.filter(i => i.qty <= 2);
  const totalQty = officeItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>
      <div style={{ background: C.bg2, padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🏥</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>HH&F Inventory</div>
            <div style={{ fontSize: 11, color: C.text3 }}>Houston Hand & Foot Orthopedics</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {LOCATIONS.map(loc => (
            <button key={loc} onClick={() => setOffice(loc)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${office === loc ? C.blue2 : C.border}`,
              background: office === loc ? C.blue2 + "30" : C.card,
              color: office === loc ? C.blue : C.text3,
              fontSize: 11, fontWeight: office === loc ? 700 : 400, fontFamily: "inherit",
            }}>{loc}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Items", value: officeItems.length, color: C.blue },
            { label: "Total Stock", value: totalQty, color: C.green },
            { label: "Low Stock", value: lowStock.length, color: C.red },
          ].map((s, i) => (
            <div key={i} style={{
              background: C.card, border: `1px solid ${s.color}25`,
              borderRadius: 12, padding: "14px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.text3, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {lowStock.length > 0 && (
          <div style={{
            background: C.red2, border: `1px solid ${C.redborder}`,
            borderRadius: 12, padding: "12px 14px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginBottom: 8 }}>
              ⚠ {lowStock.length} ITEMS LOW STOCK
            </div>
            {lowStock.slice(0, 3).map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#fca5a5" }}>{i.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>{i.qty}</span>
              </div>
            ))}
            {lowStock.length > 3 && <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>+{lowStock.length - 3} more</div>}
          </div>
        )}

        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "📦", label: "All Items", sub: `${officeItems.length} items at ${office}`, screen: "items", color: C.blue },
            { icon: "🛒", label: "Dispense Item", sub: "Check out supply to patient", screen: "dispense", color: C.green },
            { icon: "🔄", label: "Office Transfer", sub: "Move items between offices", screen: "transfer", color: C.amber },
            { icon: "📥", label: "Receive Shipment", sub: "Add new stock", screen: "receive", color: "#a78bfa" },
            { icon: "📋", label: "Activity Log", sub: "Recent dispensing history", screen: "log", color: C.text2 },
          ].map((a, i) => (
            <button key={i} onClick={() => navigate(a.screen)} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left",
              transition: "border-color 0.15s",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: a.color + "20", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{a.label}</div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{a.sub}</div>
              </div>
              <div style={{ color: a.color, fontSize: 16 }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ITEMS SCREEN
function ItemsScreen({ onBack, items, office }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [loc, setLoc] = useState(office);
  const [selected, setSelected] = useState(null);

  const filtered = items.filter(i => {
    const s = search.toLowerCase();
    return (
      (i.name.toLowerCase().includes(s) || i.id.toLowerCase().includes(s)) &&
      (cat === "All" || i.category === cat) &&
      (loc === "All" || i.location === loc)
    );
  });

  if (selected) return (
    <Screen title={selected.name} onBack={() => setSelected(null)}>
      <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>{selected.name}</div>
            {selected.desc && <div style={{ fontSize: 12, color: C.text3 }}>{selected.desc}</div>}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: qtyColor(selected.qty) }}>{selected.qty}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { l: "Item ID", v: selected.id },
            { l: "Location", v: selected.location },
            { l: "Category", v: selected.category },
            { l: "Status", v: selected.qty === 0 ? "Out of stock" : selected.qty <= 2 ? "Low stock" : "In stock" },
          ].map((row, i) => (
            <div key={i} style={{ background: C.bg2, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: C.text3, marginBottom: 3 }}>{row.l}</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{row.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        background: selected.qty <= 2 ? C.red2 : "#0a1a12",
        border: `1px solid ${selected.qty <= 2 ? C.redborder : "#10b98130"}`,
        borderRadius: 12, padding: "12px 14px",
      }}>
        <div style={{ fontSize: 12, color: selected.qty <= 2 ? C.red : C.green, fontWeight: 700 }}>
          {selected.qty === 0 ? "⚠ OUT OF STOCK — Reorder immediately" : selected.qty <= 2 ? "⚠ LOW STOCK — Consider reordering" : "✓ Stock level OK"}
        </div>
      </div>
    </Screen>
  );

  return (
    <Screen title="All Items" onBack={onBack}>
      <div style={{ marginBottom: 12 }}>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or item ID..." right={<span style={{ color: C.text3, fontSize: 16 }}>⊞</span>} />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {["All", ...LOCATIONS].map(l => (
            <button key={l} onClick={() => setLoc(l)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              border: `1px solid ${loc === l ? C.blue2 : C.border}`,
              background: loc === l ? C.blue2 + "25" : "transparent",
              color: loc === l ? C.blue : C.text3, fontSize: 11,
              fontFamily: "inherit", fontWeight: loc === l ? 600 : 400,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingTop: 8, paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              flexShrink: 0, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              border: `1px solid ${cat === c ? C.amber : C.border}`,
              background: cat === c ? C.amber + "20" : "transparent",
              color: cat === c ? C.amber : C.text3, fontSize: 11,
              fontFamily: "inherit", fontWeight: cat === c ? 600 : 400,
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.text3, marginBottom: 10 }}>{filtered.length} items</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((item, i) => (
          <button key={i} onClick={() => setSelected(item)} style={{
            background: item.qty === 0 ? C.red2 : item.qty <= 2 ? "#120d00" : C.card,
            border: `1px solid ${item.qty === 0 ? C.redborder : item.qty <= 2 ? "#f59e0b30" : C.border}`,
            borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: C.bg3, flexShrink: 0, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {item.category === "Boots" ? "🥾" : item.category === "Braces" ? "🦵" : item.category === "Splints" ? "🩹" : "📦"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
              <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{item.location} · {item.id}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: qtyColor(item.qty) }}>{item.qty}</div>
              {item.qty <= 2 && <div style={{ fontSize: 9, color: item.qty === 0 ? C.red : C.amber, fontWeight: 600 }}>
                {item.qty === 0 ? "OUT" : "LOW"}
              </div>}
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

// DISPENSE SCREEN
function DispenseScreen({ onBack, items, office, addLog }) {
  const [loc, setLoc] = useState(office);
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState(1);
  const [staff, setStaff] = useState(STAFF[0].name);
  const [done, setDone] = useState(false);

  const found = items.find(i => i.id === itemId || i.name.toLowerCase().includes(itemId.toLowerCase()));
  const locItems = items.filter(i => i.location === loc);

  const confirm = () => {
    if (!found) return;
    addLog({ item: found.name, qty, staff, location: loc });
    setDone(true);
  };

  if (done) return (
    <Screen title="Dispense Item" onBack={onBack}>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Dispensed!</div>
        <div style={{ fontSize: 14, color: C.text2, marginBottom: 6 }}>{found?.name}</div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 32 }}>Qty: {qty} · {loc} · {staff}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => { setDone(false); setItemId(""); setQty(1); }}>Dispense Another</Btn>
          <Btn full onClick={onBack}>Done</Btn>
        </div>
      </div>
    </Screen>
  );

  return (
    <Screen title="Dispense Item" onBack={onBack}>
      <Select label="Location" value={loc} onChange={e => setLoc(e.target.value)} options={LOCATIONS} />
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Item</div>
        <div style={{ position: "relative" }}>
          <input
            value={itemId} onChange={e => setItemId(e.target.value)}
            placeholder="Scan barcode or type name..."
            list="items-list"
            style={{
              width: "100%", background: C.card, border: `1px solid ${found ? C.green : C.border2}`,
              borderRadius: 10, padding: "11px 44px 11px 14px", color: C.text,
              fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            }}
          />
          <datalist id="items-list">
            {locItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </datalist>
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: C.blue }}>⊞</div>
        </div>
      </div>

      {found && (
        <div style={{
          background: C.card, border: `1px solid ${C.green}40`,
          borderRadius: 12, padding: "14px", marginBottom: 14,
          display: "flex", gap: 14, alignItems: "center",
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: C.bg3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {found.category === "Boots" ? "🥾" : found.category === "Braces" ? "🦵" : "📦"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{found.name}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 3 }}>
              Stock: <span style={{ color: qtyColor(found.qty), fontWeight: 600 }}>{found.qty}</span> · {found.location}
              {found.desc && ` · ${found.desc}`}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Quantity</div>
        <div style={{
          background: C.card, border: `1px solid ${C.border2}`,
          borderRadius: 10, padding: "6px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
            flex: 1, padding: "10px", background: C.bg2, border: "none",
            borderRadius: 8, color: C.text2, fontSize: 20, cursor: "pointer",
          }}>−</button>
          <span style={{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.text }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{
            flex: 1, padding: "10px", background: C.blue2, border: "none",
            borderRadius: 8, color: "white", fontSize: 20, cursor: "pointer",
          }}>+</button>
        </div>
      </div>

      <Select label="Staff Member" value={staff} onChange={e => setStaff(e.target.value)} options={STAFF.map(s => s.name)} />

      <Btn full onClick={confirm} variant={found ? "primary" : "ghost"}>
        {found ? `Confirm Dispense — ${found.name.substring(0, 20)}` : "Select an item first"}
      </Btn>
    </Screen>
  );
}

// TRANSFER SCREEN
function TransferScreen({ onBack, items, office }) {
  const [from, setFrom] = useState(office);
  const [to, setTo] = useState(LOCATIONS.find(l => l !== office));
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  const fromItems = items.filter(i => i.location === from);
  const found = fromItems.find(i => i.id === itemId || i.name.toLowerCase().includes(itemId.toLowerCase()));

  if (done) return (
    <Screen title="Office Transfer" onBack={onBack}>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔄</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Transfer Logged!</div>
        <div style={{ fontSize: 14, color: C.text2, marginBottom: 6 }}>{found?.name}</div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 8 }}>{from} → {to}</div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 32 }}>Qty: {qty}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => { setDone(false); setItemId(""); setQty(1); }}>New Transfer</Btn>
          <Btn full onClick={onBack}>Done</Btn>
        </div>
      </div>
    </Screen>
  );

  return (
    <Screen title="Office Transfer" onBack={onBack}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 36px 1fr", gap: 8, alignItems: "end", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>From</div>
          <select value={from} onChange={e => setFrom(e.target.value)} style={{
            width: "100%", background: "#1a0a0a", border: `1px solid ${C.redborder}`,
            borderRadius: 10, padding: "11px 10px", color: "#fca5a5",
            fontSize: 13, fontFamily: "inherit", outline: "none",
          }}>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ textAlign: "center", paddingBottom: 10, fontSize: 18, color: C.blue }}>⇄</div>
        <div>
          <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>To</div>
          <select value={to} onChange={e => setTo(e.target.value)} style={{
            width: "100%", background: "#0a1a12", border: `1px solid #10b98130`,
            borderRadius: 10, padding: "11px 10px", color: "#6ee7b7",
            fontSize: 13, fontFamily: "inherit", outline: "none",
          }}>
            {LOCATIONS.filter(l => l !== from).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Item at {from}</div>
        <div style={{ position: "relative" }}>
          <input
            value={itemId} onChange={e => setItemId(e.target.value)}
            placeholder="Scan or search item..."
            list="transfer-items"
            style={{
              width: "100%", background: C.card, border: `1px solid ${found ? C.green : C.border2}`,
              borderRadius: 10, padding: "11px 44px 11px 14px", color: C.text,
              fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            }}
          />
          <datalist id="transfer-items">
            {fromItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </datalist>
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: C.blue }}>⊞</div>
        </div>
      </div>

      {found && (
        <div style={{
          background: C.card, border: `1px solid ${C.border2}`,
          borderRadius: 12, padding: 14, marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{found.name}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Available at {from}: <span style={{ color: qtyColor(found.qty), fontWeight: 600 }}>{found.qty}</span></div>
          </div>
          <Badge color={qtyColor(found.qty)}>{found.qty} in stock</Badge>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Quantity to Transfer</div>
        <div style={{
          background: C.card, border: `1px solid ${C.border2}`,
          borderRadius: 10, padding: "6px", display: "flex", alignItems: "center",
        }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ flex: 1, padding: "10px", background: C.bg2, border: "none", borderRadius: 8, color: C.text2, fontSize: 20, cursor: "pointer" }}>−</button>
          <span style={{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.text }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{ flex: 1, padding: "10px", background: C.blue2, border: "none", borderRadius: 8, color: "white", fontSize: 20, cursor: "pointer" }}>+</button>
        </div>
      </div>

      <Btn full onClick={() => found && setDone(true)} variant={found ? "success" : "ghost"}>
        {found ? `Transfer ${qty} × ${found.name.substring(0, 18)}` : "Select an item first"}
      </Btn>
    </Screen>
  );
}

// RECEIVE SHIPMENT SCREEN
function ReceiveScreen({ onBack, office }) {
  const [loc, setLoc] = useState(office);
  const [itemId, setItemId] = useState("");
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  if (done) return (
    <Screen title="Receive Shipment" onBack={onBack}>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📥</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Shipment Received!</div>
        <div style={{ fontSize: 14, color: C.text2, marginBottom: 6 }}>{name || itemId}</div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 32 }}>Qty: +{qty} · {loc}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => { setDone(false); setItemId(""); setName(""); setQty(1); }}>Receive Another</Btn>
          <Btn full onClick={onBack}>Done</Btn>
        </div>
      </div>
    </Screen>
  );

  return (
    <Screen title="Receive Shipment" onBack={onBack}>
      <Select label="Receiving Location" value={loc} onChange={e => setLoc(e.target.value)} options={LOCATIONS} />
      <Input label="Item ID / Barcode" value={itemId} onChange={e => setItemId(e.target.value)} placeholder="Scan barcode..." right={<span style={{ color: C.blue, fontSize: 18 }}>⊞</span>} />
      <Input label="Item Name" value={name} onChange={e => setName(e.target.value)} placeholder="Auto-fills from scan..." />
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Quantity Received</div>
        <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "6px", display: "flex", alignItems: "center" }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ flex: 1, padding: "10px", background: C.bg2, border: "none", borderRadius: 8, color: C.text2, fontSize: 20, cursor: "pointer" }}>−</button>
          <span style={{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.text }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{ flex: 1, padding: "10px", background: C.blue2, border: "none", borderRadius: 8, color: "white", fontSize: 20, cursor: "pointer" }}>+</button>
        </div>
      </div>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: C.text3,
      }}>
        📅 Received: <span style={{ color: C.text }}>{new Date().toLocaleDateString()}</span> &nbsp;·&nbsp;
        👤 By: <span style={{ color: C.text }}>Dhruv Chaudhary</span>
      </div>
      <Btn full onClick={() => (itemId || name) && setDone(true)} variant={(itemId || name) ? "primary" : "ghost"}>
        Confirm Receipt of {qty} Unit{qty > 1 ? "s" : ""}
      </Btn>
    </Screen>
  );
}

// LOG SCREEN
function LogScreen({ onBack, logs }) {
  return (
    <Screen title="Activity Log" onBack={onBack}>
      <div style={{ fontSize: 11, color: C.text3, marginBottom: 14 }}>{logs.length} recent entries</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, flex: 1, paddingRight: 10 }}>{log.item}</div>
              <Badge color={C.amber}>−{log.qty}</Badge>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge color={C.blue}>{log.location}</Badge>
              <Badge color={C.text3}>{log.staff.split(" ")[0]}</Badge>
              <Badge color={C.text3}>{log.date}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

// MAIN APP
export default function App() {
  const [screen, setScreen] = useState("home");
  const [office, setOffice] = useState("Broadway");
  const [items, setItems] = useState(ITEMS);
  const [logs, setLogs] = useState(LOGS);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, logsData] = await Promise.all([
          db.get("items"),
          db.get("dispensing_log", "&order=created_at.desc"),
        ]);
        if (Array.isArray(itemsData) && itemsData.length > 0) {
          setItems(itemsData.map(i => ({
            id: i.id, name: i.name, qty: i.quantity,
            location: i.location, category: i.category, desc: i.description,
          })));
          setDbConnected(true);
        }
        if (Array.isArray(logsData) && logsData.length > 0) {
          setLogs(logsData.map(l => ({
            id: l.id, date: l.created_at?.slice(0, 10),
            item: l.item_name, qty: l.quantity,
            staff: l.staff_name, location: l.location,
          })));
        }
      } catch (e) {
        console.log("Using offline data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addLog = async (entry) => {
    const newLog = { id: Date.now(), date: new Date().toISOString().slice(0, 10), ...entry };
    setLogs(prev => [newLog, ...prev]);
    setItems(prev => prev.map(i =>
      i.name === entry.item && i.location === entry.location
        ? { ...i, qty: Math.max(0, i.qty - entry.qty) } : i
    ));
    await db.insert("dispensing_log", {
      item_name: entry.item, quantity: entry.qty,
      staff_name: entry.staff, location: entry.location,
    });
  };

  if (loading) return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🏥</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>HH&F Inventory</div>
      <div style={{ fontSize: 12, color: C.text3 }}>Connecting to database...</div>
      <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
        <div style={{ width: "60%", height: "100%", background: C.blue, borderRadius: 2, animation: "load 1s ease infinite" }} />
      </div>
    </div>
  );

  const screens = {
    home: <HomeScreen office={office} setOffice={setOffice} navigate={setScreen} items={items} />,
    items: <ItemsScreen onBack={() => setScreen("home")} items={items} office={office} />,
    dispense: <DispenseScreen onBack={() => setScreen("home")} items={items} office={office} addLog={addLog} />,
    transfer: <TransferScreen onBack={() => setScreen("home")} items={items} office={office} />,
    receive: <ReceiveScreen onBack={() => setScreen("home")} office={office} />,
    log: <LogScreen onBack={() => setScreen("home")} logs={logs} />,
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: C.bg, height: "100vh", display: "flex",
      justifyContent: "center", alignItems: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        input, select { appearance: none; -webkit-appearance: none; }
        button { transition: opacity 0.15s, transform 0.1s; }
        button:active { opacity: 0.8; transform: scale(0.97); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes load { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>
      <div style={{
        width: "100%", maxWidth: 420, height: "100vh",
        maxHeight: 812, background: C.bg,
        borderRadius: window.innerWidth > 500 ? 32 : 0,
        overflow: "hidden", border: window.innerWidth > 500 ? `1px solid ${C.border}` : "none",
        boxShadow: window.innerWidth > 500 ? "0 40px 100px rgba(0,0,0,0.5)" : "none",
        display: "flex", flexDirection: "column",
      }}>
        <div className="fade-up" key={screen} style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {screens[screen]}
        </div>
        <div style={{
          display: "flex", background: C.bg2,
          borderTop: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          {[
            { id: "home", icon: "⌂", label: "Home" },
            { id: "items", icon: "📦", label: "Items" },
            { id: "dispense", icon: "🛒", label: "Dispense" },
            { id: "transfer", icon: "🔄", label: "Transfer" },
            { id: "log", icon: "📋", label: "Log" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{
              flex: 1, padding: "10px 4px 12px",
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              borderTop: `2px solid ${screen === tab.id ? C.blue : "transparent"}`,
              transition: "border-color 0.2s",
            }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, color: screen === tab.id ? C.blue : C.text3, fontWeight: screen === tab.id ? 700 : 400, fontFamily: "inherit" }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}