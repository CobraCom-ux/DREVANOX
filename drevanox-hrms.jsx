import { useState, useEffect, createContext, useContext } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DARK = "#8B6914";
const BLACK = "#0A0A0A";
const BLACK2 = "#111111";
const BLACK3 = "#1A1A1A";
const BLACK4 = "#222222";
const WHITE = "#F5F5F0";
const GRAY = "#888880";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Drevanox Admin", email: "admin@drevanox.com", password: "admin123", role: "super_admin", department: null, active: true },
  { id: 2, name: "Ahmed Raza", email: "ahmed@drevanox.com", password: "pass123", role: "hr_manager", department: "Human Resources", active: true },
  { id: 3, name: "Sara Khan", email: "sara@drevanox.com", password: "pass123", role: "finance_manager", department: "Finance", active: true },
  { id: 4, name: "Ali Hassan", email: "ali@drevanox.com", password: "pass123", role: "employee", department: "IT", active: true },
  { id: 5, name: "Fatima Malik", email: "fatima@drevanox.com", password: "pass123", role: "employee", department: "Marketing", active: false },
];

const INITIAL_DEPARTMENTS = [
  { id: 1, name: "Human Resources", head: "Ahmed Raza", employees: 8, color: "#C9A84C" },
  { id: 2, name: "Finance", head: "Sara Khan", employees: 12, color: "#4C9AC9" },
  { id: 3, name: "IT", head: "Ali Hassan", employees: 20, color: "#4CC98A" },
  { id: 4, name: "Marketing", head: "—", employees: 6, color: "#C94C9A" },
  { id: 5, name: "Operations", head: "—", employees: 15, color: "#9AC94C" },
];

