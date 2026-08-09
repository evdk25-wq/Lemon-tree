import {
  BarChart3,
  CalendarDays,
  CheckSquare2,
  FileText,
  FolderKanban,
  GitBranch,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  { label: "Accueil", icon: Home, active: true },
  { label: "Projets", icon: FolderKanban },
  { label: "Tâches", icon: CheckSquare2, badge: "16" },
  { label: "Documents", icon: FileText },
  { label: "Décisions", icon: ShieldCheck },
  { label: "Calendrier", icon: CalendarDays },
  { label: "Git", icon: GitBranch },
  { label: "Analytics", icon: BarChart3 },
  { label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <button className="brand" aria-label="Lemon Tree, accueil">
        <span className="tree-mark">
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </span>
      </button>
      <nav className="nav-list">
        {navigation.map(({ label, icon: Icon, active, badge }) => (
          <button
            key={label}
            className={active ? "nav-item active" : "nav-item"}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-icon">
              <Icon size={20} strokeWidth={2} />
              {badge && <span className="nav-badge">{badge}</span>}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="sidebar-profile" aria-label="Profil d’Alex Morgan">
        <img src="/avatars/alex.jpg" alt="" />
        <i className="presence-dot online" />
      </button>
    </aside>
  );
}
