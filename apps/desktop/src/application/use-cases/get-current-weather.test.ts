import { describe, expect, it } from "vitest";
import type { WeatherProvider } from "../ports/weather-provider";
import { GetCurrentWeather } from "./get-current-weather";

describe("GetCurrentWeather", () => {
  it("returns the snapshot supplied by the weather provider", async () => {
    const snapshot = {
      location: "Bruxelles",
      temperatureCelsius: 21,
      condition: "partlyCloudy" as const,
      observedAt: "2026-08-11T14:00:00.000Z",
    };
    const provider: WeatherProvider = {
      getCurrent: () => Promise.resolve(snapshot),
    };

    await expect(new GetCurrentWeather(provider).execute()).resolves.toEqual(
      snapshot,
    );
  });
});