const ROLES = [
  { value: "super_admin", label: "Super Admin", permissions: ["all"] },
  { value: "hr_manager", label: "HR Manager", permissions: ["employees", "leaves", "attendance"] },
  { value: "finance_manager", label: "Finance Manager", permissions: ["payroll", "expenses"] },
  { value: "employee", label: "Employee", permissions: ["self"] },
];

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: ${BLACK};
      color: ${WHITE};
      font-family: 'Rajdhani', sans-serif;
      min-height: 100vh;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${BLACK2}; }
    ::-webkit-scrollbar-thumb { background: ${GOLD_DARK}; border-radius: 2px; }

    .gold-text { color: ${GOLD}; }
    .white-text { color: ${WHITE}; }
    .gray-text { color: ${GRAY}; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-gold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .animate-fade { animation: fadeIn 0.4s ease forwards; }
    
    .gold-border-btn {
      background: transparent;
      border: 1px solid ${GOLD};
      color: ${GOLD};
      padding: 8px 18px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.2s;
    }
    .gold-border-btn:hover {
      background: ${GOLD};
      color: ${BLACK};
    }
    .gold-btn {
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%);
      background-size: 200% auto;
      border: none;
      color: ${BLACK};
      padding: 10px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1.5px;
      transition: all 0.3s;
      text-transform: uppercase;
    }
    .gold-btn:hover {
      background-position: right center;
      box-shadow: 0 4px 20px rgba(201,168,76,0.4);
      transform: translateY(-1px);
    }
    .danger-btn {
      background: transparent;
      border: 1px solid #C94C4C;
      color: #C94C4C;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .danger-btn:hover { background: #C94C4C; color: white; }
    
    input, select {
      background: ${BLACK3};
      border: 1px solid #333;
      color: ${WHITE};
      padding: 10px 14px;
      border-radius: 4px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 15px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, select:focus { border-color: ${GOLD}; }
    input::placeholder { color: ${GRAY}; }
    select option { background: ${BLACK3}; }

    .card {
      background: ${BLACK2};
      border: 1px solid #222;
      border-radius: 8px;
      padding: 20px;
    }
    .card-hover {
      transition: all 0.2s;
    }
    .card-hover:hover {
      border-color: ${GOLD_DARK};
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }

    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .badge-gold { background: rgba(201,168,76,0.15); color: ${GOLD}; border: 1px solid rgba(201,168,76,0.3); }
    .badge-green { background: rgba(76,201,138,0.15); color: #4CC98A; border: 1px solid rgba(76,201,138,0.3); }
    .badge-red { background: rgba(201,76,76,0.15); color: #C94C4C; border: 1px solid rgba(201,76,76,0.3); }
    .badge-blue { background: rgba(76,154,201,0.15); color: #4C9AC9; border: 1px solid rgba(76,154,201,0.3); }

    table { width: 100%; border-collapse: collapse; }
    th { 
      text-align: left; 
      padding: 12px 16px; 
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      color: ${GOLD};
      border-bottom: 1px solid #222;
      text-transform: uppercase;
    }
    td { 
      padding: 14px 16px; 
      border-bottom: 1px solid #1a1a1a;
      font-size: 14px;
      color: ${WHITE};
    }
    tr:hover td { background: rgba(201,168,76,0.03); }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    .modal {
      background: ${BLACK2};
      border: 1px solid #333;
      border-top: 2px solid ${GOLD};
      border-radius: 8px;
      padding: 28px;
      width: 480px;
      max-width: 90vw;
      animation: fadeIn 0.25s ease;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      color: ${GRAY};
      border: 1px solid transparent;
      margin-bottom: 2px;
      text-decoration: none;
    }
    .sidebar-link:hover { color: ${WHITE}; background: ${BLACK3}; }
    .sidebar-link.active { 
      color: ${GOLD}; 
      background: rgba(201,168,76,0.08);
      border-color: rgba(201,168,76,0.2);
    }
    .sidebar-link .icon { width: 18px; text-align: center; font-size: 16px; }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard: "⊞", users: "👥", departments: "🏢", payroll: "💰",
    attendance: "📋", leaves: "🌿", settings: "⚙️", logout: "→",
    add: "+", edit: "✎", delete: "✕", lock: "🔒", shield: "🛡",
    eye: "👁", close: "✕", check: "✓", warning: "⚠", crown: "♛",
    search: "⌕", filter: "≡", arrow: "→", back: "←",
  };
  return <span style={{ fontSize: size, color }}>{icons[name] || "•"}</span>;
};

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const DrevanoxLogo = ({ size = "md" }) => {
  const s = size === "lg" ? { title: 28, sub: 12 } : { title: 18, sub: 9 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size === "lg" ? 48 : 32,
        height: size === "lg" ? 48 : 32,
        background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT})`,
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size === "lg" ? 22 : 14,
        fontFamily: "'Cinzel', serif",
        color: BLACK,
        fontWeight: 900,
        boxShadow: `0 0 20px rgba(201,168,76,0.3)`,
      }}>D</div>
      <div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: s.title,
          fontWeight: 700,
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 3,
        }}>DREVANOX</div>
        <div style={{ fontSize: s.sub, color: GRAY, letterSpacing: 4, textTransform: "uppercase" }}>HR Management</div>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = INITIAL_USERS.find(u => u.email === email && u.password === password);
    if (!user) { setError("Invalid email or password"); setLoading(false); return; }
    if (!user.active) { setError("Account is deactivated. Contact Super Admin."); setLoading(false); return; }
    setLoading(false);
    onLogin(user);
  };

  return (
    <div style={{
      minHeight: "100vh", background: BLACK,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.05) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.03) 0%, transparent 50%)`,
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        opacity: 0.4,
      }} />
      {/* Grid lines */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${i * 20}%`, top: 0, bottom: 0,
          width: 1, background: `rgba(201,168,76,0.03)`,
        }} />
      ))}

      <div style={{ width: 420, padding: 20, animation: "fadeIn 0.5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <DrevanoxLogo size="lg" />
        </div>

        {/* Card */}
        <div style={{
          background: BLACK2,
          border: `1px solid #222`,
          borderTop: `2px solid ${GOLD}`,
          borderRadius: 10,
          padding: 36,
          boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.05)`,
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: WHITE, marginBottom: 6 }}>
              Welcome Back
            </div>
            <div style={{ fontSize: 14, color: GRAY }}>Sign in to your DREVANOX account</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: GOLD, letterSpacing: 1.5, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                type="email" placeholder="you@drevanox.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: GOLD, letterSpacing: 1.5, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ paddingRight: 44 }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 16
                }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(201,76,76,0.1)", border: "1px solid rgba(201,76,76,0.3)",
                borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#C94C4C",
              }}>⚠ {error}</div>
            )}

            <button className="gold-btn" onClick={handleLogin} disabled={loading}
              style={{ marginTop: 8, width: "100%", padding: "13px", fontSize: 16 }}>
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </div>

          <div style={{ marginTop: 24, padding: "16px", background: BLACK3, borderRadius: 6, fontSize: 12, color: GRAY }}>
            <div style={{ color: GOLD, fontWeight: 600, marginBottom: 6, fontSize: 11, letterSpacing: 1 }}>DEMO CREDENTIALS</div>
            <div>Super Admin: admin@drevanox.com / admin123</div>
            <div>HR Manager: ahmed@drevanox.com / pass123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ currentUser, activePage, setActivePage, onLogout }) => {
  const isSuperAdmin = currentUser.role === "super_admin";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞", roles: ["all"] },
    { id: "users", label: "Users & Access", icon: "👥", roles: ["super_admin"] },
    { id: "departments", label: "Departments", icon: "🏢", roles: ["super_admin", "hr_manager"] },
    { id: "employees", label: "Employees", icon: "🧑‍💼", roles: ["super_admin", "hr_manager"] },
    { id: "attendance", label: "Attendance", icon: "📋", roles: ["super_admin", "hr_manager"] },
    { id: "payroll", label: "Payroll", icon: "💰", roles: ["super_admin", "finance_manager"] },
    { id: "leaves", label: "Leave Management", icon: "🌿", roles: ["super_admin", "hr_manager", "employee"] },
    { id: "settings", label: "Settings", icon: "⚙️", roles: ["super_admin"] },
  ];

  const visibleNav = navItems.filter(item =>
    item.roles.includes("all") || item.roles.includes(currentUser.role)
  );

  return (
    <div style={{
      width: 230, minHeight: "100vh",
      background: BLACK2,
      borderRight: `1px solid #1E1E1E`,
      display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo area */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1E1E1E" }}>
        <DrevanoxLogo />
      </div>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: BLACK,
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: WHITE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: 11, color: GOLD }}>
              {isSuperAdmin ? "♛ Super Admin" : ROLES.find(r => r.value === currentUser.role)?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        {visibleNav.map(item => (
          <div
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px", borderTop: "1px solid #1E1E1E" }}>
        <div className="sidebar-link" onClick={onLogout}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color = GOLD }) => (
  <div className="card card-hover" style={{ flex: 1, minWidth: 160 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: GRAY, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 32, fontFamily: "'Cinzel', serif", color: color, fontWeight: 700 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 28, opacity: 0.6 }}>{icon}</div>
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ currentUser, users, departments }) => {
  const activeUsers = users.filter(u => u.active).length;
  const totalEmps = departments.reduce((a, d) => a + d.employees, 0);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: WHITE }}>
          Good morning, <span style={{ color: GOLD }}>{currentUser.name.split(" ")[0]}</span>
        </div>
        <div style={{ color: GRAY, fontSize: 14, marginTop: 4 }}>
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="Total Employees" value={totalEmps} sub="+3 this month" icon="👥" color={GOLD} />
        <StatCard label="Departments" value={departments.length} sub="Active" icon="🏢" color="#4C9AC9" />
        <StatCard label="Active Users" value={activeUsers} sub={`of ${users.length} total`} icon="✅" color="#4CC98A" />
        <StatCard label="On Leave Today" value="4" sub="2 pending approval" icon="🌿" color="#C94C9A" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Departments overview */}
        <div className="card">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: GOLD, letterSpacing: 1, marginBottom: 18 }}>
            DEPARTMENT OVERVIEW
          </div>
          {departments.map(d => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: WHITE, fontWeight: 500 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{d.head !== "—" ? `Head: ${d.head}` : "No head assigned"}</div>
              </div>
              <div style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{d.employees}</div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="card">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: GOLD, letterSpacing: 1, marginBottom: 18 }}>
            RECENT ACTIVITY
          </div>
          {[
            { text: "Ali Hassan checked in", time: "9:02 AM", icon: "📋" },
            { text: "Sara Khan submitted expense claim", time: "Yesterday", icon: "💰" },
            { text: "Leave request approved — Fatima Malik", time: "Yesterday", icon: "🌿" },
            { text: "New employee onboarded — IT dept", time: "2 days ago", icon: "👤" },
            { text: "Payroll processed for May 2026", time: "3 days ago", icon: "💵" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: WHITE }}>{item.text}</div>
                <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── USERS PAGE (Super Admin only) ────────────────────────────────────────────
const UsersPage = ({ users, setUsers, departments }) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee", department: "", active: true });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "employee", department: "", active: true });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ ...user });
    setShowModal(true);
  };

  const saveUser = () => {
    if (!form.name || !form.email) return;
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: WHITE }}>Users & Access Control</div>
          <div style={{ color: GRAY, fontSize: 14, marginTop: 4 }}>Manage user accounts and permissions</div>
        </div>
        <button className="gold-btn" onClick={openAdd}>+ Add User</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative", maxWidth: 340 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: GRAY }}>⌕</span>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 36 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: BLACK, flexShrink: 0,
                    }}>{user.name.charAt(0)}</div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                    {user.role === "super_admin" && <span style={{ fontSize: 14 }}>♛</span>}
                  </div>
                </td>
                <td style={{ color: GRAY, fontSize: 13 }}>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === "super_admin" ? "badge-gold" : "badge-blue"}`}>
                    {ROLES.find(r => r.value === user.role)?.label || user.role}
                  </span>
                </td>
                <td style={{ color: GRAY, fontSize: 13 }}>{user.department || "—"}</td>
                <td>
                  <span className={`badge ${user.active ? "badge-green" : "badge-red"}`}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="gold-border-btn" onClick={() => openEdit(user)} style={{ padding: "5px 12px", fontSize: 12 }}>
                      Edit
                    </button>
                    {user.role !== "super_admin" && (
                      <>
                        <button className="gold-border-btn" onClick={() => toggleActive(user.id)}
                          style={{ padding: "5px 12px", fontSize: 12, borderColor: user.active ? "#888" : "#4CC98A", color: user.active ? "#888" : "#4CC98A" }}>
                          {user.active ? "Deactivate" : "Activate"}
                        </button>
                        <button className="danger-btn" onClick={() => deleteUser(user.id)}>✕</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: GOLD, marginBottom: 24 }}>
              {editUser ? "Edit User" : "Add New User"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@drevanox.com" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.filter(r => r.value !== "super_admin").map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Department</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option value="">— Select Department —</option>
                  {INITIAL_DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="gold-btn" onClick={saveUser} style={{ flex: 1 }}>
                  {editUser ? "Save Changes" : "Create User"}
                </button>
                <button className="gold-border-btn" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DEPARTMENTS PAGE ─────────────────────────────────────────────────────────
const DepartmentsPage = ({ departments, setDepartments }) => {
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ name: "", head: "", employees: 0, color: GOLD });

  const openAdd = () => {
    setEditDept(null);
    setForm({ name: "", head: "", employees: 0, color: GOLD });
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditDept(dept);
    setForm({ ...dept });
    setShowModal(true);
  };

  const save = () => {
    if (!form.name) return;
    if (editDept) {
      setDepartments(departments.map(d => d.id === editDept.id ? { ...d, ...form } : d));
    } else {
      setDepartments([...departments, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const deleteDept = (id) => setDepartments(departments.filter(d => d.id !== id));

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: WHITE }}>Departments</div>
          <div style={{ color: GRAY, fontSize: 14, marginTop: 4 }}>Manage company departments</div>
        </div>
        <button className="gold-btn" onClick={openAdd}>+ New Department</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {departments.map(dept => (
          <div key={dept.id} className="card card-hover" style={{ borderTop: `3px solid ${dept.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 8,
                background: `${dept.color}22`,
                border: `1px solid ${dept.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>🏢</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="gold-border-btn" onClick={() => openEdit(dept)} style={{ padding: "4px 10px", fontSize: 11 }}>Edit</button>
                <button className="danger-btn" onClick={() => deleteDept(dept.id)} style={{ padding: "4px 8px" }}>✕</button>
              </div>
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: WHITE, marginBottom: 6 }}>{dept.name}</div>
            <div style={{ fontSize: 13, color: GRAY, marginBottom: 12 }}>
              Head: <span style={{ color: dept.head !== "—" ? WHITE : GRAY }}>{dept.head || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: GRAY }}>Employees</span>
              <span style={{ fontSize: 22, fontFamily: "'Cinzel', serif", color: dept.color, fontWeight: 700 }}>{dept.employees}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: GOLD, marginBottom: 24 }}>
              {editDept ? "Edit Department" : "New Department"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Department Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Engineering" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Department Head</label>
                <input value={form.head} onChange={e => setForm({ ...form, head: e.target.value })} placeholder="Name of head" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Number of Employees</label>
                <input type="number" value={form.employees} onChange={e => setForm({ ...form, employees: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Color</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                    style={{ width: 50, height: 38, padding: 2, cursor: "pointer" }} />
                  <span style={{ fontSize: 13, color: GRAY }}>{form.color}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="gold-btn" onClick={save} style={{ flex: 1 }}>Save</button>
                <button className="gold-border-btn" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PLACEHOLDER PAGES ────────────────────────────────────────────────────────
const PlaceholderPage = ({ title, icon, desc }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, animation: "fadeIn 0.3s ease" }}>
    <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: WHITE, marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>{desc}</div>
    <div style={{ padding: "10px 20px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, fontSize: 13, color: GOLD }}>
      🚧 Module coming soon — connect Firebase to activate
    </div>
  </div>
);

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [companyName, setCompanyName] = useState("DREVANOX");
  const [goldColor, setGoldColor] = useState(GOLD);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 600 }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: WHITE, marginBottom: 28 }}>System Settings</div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: GOLD, letterSpacing: 1, marginBottom: 20 }}>BRANDING</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Company Name</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Primary Color</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={goldColor} onChange={e => setGoldColor(e.target.value)}
                style={{ width: 50, height: 38, padding: 2 }} />
              <span style={{ fontSize: 13, color: GRAY }}>{goldColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: GOLD, letterSpacing: 1, marginBottom: 20 }}>FIREBASE INTEGRATION</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["API Key", "Auth Domain", "Project ID", "Storage Bucket"].map(field => (
            <div key={field}>
              <label style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{field}</label>
              <input placeholder={`Enter Firebase ${field}`} />
            </div>
          ))}
        </div>
      </div>

      <button className="gold-btn" onClick={save}>
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);

  const handleLogin = (user) => { setCurrentUser(user); setActivePage("dashboard"); };
  const handleLogout = () => { setCurrentUser(null); setActivePage("dashboard"); };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard currentUser={currentUser} users={users} departments={departments} />;
      case "users": return <UsersPage users={users} setUsers={setUsers} departments={departments} />;
      case "departments": return <DepartmentsPage departments={departments} setDepartments={setDepartments} />;
      case "employees": return <PlaceholderPage title="Employees" icon="🧑‍💼" desc="Full employee database with profiles, documents and history" />;
      case "attendance": return <PlaceholderPage title="Attendance" icon="📋" desc="Track daily attendance, check-ins and work hours" />;
      case "payroll": return <PlaceholderPage title="Payroll" icon="💰" desc="Salary processing, tax slabs and payslip generation" />;
      case "leaves": return <PlaceholderPage title="Leave Management" icon="🌿" desc="Apply, approve and track employee leaves" />;
      case "settings": return <SettingsPage />;
      default: return null;
    }
  };

  return (
    <>
      <GlobalStyle />
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div style={{ display: "flex", minHeight: "100vh", background: BLACK }}>
          <Sidebar
            currentUser={currentUser}
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
          />
          <main style={{
            marginLeft: 230, flex: 1, padding: "32px 36px",
            minHeight: "100vh",
          }}>
            {/* Top bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 32, paddingBottom: 20,
              borderBottom: `1px solid #1E1E1E`,
            }}>
              <div style={{ fontSize: 13, color: GRAY, letterSpacing: 1 }}>
                DREVANOX / <span style={{ color: GOLD }}>{activePage.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 13, color: GRAY }}>
                  {new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <span className={`badge ${currentUser.role === "super_admin" ? "badge-gold" : "badge-blue"}`}>
                  {currentUser.role === "super_admin" ? "♛ Super Admin" : ROLES.find(r => r.value === currentUser.role)?.label}
                </span>
              </div>
            </div>

            {renderPage()}
          </main>
        </div>
      )}
    </>
  );
}
