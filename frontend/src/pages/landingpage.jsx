import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/nowil-logo.png";
import NowILLogo from "../assets/Logo.svg";

// ─── Heart Icon Component ─────────────────────────────────────────────────────
const Heart = ({ isLiked, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={isLiked ? "#dc2626" : "none"}
    stroke={isLiked ? "#dc2626" : "#999"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// ─── PlayerCard Component ──────────────────────────────────────────────────────
function PlayerCard({ player, onFollow }) {
  const [hearted, setHearted] = useState(false);

  function formatNIL(v) {
    if (v >= 1) return `$${v.toFixed(1)}M`;
    return `$${Math.round(v * 1000)}k`;
  }

  const changeColor = player.change >= 0 ? "#16a34a" : "#dc2626";

  return (
    <div style={styles.playerCard}>
      <div style={styles.playerCardHeader}>
        <span style={{ fontSize: "0.62rem", fontWeight: 600 }}>
          {player.name} | {player.college} | {player.pos} | #{player.number}
        </span>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => { setHearted(!hearted); onFollow && onFollow(player); }}
        >
          <Heart isLiked={hearted} size={18} />
        </button>
      </div>
      <div style={styles.playerCardImg}>
        <img src={player.imgUrl} alt={player.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      </div>
      <div style={{ padding: "10px 14px" }}>
        <div style={styles.statRow}>
          <span style={{ color: "#666" }}>NIL Value:</span>
          <span style={{ fontWeight: 700 }}>{formatNIL(player.nil)}</span>
        </div>
        <div style={{ ...styles.statRow, borderBottom: "none" }}>
          <span style={{ color: "#666" }}>NIL Change:</span>
          <span style={{ fontWeight: 700, color: changeColor }}>
            {player.change >= 0 ? "+" : ""}{player.change}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const FEATURED_PLAYER = {
  name: "Garrett Nussmeier",
  college: "LSU",
  pos: "QB",
  number: "18",
  nil: 4.0,
  change: -4,
  imgUrl: "https://a.espncdn.com/i/headshots/college-football/players/full/4567747.png",
};

const ALL_PLAYERS = [
  { rank: 1,  name: "Shedeur Sanders",   college: "Colorado",   sport: "Football", year: "Senior",    pos: "QB", nil: 8.5,   change: 5.1  },
  { rank: 2,  name: "Quinn Ewers",        college: "Texas",      sport: "Football", year: "Senior",    pos: "QB", nil: 6.1,   change: -2.3 },
  { rank: 3,  name: "Gunner Stockton",    college: "Georgia",    sport: "Football", year: "Junior",    pos: "QB", nil: 5.0,   change: 3.5  },
  { rank: 4,  name: "Garrett Nussmeier",  college: "LSU",        sport: "Football", year: "Senior",    pos: "QB", nil: 4.0,   change: -4.0 },
  { rank: 5,  name: "DJ Lagway",          college: "Florida",    sport: "Football", year: "Freshman",  pos: "QB", nil: 3.2,   change: 12.4 },
  { rank: 6,  name: "Dillon Gabriel",     college: "Oregon",     sport: "Football", year: "Senior",    pos: "QB", nil: 2.8,   change: -1.1 },
  { rank: 7,  name: "Carson Beck",        college: "Georgia",    sport: "Football", year: "Senior",    pos: "QB", nil: 2.5,   change: 4.2  },
  { rank: 8,  name: "Will Howard",        college: "Ohio State", sport: "Football", year: "Senior",    pos: "QB", nil: 2.1,   change: 8.9  },
  { rank: 9,  name: "Nico Iamaleava",     college: "Tennessee",  sport: "Football", year: "Sophomore", pos: "QB", nil: 1.9,   change: 2.3  },
  { rank: 10, name: "Jalen Milroe",       college: "Alabama",    sport: "Football", year: "Junior",    pos: "QB", nil: 1.7,   change: -3.4 },
  { rank: 11, name: "Tyler Shough",       college: "Louisville", sport: "Football", year: "Senior",    pos: "QB", nil: 1.2,   change: 1.8  },
  { rank: 12, name: "Gio Lopez",          college: "UNC",        sport: "Football", year: "Sophomore", pos: "QB", nil: 0.769, change: 0.8  },
  { rank: 13, name: "Kyle McCord",        college: "Syracuse",   sport: "Football", year: "Senior",    pos: "QB", nil: 0.650, change: -0.5 },
  { rank: 14, name: "Grayson Loftis",     college: "UNCC",       sport: "Football", year: "Sophomore", pos: "QB", nil: 0.260, change: -0.1 },
  { rank: 15, name: "Brock Glenn",        college: "FSU",        sport: "Football", year: "Sophomore", pos: "QB", nil: 0.210, change: 1.4  },
];

const CHART_DATA = {
  labels: ["8/24/25", "9/6/25", "9/13/25", "9/20/25", "9/27/25", "10/11/25", "10/18/25"],
  values: [4.0, 4.4, 5.1, 4.8, 5.3, 4.9, 4.3],
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, defaultMode }) {
  const [mode, setMode] = useState(defaultMode || "login");

  useEffect(() => { if (open) setMode(defaultMode || "signup"); }, [open, defaultMode]);

  if (!open) return null;

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <button style={styles.modalClose} onClick={onClose}>✕</button>
        {mode === "login" ? (
          <>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6, color: "black" }}>Welcome back</h2>
            <p style={{ color: "#666", marginBottom: 24, fontSize: "0.9rem" }}>Sign in to your NowIL account</p>
            <div style={styles.formGroup}><label style={styles.label}>Email</label><input style={styles.input} type="email" placeholder="you@example.com" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Password</label><input style={styles.input} type="password" placeholder="••••••••" /></div>
            <button style={{ ...styles.btnPrimary, width: "100%", marginTop: 4 }} onClick={onClose}>Sign In</button>
            <div style={styles.modalSwitch}>Don't have an account? <span style={styles.link} onClick={() => setMode("signup")}>Sign up free</span></div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6, color: "black" }}>Get Started Free</h2>
            <p style={{ color: "#666", marginBottom: 24, fontSize: "0.9rem" }}>Create your NowIL account and start tracking NIL</p>
            <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input style={styles.input} type="text" placeholder="Your name" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Email</label><input style={styles.input} type="email" placeholder="you@example.com" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Password</label><input style={styles.input} type="password" placeholder="••••••••" /></div>
            <button style={{ ...styles.btnPrimary, width: "100%", marginTop: 4 }} onClick={onClose}>Create Account</button>
            <div style={styles.modalSwitch}>Already have an account? <span style={styles.link} onClick={() => setMode("login")}>Sign in</span></div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── NIL Chart (Canvas) ────────────────────────────────────────────────────────
function NILChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = () => {
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext("2d");
      chartRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: CHART_DATA.labels,
          datasets: [{
            label: "NIL Value per Game",
            data: CHART_DATA.values,
            borderColor: "#0F5A2B",
            backgroundColor: "rgba(15, 90, 43, 0.08)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#0F5A2B",
            pointBorderColor: "white",
            pointBorderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => `$${c.parsed.y}M` } },
          },
          scales: {
            y: { ticks: { callback: (v) => `$${v}M` }, grid: { color: "#f0f0f0" } },
            x: { grid: { color: "#f0f0f0" } },
          },
        },
      });
    };
    document.head.appendChild(script);
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <canvas ref={canvasRef} height="100" />;
}

