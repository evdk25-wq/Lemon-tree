import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
