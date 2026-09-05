import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckSquare2,
  FileText,
  FolderKanban,
  GitBranch,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { Presence } from "../../domain/entities/project";

export type AppView = "dashboard" | "personal";

interface NavigationItem {
  readonly id?: AppView;
  readonly label: string;
  readonly icon: typeof Home;
  readonly taskBadge?: boolean;
}

const navigationGroups: readonly (readonly NavigationItem[])[] = [
  [
    { id: "dashboard", label: "Accueil", icon: Home },
    { id: "personal", label: "Mon espace", icon: UserRound },
  ],
  [
    { label: "Projets", icon: FolderKanban },
    { label: "Tâches", icon: CheckSquare2, taskBadge: true },
    { label: "Documents", icon: FileText },
    { label: "Décisions", icon: ShieldCheck },
    { label: "Calendrier", icon: CalendarDays },
  ],
  [
    { label: "Git", icon: GitBranch },
    { label: "Analytics", icon: BarChart3 },
    { label: "Paramètres", icon: Settings },
  ],
];

interface SidebarProps {
  readonly activeView: AppView;
  readonly actionableTaskCount: number;
  readonly presence: Presence;
  readonly onNavigate: (view: AppView) => void;
  readonly onPresenceChange: (presence: Presence) => void;
}

const presenceLabels: Readonly<Record<Presence, string>> = {
  online: "Disponible",
  busy: "Occupé",
  away: "Absent",
  inCall: "En appel",
  offline: "Hors ligne",
};

const selectablePresences: readonly Presence[] = [
  "online",
  "busy",
  "away",
  "inCall",
  "offline",
];

export function Sidebar({
  activeView,
  actionableTaskCount,
  presence,
  onNavigate,
  onPresenceChange,
}: SidebarProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [presenceMenuOpen, setPresenceMenuOpen] = useState(false);

  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <button
        className="brand"
        aria-label="Lemon Tree, accueil"
        title="Accueil du workspace"
        onClick={() => {
          onNavigate("dashboard");
        }}
      >
        <span className="tree-mark">
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </span>
      </button>
      <nav className="nav-list">
        {navigationGroups.map((group, groupIndex) => (
          <div className="nav-group" key={groupIndex}>
            {group.map(({ id, label, icon: Icon, taskBadge }) => {
              const active = id === activeView;
              const available = id !== undefined;
              return (
                <button
                  key={label}
                  className={active ? "nav-item active" : "nav-item"}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  aria-disabled={!available}
                  title={available ? label : `${label} · bientôt disponible`}
                  onClick={
                    available
                      ? () => {
                          onNavigate(id);
                        }
                      : undefined
                  }
                >
                  <span className="nav-icon">
                    <Icon size={19} strokeWidth={2} />
                    {taskBadge && actionableTaskCount > 0 && (
                      <span className="nav-badge">{actionableTaskCount}</span>
                    )}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-profile-area">
        {profileMenuOpen && (
          <div className="profile-menu" role="menu" aria-label="Menu du profil">
            <header>
              <img src="/avatars/alex.jpg" alt="" />
              <span>
                <strong>Alex Morgan</strong>
                <small>
                  <i className={`presence-dot ${presence}`} />
                  {presenceLabels[presence]}
                </small>
              </span>
            </header>
            <button
              role="menuitem"
              onClick={() => {
                onNavigate("personal");
                setProfileMenuOpen(false);
              }}
            >
              <UserRound size={16} />
              <span>Mon espace</span>
            </button>
            <button
              role="menuitem"
              aria-expanded={presenceMenuOpen}
              onClick={() => {
                setPresenceMenuOpen((open) => !open);
              }}
            >
              <span
                className={`presence-choice-dot presence-dot ${presence}`}
              />
              <span>Changer le statut</span>
            </button>
            {presenceMenuOpen && (
              <div className="presence-menu" aria-label="Choisir un statut">
                {selectablePresences.map((candidate) => (
                  <button
                    key={candidate}
                    role="menuitemradio"
                    aria-checked={candidate === presence}
                    onClick={() => {
                      onPresenceChange(candidate);
                      setPresenceMenuOpen(false);
                    }}
                  >
                    <span className={`presence-dot ${candidate}`} />
                    <span>{presenceLabels[candidate]}</span>
                  </button>
                ))}
              </div>
            )}
            <button role="menuitem" aria-disabled="true">
              <UserCog size={16} />
              <span>Préférences</span>
              <small>Bientôt</small>
            </button>
            <button role="menuitem" aria-disabled="true">
              <Building2 size={16} />
              <span>Changer de workspace</span>
              <small>Bientôt</small>
            </button>
            <button
              className="profile-logout"
              role="menuitem"
              aria-disabled="true"
            >
              <LogOut size={16} />
              <span>Se déconnecter</span>
            </button>
          </div>
        )}
        <button
          className="sidebar-profile"
          aria-label="Ouvrir le menu du profil"
          aria-expanded={profileMenuOpen}
          onClick={() => {
            setProfileMenuOpen((open) => !open);
          }}
        >
          <img src="/avatars/alex.jpg" alt="" />
          <i className={`presence-dot ${presence}`} />
        </button>
      </div>
    </aside>
  );
}
