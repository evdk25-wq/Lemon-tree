import {
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  FolderKanban,
  MessageSquareText,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import type { PersonalOverview } from "../../application/use-cases/build-personal-overview";
import type { Member, Project } from "../../domain/entities/project";
import type { Task } from "../../domain/entities/task";
import type {
  WeatherCondition,
  WeatherSnapshot,
} from "../../domain/entities/weather";

interface PersonalSpaceProps {
  readonly member: Member;
  readonly project: Project;
  readonly overview: PersonalOverview;
  readonly weather: WeatherSnapshot | null;
  readonly onOpenTask: (task: Task) => void;
  readonly onOpenNotifications: () => void;
  readonly onOpenProject: () => void;
}

const priorityLabels: Readonly<Record<Task["priority"], string>> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
};

const weatherLabels: Readonly<Record<WeatherCondition, string>> = {
  clear: "Ciel dégagé",
  partlyCloudy: "Éclaircies",
  cloudy: "Nuageux",
  rain: "Pluie",
  snow: "Neige",
  storm: "Orage",
};

const weatherIcons = {
  clear: Sun,
  partlyCloudy: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
} satisfies Readonly<Record<WeatherCondition, typeof Sun>>;

export function PersonalSpace({
  member,
  project,
  overview,
  weather,
  onOpenTask,
  onOpenNotifications,
  onOpenProject,
}: PersonalSpaceProps) {
  const WeatherIcon = weather ? weatherIcons[weather.condition] : CloudSun;

  return (
    <main className="personal-space" aria-label="Mon espace">
      <header className="personal-hero">
        <div>
          <span>Mon espace</span>
          <h1>Bonjour {member.displayName.split(" ")[0]}</h1>
          <p>Voici ce qui mérite votre attention aujourd’hui.</p>
        </div>
        <div className="personal-hero-actions">
          <article className="weather-widget" aria-label="Météo actuelle">
            <WeatherIcon size={23} />
            {weather ? (
              <div>
                <strong>{weather.temperatureCelsius}°</strong>
                <span>
                  {weather.location} · {weatherLabels[weather.condition]}
                </span>
              </div>
            ) : (
              <div>
                <strong>--°</strong>
                <span>Météo indisponible</span>
              </div>
            )}
          </article>
          <button onClick={onOpenProject}>
            Ouvrir {project.name}
            <ArrowRight size={17} />
          </button>
        </div>
      </header>

      <section className="personal-stats" aria-label="Résumé personnel">
        <article>
          <span className="personal-stat-icon urgent">
            <CalendarClock />
          </span>
          <div>
            <strong>{overview.urgentTasks.length}</strong>
            <span>Priorités du jour</span>
          </div>
        </article>
        <article>
          <span className="personal-stat-icon tasks">
            <CheckCircle2 />
          </span>
          <div>
            <strong>{overview.assignedTasks.length}</strong>
            <span>Mes tâches actives</span>
          </div>
        </article>
        <article>
          <span className="personal-stat-icon mentions">
            <Bell />
          </span>
          <div>
            <strong>{overview.unreadNotifications.length}</strong>
            <span>Mentions non lues</span>
          </div>
        </article>
        <article>
          <span className="personal-stat-icon decisions">
            <ShieldCheck />
          </span>
          <div>
            <strong>{overview.decisionsToRead.length}</strong>
            <span>Décisions à lire</span>
          </div>
        </article>
      </section>

      <div className="personal-grid">
        <section className="personal-card personal-tasks">
          <header>
            <div>
              <CheckCircle2 size={18} />
              <h2>Mes tâches</h2>
            </div>
            <span>{overview.assignedTasks.length}</span>
          </header>
          {overview.assignedTasks.length === 0 ? (
            <p className="personal-empty">
              Aucune tâche active ne vous est assignée.
            </p>
          ) : (
            <div className="personal-task-list">
              {overview.assignedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onOpenTask(task);
                  }}
                >
                  <span className={`personal-priority ${task.priority}`} />
                  <span>
                    <strong>{task.title}</strong>
                    <small>
                      {priorityLabels[task.priority]} ·{" "}
                      {task.status === "inProgress" ? "En cours" : "À faire"}
                    </small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="personal-card">
          <header>
            <div>
              <Bell size={18} />
              <h2>Mentions</h2>
            </div>
            <button onClick={onOpenNotifications}>Tout voir</button>
          </header>
          {overview.unreadNotifications.length === 0 ? (
            <p className="personal-empty">Vous êtes à jour sur vos messages.</p>
          ) : (
            <button className="personal-mention" onClick={onOpenNotifications}>
              <MessageSquareText size={18} />
              <span>
                <strong>Vous avez été mentionné</strong>
                <small>
                  {overview.unreadNotifications.length} conversation à consulter
                </small>
              </span>
              <ArrowRight size={16} />
            </button>
          )}
        </section>

        <section className="personal-card">
          <header>
            <div>
              <Users size={18} />
              <h2>Mes équipes</h2>
            </div>
            <span>{overview.teams.length}</span>
          </header>
          <div className="personal-team-list">
            {overview.teams.map((team) => (
              <article key={team.id}>
                <span className={`team-dot team-color-${team.color}`} />
                <div>
                  <strong>{team.name}</strong>
                  <small>
                    {team.members.length} membre
                    {team.members.length > 1 ? "s" : ""}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="personal-card">
          <header>
            <div>
              <FolderKanban size={18} />
              <h2>Projet actif</h2>
            </div>
          </header>
          <button className="personal-project" onClick={onOpenProject}>
            <span>
              <strong>{project.name}</strong>
              <small>{project.description}</small>
            </span>
            <span className="project-progress">
              <i style={{ width: `${String(project.progress)}%` }} />
              <small>{project.progress}%</small>
            </span>
          </button>
        </section>
      </div>
    </main>
  );
}