// ─── Stats Counter ─────────────────────────────────────────────────────────────
function StatCounter({ label, target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800, step = 16;
        const inc = target / (duration / step);
        const timer = setInterval(() => {
          start += inc;
          if (start >= target) { start = target; clearInterval(timer); }
          setVal(Math.round(start));
        }, step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={styles.statItem}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statNumber}>{prefix}{val >= 100 ? val.toLocaleString() : val}{suffix}</div>
    </div>
  );
}

// ─── Players Table ─────────────────────────────────────────────────────────────
function PlayersTable({ onGateClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [followed, setFollowed] = useState({});

  function formatNIL(v) {
    if (v >= 1) return `$${v.toFixed(1)}M`;
    return `$${Math.round(v * 1000)}k`;
  }

  function handleSort(key) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  const data = [...ALL_PLAYERS].sort((a, b) => {
    if (!sortKey) return 0;
    const va = sortKey === "nil" ? a.nil : a.change;
    const vb = sortKey === "nil" ? b.nil : b.change;
    return sortAsc ? va - vb : vb - va;
  });

  function toggleFollow(idx) {
    setFollowed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div style={{ overflowY: "auto", maxHeight: 420, border: "1px solid #e5e7eb", borderRadius: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
        <thead>
          <tr>
            {["#", "Athlete", "College", "Sport", "Year", "POS"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("nil")}>NIL Value ↕</th>
            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("change")}>NIL Change ↕</th>
            <th style={styles.th}>Follow</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}><span style={{ fontWeight: 600 }}>{p.name}</span></td>
              <td style={{ ...styles.td, color: "#666" }}>{p.college}</td>
              <td style={styles.td}>{p.sport}</td>
              <td style={styles.td}>{p.year}</td>
              <td style={styles.td}>
                <span style={styles.posBadge}>{p.pos}</span>
              </td>
              <td style={{ ...styles.td, fontWeight: 700 }}>{formatNIL(p.nil)}</td>
              <td style={{ ...styles.td, fontWeight: 600, color: p.change >= 0 ? "#16a34a" : "#dc2626" }}>
                {p.change >= 0 ? "+" : ""}{p.change}%
              </td>
              <td style={styles.td}>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => { followed[i] ? toggleFollow(i) : onGateClick(); }}
                >
                  <Heart isLiked={followed[i]} size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("signup");

  function openModal(mode = "signup") {
    setModalMode(mode);
    setModalOpen(true);
  }
///workspaces/NowIL/frontend/src/assets/NowIL logo.png
  return (
    <div style={{ fontFamily: "Inter, sans-seårif", color: "#111", background: "#fff" }}>
      {/* NAV */}
      <nav style={styles.nav}>
        <a href="#" style={styles.logo}>
            <img 
             src={logo} 
            alt="NowIL Logo" 
            style={{ height: "40px", display: "block" }}
             />
        </a>
        <ul style={styles.navUl}>
          <li><a href="#" style={styles.navLink}>Contact</a></li>
          <li><a href="#" style={styles.navLink}>About</a></li>
          <li>
            <button style={styles.btnLogin} onClick={() => openModal("login")}>Login</button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <div style={styles.hero}>
        <PlayerCard player={FEATURED_PLAYER} onFollow={() => openModal("signup")} />
        <div style={styles.heroText}>
          <h1 style={styles.heroH1}>
            <span style={{ color: "#000000" }}>Real time </span><span style={{ color: "#0F5A2B" }}>NIL</span> <span style={{ color: "#000000" }}>estimations after every game </span>
          </h1>
          <p style={styles.heroP}>
            Track, follow, and discover college athletes' Name, Image &amp; Likeness valuations updated after every game.
          </p>
          <button style={styles.btnPrimary} onClick={() => openModal("signup")}>Get Started</button>
        </div>
      </div>

      {/* CHART */}
      <div style={styles.section}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800, textAlign: "center", marginBottom: 28 }}>
          <span style={{ color: "#000000" }}>See a Players NIL Rise and Fall </span>
        </h2>
        <div style={styles.chartCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>NIL Graph</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#666" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#0F5A2B", display: "inline-block" }} />
              NIL Value per Game
            </span>
          </div>
          <NILChart />
        </div>
      </div>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        <StatCounter label="Total Players Tracked" target={1652} />
        <StatCounter label="Total Colleges Tracked" target={50} />
        <StatCounter label="Total NIL Tracked" target={82} prefix="$" suffix="M" />
        <StatCounter label="Total NIL Deals" target={700} />
      </div>

      {/* SEARCH */}
      <div style={styles.searchSection}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: 20 }}>
          <span style={{ color: "#000000" }}>Find your favorites easily at any time </span>
        </h2>
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#666" }}>🔍</span>
          <input
            type="text"
            readOnly
            placeholder="Search your favorite players, sports, teams ..."
            style={styles.searchInput}
            onClick={() => openModal("signup")}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableSection}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
          <span style={{ color: "#0F5A2B" }}>Sort and filter</span> <span style={{ color: "#000000" }}>players by NIL, position, team and more!</span>
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={styles.filterSearch}>
            🔍 <input type="text" readOnly style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: "0.85rem", width: 60, background: "white" }} onClick={() => openModal("signup")} />
          </div>
          <div style={styles.filterTag}>Sport: Football <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => openModal("signup")}>✕</button></div>
          <div style={styles.filterTag}>POS: QB <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => openModal("signup")}>✕</button></div>
          <button style={styles.filterBtn} onClick={() => openModal("signup")}>Filter by</button>
        </div>
        <PlayersTable onGateClick={() => openModal("signup")} />
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={NowILLogo} alt="NowIL Logo" style={{ height: "30px", display: "block" }} />
        </div>
        <div>© 2026 NowIL. All rights reserved.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ color: "#aaa", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} defaultMode={modalMode} />
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 48px", borderBottom: "1px solid #e5e7eb",
    position: "sticky", top: 0, background: "white", zIndex: 100,
  },
  logo: { fontSize: "1.5rem", fontWeight: 800, color: "#111", textDecoration: "none" },
  navUl: { listStyle: "none", display: "flex", gap: 28, alignItems: "center", margin: 0, padding: 0 },
  navLink: { textDecoration: "none", color: "#666", fontSize: "0.9rem", fontWeight: 500 },
  btnLogin: {
    background: "#0F5A2B", color: "white", border: "none", padding: "8px 20px",
    borderRadius: 6, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
  },
  hero: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 60, padding: "64px 48px", maxWidth: 1100, margin: "0 auto",
  },
  heroText: {},
  heroH1: { fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.2, maxWidth: 360 },
  heroP: { color: "#666", margin: "16px 0 28px", fontSize: "1rem", maxWidth: 340 },
  btnPrimary: {
    background: "#0F5A2B", color: "white", border: "none",
    padding: "14px 40px", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer",
  },
  playerCard: {
    background: "white", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    width: 220, flexShrink: 0, overflow: "hidden", border: "1px solid #ddd",
  },
  playerCardHeader: {
    background: "#4a1e8a", color: "white", padding: "8px 12px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  playerCardImg: {
    width: "100%", height: 170, background: "#d8d8d8",
    overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "7px 0", borderBottom: "1px solid #eee", fontSize: "0.88rem",
  },
  section: { padding: "48px 48px", maxWidth: 1100, margin: "0 auto" },
  chartCard: {
    background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
    padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  statsBar: {
    display: "flex", justifyContent: "center", gap: 20,
    padding: "40px 48px", background: "white", flexWrap: "wrap",
  },
  statItem: {
    textAlign: "center", border: "1.5px solid #e5e7eb", borderRadius: 50,
    padding: "14px 32px", minWidth: 180, position: "relative", background: "white",
  },
  statLabel: {
    position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
    background: "#0F5A2B", color: "white", fontSize: "0.72rem", fontWeight: 700,
    whiteSpace: "nowrap", padding: "3px 14px", borderRadius: 50,
  },
  statNumber: { fontSize: "2rem", fontWeight: 800, marginTop: 4 },
  searchSection: { padding: "56px 48px 24px", maxWidth: 1100, margin: "0 auto", textAlign: "center" },
  searchInput: {
    width: "100%", padding: "14px 20px 14px 44px", border: "1px solid #e5e7eb",
    borderRadius: 50, fontSize: "0.95rem", fontFamily: "inherit", outline: "none", cursor: "pointer", background: "white", color: "black"
  },
  tableSection: { padding: "16px 48px 64px", maxWidth: 1100, margin: "0 auto" },
  filterSearch: {
    display: "flex", alignItems: "center", gap: 8,
    border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 12px",
    background: "white", fontSize: "0.85rem",
  },
  filterTag: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#0F5A2B", color: "white",
    padding: "6px 12px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
  },
  filterBtn: {
    border: "1px solid #e5e7eb", background: "white", padding: "6px 16px",
    borderRadius: 6, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
  },
  th: {
    textAlign: "left", padding: "10px 12px", color: "#666",
    fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase",
    borderBottom: "2px solid #e5e7eb", background: "#f9fafb",
    position: "sticky", top: 0, zIndex: 1,
  },
  td: { padding: "12px 12px" },
  posBadge: {
    background: "#e5e7eb", color: "#111", padding: "2px 8px",
    borderRadius: 4, fontSize: "0.75rem", fontWeight: 600,
  },
  footer: {
    background: "#111", color: "#aaa", padding: "32px 48px",
    display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem",
  },
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "white", borderRadius: 16, padding: 40, maxWidth: 440, width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)", position: "relative",
  },
  modalClose: { position: "absolute", top: 16, right: 20, fontSize: "1.4rem", cursor: "pointer", background: "none", border: "none", color: "#666" },
  formGroup: { marginBottom: 16, },
  label: { display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb",
    borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", outline: "none",
    boxSizing: "border-box", background: "white"
  },
  modalSwitch: { textAlign: "center", marginTop: 16, fontSize: "0.85rem", color: "#666" },
  link: { color: "#0F5A2B", fontWeight: 600, cursor: "pointer" },
};
