import { Maximize2, Minimize2 } from "lucide-react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  clampLayoutPercent,
  type DashboardLayout,
} from "../../domain/entities/dashboard-layout";
import {
  loadDashboardLayoutPreference,
  saveDashboardLayoutPreference,
} from "../../infrastructure/persistence/dashboard-layout-preference";

type PanelId = "teams" | "tasks" | "video" | "chat";

interface ResizableWorkspaceProps {
  readonly teams: ReactNode;
  readonly tasks: ReactNode;
  readonly video: ReactNode;
  readonly chat: ReactNode;
}

interface PanelSlotProps {
  readonly id: PanelId;
  readonly label: string;
  readonly expandedPanel: PanelId | null;
  readonly onToggle: (id: PanelId) => void;
  readonly children: ReactNode;
}

function PanelSlot({
  id,
  label,
  expandedPanel,
  onToggle,
  children,
}: PanelSlotProps) {
  const expanded = expandedPanel === id;
  return (
    <div
      className={`dashboard-panel-slot${expanded ? " expanded" : ""}`}
      data-panel={id}
    >
      {children}
      <button
        className="panel-expand-button"
        aria-label={expanded ? `Réduire ${label}` : `Agrandir ${label}`}
        onClick={() => {
          onToggle(id);
        }}
      >
        {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  );
}

export function ResizableWorkspace({
  teams,
  tasks,
  video,
  chat,
}: ResizableWorkspaceProps) {
  const [layout, setLayout] = useState<DashboardLayout>(
    loadDashboardLayoutPreference,
  );
  const [expandedPanel, setExpandedPanel] = useState<PanelId | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);

  const updateLayout = (updated: DashboardLayout) => {
    setLayout(updated);
    saveDashboardLayoutPreference(updated);
  };

  const resizeColumns = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = workspaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateLayout({
      ...layout,
      mainWidthPercent: clampLayoutPercent(
        ((event.clientX - bounds.left) / bounds.width) * 100,
      ),
    });
  };

  const resizeRows = (
    event: PointerEvent<HTMLButtonElement>,
    target: "teamHeightPercent" | "videoHeightPercent",
  ) => {
    const container =
      target === "teamHeightPercent" ? mainRef.current : railRef.current;
    const bounds = container?.getBoundingClientRect();
    if (!bounds) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateLayout({
      ...layout,
      [target]: clampLayoutPercent(
        ((event.clientY - bounds.top) / bounds.height) * 100,
      ),
    });
  };

  return (
    <div
      className={`workspace-grid resizable-workspace${expandedPanel ? " has-expanded-panel" : ""}`}
      ref={workspaceRef}
      style={{
        gridTemplateColumns: `${String(layout.mainWidthPercent)}fr 8px ${String(100 - layout.mainWidthPercent)}fr`,
      }}
    >
      <main
        className="workspace-main"
        ref={mainRef}
        style={{
          gridTemplateRows: `${String(layout.teamHeightPercent)}fr 8px ${String(100 - layout.teamHeightPercent)}fr`,
        }}
      >
        <PanelSlot
          id="teams"
          label="les équipes"
          expandedPanel={expandedPanel}
          onToggle={(id) => {
            setExpandedPanel((current) => (current === id ? null : id));
          }}
        >
          {teams}
        </PanelSlot>
        <button
          className="resize-handle horizontal"
          aria-label="Redimensionner les équipes et les tâches"
          onPointerMove={(event) => {
            if (event.buttons === 1) resizeRows(event, "teamHeightPercent");
          }}
        />
        <PanelSlot
          id="tasks"
          label="les tâches"
          expandedPanel={expandedPanel}
          onToggle={(id) => {
            setExpandedPanel((current) => (current === id ? null : id));
          }}
        >
          {tasks}
        </PanelSlot>
      </main>
      <button
        className="resize-handle vertical"
        aria-label="Redimensionner les colonnes"
        onPointerMove={(event) => {
          if (event.buttons === 1) resizeColumns(event);
        }}
      />
      <aside
        className="right-rail"
        ref={railRef}
        style={{
          gridTemplateRows: `${String(layout.videoHeightPercent)}fr 8px ${String(100 - layout.videoHeightPercent)}fr`,
        }}
      >
        <PanelSlot
          id="video"
          label="la vidéo"
          expandedPanel={expandedPanel}
          onToggle={(id) => {
            setExpandedPanel((current) => (current === id ? null : id));
          }}
        >
          {video}
        </PanelSlot>
        <button
          className="resize-handle horizontal"
          aria-label="Redimensionner la vidéo et le chat"
          onPointerMove={(event) => {
            if (event.buttons === 1) resizeRows(event, "videoHeightPercent");
          }}
        />
        <PanelSlot
          id="chat"
          label="le chat"
          expandedPanel={expandedPanel}
          onToggle={(id) => {
            setExpandedPanel((current) => (current === id ? null : id));
          }}
        >
          {chat}
        </PanelSlot>
      </aside>
    </div>
  );
}
