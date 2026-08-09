import {
  Bell,
  ChevronDown,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { getTeamContext } from "../application/use-cases/get-team-context";
import { demoMessages, demoProject } from "../infrastructure/demo/demo-project";
import { ChatPanel } from "./components/ChatPanel";
import { KanbanBoard } from "./components/KanbanBoard";
import { Sidebar } from "./components/Sidebar";
import { VideoPanel } from "./components/VideoPanel";

export function App() {
  const [selectedTeamId, setSelectedTeamId] = useState("team-backend");
  const selectedTeam = getTeamContext(demoProject, selectedTeamId);
  const lead = demoProject.teams[0].members[0];

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-body">
        <header className="topbar">
          <div className="wordmark">
            <span className="wordmark-symbol">LT</span>
            <strong>LEMON TREE</strong>
          </div>
          <div className="topbar-actions">
            <button aria-label="Rechercher">
              <Search size={20} />
            </button>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span>3</span>
            </button>
            <button aria-label="Changer de thème">
              <Moon size={19} />
            </button>
            <button className="top-profile" aria-label="Profil d’Alex Morgan">
              <img src="/avatars/alex.jpg" alt="" />
            </button>
          </div>
        </header>
        <div className="workspace-grid">
          <main className="workspace-main">
            <section
              className="team-overview"
              aria-label="Organisation de l’équipe"
            >
              <header className="team-selector">
                <span>Équipe</span>
                <button>
                  {selectedTeam.name}
                  <ChevronDown size={16} />
                </button>
              </header>
              <div className="leadership-row">
                <article className="leader-card">
                  <span className="portrait portrait-large">
                    <img src={lead.avatarUrl} alt="" />
                    <span className="presence-dot online" />
                  </span>
                  <div>
                    <h2>{lead.displayName}</h2>
                    <p>
                      <span className="presence-dot online" /> Statut : occupé,
                      ouvert
                    </p>
                  </div>
                </article>
                <article className="leader-card">
                  <span className="portrait portrait-large">
                    <img src="/avatars/maya.jpg" alt="" />
                    <span className="presence-dot online" />
                  </span>
                  <div>
                    <h2>Maya Dubois</h2>
                    <p>
                      <span className="presence-dot online" /> En ligne
                    </p>
                  </div>
                </article>
              </div>
              <div className="team-groups">
                {demoProject.teams.slice(1).map((team) => (
                  <section
                    className={
                      team.id === selectedTeamId
                        ? "team-row selected"
                        : "team-row"
                    }
                    key={team.id}
                  >
                    <header>
                      <button
                        onClick={() => {
                          setSelectedTeamId(team.id);
                        }}
                      >
                        <h2>{team.name}</h2>
                      </button>
                      <div>
                        <button aria-label={`Inviter dans ${team.name}`}>
                          <Plus size={18} />
                        </button>
                        <span>
                          <UserRoundPlus size={17} /> {team.members.length}
                        </span>
                        <button aria-label={`Options de ${team.name}`}>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </header>
                    <div className="member-cards">
                      {team.members.map((member) => (
                        <button
                          className="member-card"
                          key={member.id}
                          onClick={() => {
                            setSelectedTeamId(team.id);
                          }}
                        >
                          <span className="portrait">
                            <img src={member.avatarUrl} alt="" />
                            <span
                              className={`presence-dot ${member.presence}`}
                            />
                          </span>
                          <span>
                            <strong>{member.displayName}</strong>
                            <small>{member.role}</small>
                          </span>
                        </button>
                      ))}
                      {team.id === selectedTeamId && (
                        <button className="invite-card">
                          <Plus size={22} />
                          <span>Inviter</span>
                        </button>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </section>
            <KanbanBoard team={selectedTeam} />
          </main>
          <aside className="right-rail">
            <VideoPanel team={selectedTeam} />
            <ChatPanel team={selectedTeam} messages={demoMessages} />
          </aside>
        </div>
      </div>
    </div>
  );
}
