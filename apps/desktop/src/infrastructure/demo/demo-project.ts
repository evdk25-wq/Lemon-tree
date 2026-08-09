import type {
  Project,
  ProjectMessage,
  TeamChannel,
} from "../../domain/entities/project";

export const demoProject: Project = {
  id: "project-platform-v2",
  name: "Platform V2",
  description: "Une plateforme plus rapide, cohérente et prête à évoluer.",
  status: "active",
  progress: 68,
  teams: [
    {
      id: "team-leadership",
      name: "Tech Lead",
      description: "Architecture, coordination et qualité de livraison",
      progress: 82,
      color: "slate",
      members: [
        {
          id: "alex-morgan",
          displayName: "Alex Morgan",
          initials: "AM",
          avatarUrl: "/avatars/alex.jpg",
          presence: "online",
          role: "Tech Lead",
        },
      ],
    },
    {
      id: "team-frontend",
      name: "Frontend Team",
      description: "Design system et expérience de l’espace projet",
      progress: 72,
      color: "violet",
      members: [
        {
          id: "sophie-laurent",
          displayName: "Sophie Laurent",
          initials: "SL",
          avatarUrl: "/avatars/sophie.jpg",
          presence: "online",
          role: "Lead Frontend",
        },
        {
          id: "emma-chen",
          displayName: "Emma Chen",
          initials: "EC",
          avatarUrl: "/avatars/maya.jpg",
          presence: "busy",
          role: "Product Engineer",
        },
        {
          id: "marc-dubois",
          displayName: "Marc Dubois",
          initials: "MD",
          avatarUrl: "/avatars/alex.jpg",
          presence: "away",
          role: "Frontend Engineer",
        },
      ],
    },
    {
      id: "team-backend",
      name: "Backend Team",
      description: "API collaborative, données et synchronisation locale",
      progress: 61,
      color: "blue",
      members: [
        {
          id: "julien-martin",
          displayName: "Julien Martin",
          initials: "JM",
          avatarUrl: "/avatars/julien.jpg",
          presence: "online",
          role: "Lead Backend",
        },
        {
          id: "lucas-bernard",
          displayName: "Lucas Bernard",
          initials: "LB",
          avatarUrl: "/avatars/alex.jpg",
          presence: "inCall",
          role: "Backend Engineer",
        },
        {
          id: "nina-rossi",
          displayName: "Nina Rossi",
          initials: "NR",
          avatarUrl: "/avatars/maya.jpg",
          presence: "online",
          role: "Platform Engineer",
        },
      ],
    },
  ],
};

export const demoMessages: readonly ProjectMessage[] = [
  {
    id: "message-1",
    teamId: "team-backend",
    channelId: "general",
    author: demoProject.teams[2].members[0],
    content: "Le contrat de synchronisation est prêt pour la revue.",
    mentionedMemberIds: [],
    attachments: [],
    createdAt: "2026-08-09T08:42:00.000Z",
  },
  {
    id: "message-2",
    teamId: "team-backend",
    channelId: "general",
    author: demoProject.teams[2].members[2],
    content: "Parfait. Je termine les scénarios hors ligne cet après-midi.",
    mentionedMemberIds: [],
    attachments: [],
    createdAt: "2026-08-09T08:47:00.000Z",
  },
];

export const demoChannels: readonly TeamChannel[] = [
  {
    id: "general",
    teamId: "team-leadership",
    name: "general",
    archived: false,
  },
  {
    id: "announcements",
    teamId: "team-leadership",
    name: "annonces",
    archived: false,
  },
  { id: "general", teamId: "team-frontend", name: "general", archived: false },
  { id: "ui", teamId: "team-frontend", name: "ui", archived: false },
  {
    id: "design-system",
    teamId: "team-frontend",
    name: "design-system",
    archived: false,
  },
  { id: "general", teamId: "team-backend", name: "general", archived: false },
  { id: "api", teamId: "team-backend", name: "api", archived: false },
  { id: "database", teamId: "team-backend", name: "database", archived: false },
  {
    id: "incidents",
    teamId: "team-backend",
    name: "incidents",
    archived: false,
  },
];
