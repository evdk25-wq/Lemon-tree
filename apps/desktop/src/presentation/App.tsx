import {
  Bell,
  ChevronDown,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  UserRoundPlus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getTeamContext } from "../application/use-cases/get-team-context";
import { CreateTask } from "../application/use-cases/create-task";
import { DeleteTask } from "../application/use-cases/delete-task";
import { ListProjectTasks } from "../application/use-cases/list-project-tasks";
import { ListTeamMessages } from "../application/use-cases/list-team-messages";
import { MoveTask } from "../application/use-cases/move-task";
import { UpdateTask } from "../application/use-cases/update-task";
import { SendMessage } from "../application/use-cases/send-message";
import { ArchiveChannel } from "../application/use-cases/archive-channel";
import { CreateChannel } from "../application/use-cases/create-channel";
import { ListTeamChannels } from "../application/use-cases/list-team-channels";
import { RenameChannel } from "../application/use-cases/rename-channel";
import { ListUnreadNotifications } from "../application/use-cases/list-unread-notifications";
import { MarkNotificationRead } from "../application/use-cases/mark-notification-read";
import { CreateDecisionFromMessage } from "../application/use-cases/create-decision-from-message";
import { ListChannelDecisions } from "../application/use-cases/list-channel-decisions";
import type { Decision } from "../domain/entities/decision";
import type { MentionNotification } from "../domain/entities/notification";
import type { MessageAttachment } from "../domain/entities/attachment";
import type { TypingPresenceEvent } from "../application/ports/typing-presence";
import {
  teamColors as availableTeamColors,
  type ProjectMessage,
  type TeamChannel,
  type TeamColor,
} from "../domain/entities/project";
import type { Task, TaskStatus } from "../domain/entities/task";
import { demoProject } from "../infrastructure/demo/demo-project";
import { createChannelRepository } from "../infrastructure/persistence/channel-repository-factory";
import { createMessageRepository } from "../infrastructure/persistence/message-repository-factory";
import { createNotificationRepository } from "../infrastructure/persistence/notification-repository-factory";
import { createDecisionRepository } from "../infrastructure/persistence/decision-repository-factory";
import { InactiveTypingPresence } from "../infrastructure/realtime/inactive-typing-presence";
import { createTaskRepository } from "../infrastructure/persistence/task-repository-factory";
import {
  loadTeamColorPreferences,
  saveTeamColorPreferences,
} from "../infrastructure/persistence/team-color-preferences";
import { ChatPanel } from "./components/ChatPanel";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { EditTaskDialog } from "./components/EditTaskDialog";
import { KanbanBoard } from "./components/KanbanBoard";
import { ManageChannelsDialog } from "./components/ManageChannelsDialog";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { Sidebar } from "./components/Sidebar";
import { VideoPanel } from "./components/VideoPanel";

