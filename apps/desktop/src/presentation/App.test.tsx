import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("App", () => {
  it("represents project leadership as a regular manageable team", () => {
    render(<App />);

    expect(screen.getByText("Projet")).toBeInTheDocument();
    expect(screen.getAllByText("Lemon Tree Core").length).toBeGreaterThan(1);
    expect(
      screen.getByRole("button", { name: "Couleur de Tech Lead" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Maya Dubois").length).toBeGreaterThan(0);
  });

  it("opens the personal space from the main navigation", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Mon espace" }));

    expect(
      screen.getByRole("main", { name: "Mon espace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Bonjour Alex" }),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Météo actuelle")).toHaveTextContent(
      "Bruxelles",
    );
    expect(
      await screen.findByText("Implémenter Auth OAuth"),
    ).toBeInTheDocument();
  });

  it("shows the real actionable task count and opens the profile menu", async () => {
    render(<App />);

    expect(
      await screen.findByText("Implémenter Auth OAuth"),
    ).toBeInTheDocument();
    const navigation = screen.getByLabelText("Navigation principale");
    expect(
      within(navigation).getByRole("button", { name: "Tâches" }),
    ).toHaveTextContent("1");
    fireEvent.click(
      screen.getByRole("button", { name: "Ouvrir le menu du profil" }),
    );

    expect(
      screen.getByRole("menu", { name: "Menu du profil" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /Changer de workspace/ }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("changes and persists the member presence", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Ouvrir le menu du profil" }),
    );
    fireEvent.click(
      screen.getByRole("menuitem", { name: "Changer le statut" }),
    );
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Occupé" }));

    expect(screen.getByText("Occupé")).toBeInTheDocument();
    expect(localStorage.getItem("lemon-tree.member-presence")).toBe("busy");
  });

  it("expands and restores a dashboard panel", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Agrandir la vidéo" }));

    expect(
      screen.getByRole("button", { name: "Réduire la vidéo" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Réduire la vidéo" }));
    expect(
      screen.getByRole("button", { name: "Agrandir la vidéo" }),
    ).toBeInTheDocument();
  });

  it("creates and selects a new team", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Ajouter une équipe" }));
    fireEvent.change(screen.getByLabelText("Nom de l’équipe"), {
      target: { value: "Team Nuage" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Couleur green" }));
    fireEvent.click(screen.getByRole("button", { name: "Créer l’équipe" }));

    expect((await screen.findAllByText("Team Nuage")).length).toBeGreaterThan(
      1,
    );
    expect(
      screen.getByLabelText("Conversation Team Nuage"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Canal")).toHaveValue("general");
  });

  it("renames a team from its options menu", async () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Couleur de Backend Team" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Renommer" }));
    fireEvent.change(screen.getByLabelText("Nom de l’équipe"), {
      target: { value: "API Team" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect((await screen.findAllByText("API Team")).length).toBeGreaterThan(1);
    expect(screen.getByLabelText("Conversation API Team")).toBeInTheDocument();
  });

  it("switches the visible team context", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Frontend Team$/ }));
    expect(
      screen.getAllByRole("heading", { name: "Frontend Team" }),
    ).toHaveLength(1);
    expect(screen.getAllByText("Sophie Laurent").length).toBeGreaterThan(0);
    expect(
      screen.getByLabelText("Appel vidéo Frontend Team"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Conversation Frontend Team"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Tâches Frontend Team")).toBeInTheDocument();
  });

  it("edits a task from the kanban", async () => {
    render(<App />);
    fireEvent.click(await screen.findByText("Implémenter Auth OAuth"));
    const title = screen.getByLabelText("Titre");
    fireEvent.change(title, { target: { value: "Configurer Auth SSO" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByText("Configurer Auth SSO")).toBeInTheDocument();
  });

  it("deletes a task after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);
    fireEvent.click(await screen.findByText("Implémenter Auth OAuth"));
    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    await waitFor(() => {
      expect(
        screen.queryByText("Implémenter Auth OAuth"),
      ).not.toBeInTheDocument();
    });
  });

  it("sends a message to the selected team", async () => {
    render(<App />);
    const composer = screen.getByLabelText("Écrire un message");
    fireEvent.change(composer, { target: { value: "Message de test" } });
    const form = composer.closest("form");
    expect(form).not.toBeNull();
    if (form) fireEvent.submit(form);

    expect(await screen.findByText("Message de test")).toBeInTheDocument();
  });

  it("switches the complete context from the chat team selector", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Équipe du chat"), {
      target: { value: "team-frontend" },
    });

    expect(
      await screen.findByLabelText("Conversation Frontend Team"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Canal")).toHaveValue("general");
    expect(screen.getByLabelText("Tâches Frontend Team")).toBeInTheDocument();
  });

  it("applies a selected color to a team and its chat", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Couleur de Backend Team" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "orange" }));

    expect(screen.getByLabelText("Conversation Backend Team")).toHaveClass(
      "team-color-orange",
    );
  });

  it("opens a mention notification in its team and channel", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Équipe du chat"), {
      target: { value: "team-frontend" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    fireEvent.click(await screen.findByText("Vous avez été mentionné"));

    expect(
      await screen.findByLabelText("Conversation Backend Team"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Canal")).toHaveValue("general");
    expect(
      await screen.findByText(
        "Le contrat de synchronisation est prêt pour la revue.",
      ),
    ).toBeInTheDocument();
  });

  it("creates a decision from a chat message", async () => {
    render(<App />);
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Actions du message de Julien Martin",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Créer une décision" }));
    expect(await screen.findByText("Décision créée")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Décisions du projet" }),
    );
    expect(screen.getByText("Décisions de Backend Team")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Voir le message" }),
    ).toBeInTheDocument();
  });
});
