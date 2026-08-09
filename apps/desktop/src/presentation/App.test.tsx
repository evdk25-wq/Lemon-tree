import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("App", () => {
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
});