export function App() {
  const [selectedTeamId, setSelectedTeamId] = useState("team-backend");
  const [selectedChannelId, setSelectedChannelId] = useState("general");
  const [tasks, setTasks] = useState<readonly Task[]>([]);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [taskInitialTitle, setTaskInitialTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [messages, setMessages] = useState<readonly ProjectMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [channels, setChannels] = useState<readonly TeamChannel[]>([]);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<
    readonly MentionNotification[]
  >([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [focusedMessageId, setFocusedMessageId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<readonly Decision[]>([]);
  const [typingEvents, setTypingEvents] = useState<
    Readonly<Partial<Record<string, TypingPresenceEvent>>>
  >({});
  const [colorMenuTeamId, setColorMenuTeamId] = useState<string | null>(null);
  const [teamColorPreferences, setTeamColorPreferences] = useState<
    Readonly<Record<string, TeamColor>>
  >(loadTeamColorPreferences);
  const taskRepository = useMemo(createTaskRepository, []);
  const messageRepository = useMemo(createMessageRepository, []);
  const channelRepository = useMemo(createChannelRepository, []);
  const notificationRepository = useMemo(createNotificationRepository, []);
  const decisionRepository = useMemo(createDecisionRepository, []);
  const typingPresence = useMemo(() => new InactiveTypingPresence(), []);
  const listDecisions = useMemo(
    () => new ListChannelDecisions(decisionRepository),
    [decisionRepository],
  );
  const createDecisionFromMessage = useMemo(
    () =>
      new CreateDecisionFromMessage(
        decisionRepository,
        { now: () => new Date().toISOString() },
        { generate: () => crypto.randomUUID() },
      ),
    [decisionRepository],
  );
  const listUnreadNotifications = useMemo(
    () => new ListUnreadNotifications(notificationRepository),
    [notificationRepository],
  );
  const markNotificationRead = useMemo(
    () =>
      new MarkNotificationRead(notificationRepository, {
        now: () => new Date().toISOString(),
      }),
    [notificationRepository],
  );
  const listChannels = useMemo(
    () => new ListTeamChannels(channelRepository),
    [channelRepository],
  );
  const createChannel = useMemo(
    () =>
      new CreateChannel(channelRepository, {
        generate: () => crypto.randomUUID(),
      }),
    [channelRepository],
  );
  const renameChannel = useMemo(
    () => new RenameChannel(channelRepository),
    [channelRepository],
  );
  const archiveChannel = useMemo(
    () => new ArchiveChannel(channelRepository),
    [channelRepository],
  );
  const listMessages = useMemo(
    () => new ListTeamMessages(messageRepository),
    [messageRepository],
  );
  const sendMessage = useMemo(
    () =>
      new SendMessage(
        messageRepository,
        notificationRepository,
        { now: () => new Date().toISOString() },
        { generate: () => crypto.randomUUID() },
      ),
    [messageRepository, notificationRepository],
  );
  const listTasks = useMemo(
    () => new ListProjectTasks(taskRepository),
    [taskRepository],
  );
  const moveTask = useMemo(
    () => new MoveTask(taskRepository, { now: () => new Date().toISOString() }),
    [taskRepository],
  );
  const createTask = useMemo(
    () =>
      new CreateTask(
        taskRepository,
        { now: () => new Date().toISOString() },
        { generate: () => crypto.randomUUID() },
      ),
    [taskRepository],
  );
  const updateTask = useMemo(
    () =>
      new UpdateTask(taskRepository, { now: () => new Date().toISOString() }),
    [taskRepository],
  );
  const deleteTask = useMemo(
    () => new DeleteTask(taskRepository),
    [taskRepository],
  );
  const selectedTeam = getTeamContext(demoProject, selectedTeamId);
  const selectedTeamColor =
    teamColorPreferences[selectedTeam.id] ?? selectedTeam.color;
  const lead = demoProject.teams[0].members[0];
  const typingMembers = selectedTeam.members.filter((member) => {
    const event = typingEvents[member.id];
    return (
      member.id !== lead.id &&
      event !== undefined &&
      event.typing &&
      event.teamId === selectedTeamId &&
      event.channelId === selectedChannelId
    );
  });

  useEffect(
    () =>
      typingPresence.subscribe((event) => {
        setTypingEvents((current) => ({ ...current, [event.userId]: event }));
      }),
    [typingPresence],
  );

  const handleTypingChange = useCallback(
    (typing: boolean) => {
      void typingPresence.publish({
        userId: lead.id,
        teamId: selectedTeamId,
        channelId: selectedChannelId,
        typing,
        updatedAt: new Date().toISOString(),
      });
    },
    [lead.id, selectedChannelId, selectedTeamId, typingPresence],
  );

  const selectTeamColor = (teamId: string, color: TeamColor) => {
    setTeamColorPreferences((current) => {
      const updated = { ...current, [teamId]: color };
      saveTeamColorPreferences(updated);
      return updated;
    });
    setColorMenuTeamId(null);
  };

  const loadUnreadNotifications = useCallback(() => {
    void listUnreadNotifications
      .execute(lead.id)
      .then(setUnreadNotifications)
      .catch(() => {
        setUnreadNotifications([]);
      });
  }, [lead.id, listUnreadNotifications]);
  useEffect(() => {
    loadUnreadNotifications();
  }, [loadUnreadNotifications]);

  const handleOpenNotification = (notification: MentionNotification) => {
    setSelectedTeamId(notification.teamId);
    setSelectedChannelId(notification.channelId);
    setFocusedMessageId(notification.messageId);
    setNotificationsOpen(false);
    setUnreadNotifications((current) =>
      current.filter((candidate) => candidate.id !== notification.id),
    );
    void markNotificationRead.execute(notification.id).catch(() => {
      loadUnreadNotifications();
    });
  };

  const selectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedChannelId("general");
    setFocusedMessageId(null);
  };

  const loadChannels = useCallback(() => {
    setChannelError(null);
    void listChannels
      .execute(selectedTeamId)
      .then(setChannels)
      .catch(() => {
        setChannelError("Impossible de charger les canaux.");
      });
  }, [listChannels, selectedTeamId]);
  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const handleCreateChannel = async (name: string): Promise<boolean> => {
    try {
      const channel = await createChannel.execute(selectedTeamId, name);
      setChannels((current) => [...current, channel]);
      setChannelError(null);
      return true;
    } catch {
      setChannelError("Ce nom de canal est vide ou déjà utilisé.");
      return false;
    }
  };
  const handleRenameChannel = async (
    channel: TeamChannel,
    name: string,
  ): Promise<boolean> => {
    try {
      const renamed = await renameChannel.execute(channel, name);
      setChannels((current) =>
        current.map((candidate) =>
          candidate.id === renamed.id ? renamed : candidate,
        ),
      );
      setChannelError(null);
      return true;
    } catch {
      setChannelError("Le canal ne peut pas être renommé avec ce nom.");
      return false;
    }
  };
  const handleArchiveChannel = async (
    channel: TeamChannel,
  ): Promise<boolean> => {
    try {
      await archiveChannel.execute(channel);
      setChannels((current) =>
        current.filter((candidate) => candidate.id !== channel.id),
      );
      if (selectedChannelId === channel.id) setSelectedChannelId("general");
      setChannelError(null);
      return true;
    } catch {
      setChannelError("Le canal #general ne peut pas être archivé.");
      return false;
    }
  };

  const loadTasks = useCallback(() => {
    setTasksLoading(true);
    setTaskError(null);
    void listTasks
      .execute(demoProject.id)
      .then(setTasks)
      .catch(() => {
        setTaskError("Impossible de charger les tâches.");
      })
      .finally(() => {
        setTasksLoading(false);
      });
  }, [listTasks]);
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const loadMessages = useCallback(() => {
    setMessagesLoading(true);
    setMessageError(null);
    void listMessages
      .execute(selectedTeamId, selectedChannelId)
      .then(setMessages)
      .catch(() => {
        setMessageError("Impossible de charger la conversation.");
      })
      .finally(() => {
        setMessagesLoading(false);
      });
  }, [listMessages, selectedChannelId, selectedTeamId]);
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);
  useEffect(() => {
    void listDecisions
      .execute(selectedTeamId, selectedChannelId)
      .then(setDecisions)
      .catch(() => {
        setDecisions([]);
      });
  }, [listDecisions, selectedChannelId, selectedTeamId]);

  const handleCreateDecisionFromMessage = (message: ProjectMessage) => {
    void createDecisionFromMessage
      .execute(demoProject.id, message)
      .then((decision) => {
        setDecisions((current) =>
          current.some((candidate) => candidate.id === decision.id)
            ? current
            : [...current, decision],
        );
      });
  };

  const handleSendMessage = async (
    content: string,
    attachments: readonly MessageAttachment[],
  ): Promise<boolean> => {
    setMessageError(null);
    try {
      const message = await sendMessage.execute(
        selectedTeam.id,
        selectedChannelId,
        lead,
        selectedTeam.members,
        content,
        attachments,
      );
      setMessages((current) => [...current, message]);
      return true;
    } catch {
      setMessageError("Le message n’a pas pu être envoyé.");
      return false;
    }
  };

  const handleMoveTask = (taskId: string, status: TaskStatus) => {
    setTaskError(null);
    void moveTask
      .execute(taskId, status)
      .then((updated) => {
        setTasks((current) =>
          current.map((task) => (task.id === updated.id ? updated : task)),
        );
      })
      .catch(() => {
        setTaskError("Le déplacement n’a pas pu être enregistré.");
      });
  };
  const handleCreateTask = (
    title: string,
    priority: Task["priority"],
    assigneeId: string | null,
    dueDate: string | null,
  ) => {
    void createTask
      .execute({
        projectId: demoProject.id,
        teamId: selectedTeam.id,
        assigneeId,
        title,
        priority,
        dueDate,
      })
      .then((task) => {
        setTasks((current) => [...current, task]);
      })
      .catch(() => {
        setTaskError("La tâche n’a pas pu être créée.");
      });
  };
  const handleUpdateTask = (
    task: Task,
    title: string,
    priority: Task["priority"],
    assigneeId: string | null,
    dueDate: string | null,
  ) => {
    void updateTask
      .execute({
        taskId: task.id,
        title,
        priority,
        assigneeId,
        dueDate,
      })
      .then((updated) => {
        setTasks((current) =>
          current.map((candidate) =>
            candidate.id === updated.id ? updated : candidate,
          ),
        );
      })
      .catch(() => {
        setTaskError("Les modifications n’ont pas pu être enregistrées.");
      });
  };
  const handleDeleteTask = (task: Task) => {
    void deleteTask
      .execute(task.id)
      .then(() => {
        setTasks((current) =>
          current.filter((candidate) => candidate.id !== task.id),
        );
      })
      .catch(() => {
        setTaskError("La tâche n’a pas pu être supprimée.");
      });
  };

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
            <button
              className="notification-button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((open) => !open);
              }}
            >
              <Bell size={20} />
              {unreadNotifications.length > 0 && (
                <span>{unreadNotifications.length}</span>
              )}
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
                    <p>{lead.role}</p>
                  </div>
                </article>
                <article className="leader-card">
                  <span className="portrait portrait-large">
                    <img src="/avatars/maya.jpg" alt="" />
                    <span className="presence-dot online" />
                  </span>
                  <div>
                    <h2>Maya Dubois</h2>
                    <p>Product Manager</p>
                  </div>
                </article>
              </div>
              <div className="team-groups">
                {demoProject.teams.slice(1).map((team) => (
                  <section
                    className={`team-row team-color-${teamColorPreferences[team.id] ?? team.color}${team.id === selectedTeamId ? " selected" : ""}`}
                    key={team.id}
                  >
                    <header>
                      <button
                        onClick={() => {
                          selectTeam(team.id);
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
                        <button
                          aria-label={`Couleur de ${team.name}`}
                          aria-expanded={colorMenuTeamId === team.id}
                          onClick={() => {
                            setColorMenuTeamId((current) =>
                              current === team.id ? null : team.id,
                            );
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {colorMenuTeamId === team.id && (
                          <div
                            className="team-color-menu"
                            role="menu"
                            aria-label={`Choisir la couleur de ${team.name}`}
                          >
                            {availableTeamColors.map((color) => (
                              <button
                                className={`team-color-swatch team-color-${color}`}
                                role="menuitem"
                                aria-label={color}
                                key={color}
                                onClick={() => {
                                  selectTeamColor(team.id, color);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </header>
                    <div className="member-cards">
                      {team.members.map((member) => (
                        <button
                          className="member-card"
                          key={member.id}
                          onClick={() => {
                            selectTeam(team.id);
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
            <KanbanBoard
              team={selectedTeam}
              tasks={tasks}
              onMove={handleMoveTask}
              onCreate={() => {
                setCreateTaskOpen(true);
              }}
              onEdit={setEditingTask}
              loading={tasksLoading}
              error={taskError}
              onRetry={loadTasks}
              decisions={decisions}
              onOpenDecision={(decision) => {
                setSelectedChannelId(decision.channelId);
                setFocusedMessageId(decision.sourceMessageId);
              }}
            />
          </main>
          <aside className="right-rail">
            <VideoPanel team={selectedTeam} />
            <ChatPanel
              team={selectedTeam}
              teamColor={selectedTeamColor}
              teams={demoProject.teams}
              onSelectTeam={selectTeam}
              channels={channels}
              selectedChannelId={selectedChannelId}
              onSelectChannel={setSelectedChannelId}
              messages={messages}
              loading={messagesLoading}
              error={messageError}
              onRetry={loadMessages}
              onSend={handleSendMessage}
              onManageChannels={() => {
                setChannelsOpen(true);
              }}
              focusedMessageId={focusedMessageId}
              decisionMessageIds={decisions.map(
                (decision) => decision.sourceMessageId,
              )}
              onCreateTaskFromMessage={(message) => {
                setTaskInitialTitle(message.content);
                setCreateTaskOpen(true);
              }}
              onCreateDecisionFromMessage={handleCreateDecisionFromMessage}
              typingMembers={typingMembers}
              onTypingChange={handleTypingChange}
            />
          </aside>
        </div>
      </div>
      <CreateTaskDialog
        open={createTaskOpen}
        members={selectedTeam.members}
        initialTitle={taskInitialTitle}
        onClose={() => {
          setCreateTaskOpen(false);
          setTaskInitialTitle("");
        }}
        onCreate={handleCreateTask}
      />
      <EditTaskDialog
        task={editingTask}
        members={selectedTeam.members}
        onClose={() => {
          setEditingTask(null);
        }}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
      <ManageChannelsDialog
        open={channelsOpen}
        team={selectedTeam}
        channels={channels}
        error={channelError}
        onClose={() => {
          setChannelsOpen(false);
        }}
        onCreate={handleCreateChannel}
        onRename={handleRenameChannel}
        onArchive={handleArchiveChannel}
      />
      <NotificationsPanel
        open={notificationsOpen}
        notifications={unreadNotifications}
        project={demoProject}
        onClose={() => {
          setNotificationsOpen(false);
        }}
        onOpen={handleOpenNotification}
      />
    </div>
  );
}
