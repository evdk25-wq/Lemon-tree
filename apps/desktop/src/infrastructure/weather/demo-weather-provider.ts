import type { WeatherProvider } from "../../application/ports/weather-provider";
import type { WeatherSnapshot } from "../../domain/entities/weather";

export class DemoWeatherProvider implements WeatherProvider {
  getCurrent(): Promise<WeatherSnapshot> {
    return Promise.resolve({
      location: "Bruxelles",
      temperatureCelsius: 21,
      condition: "partlyCloudy",
      observedAt: new Date().toISOString(),
    });
  }
}
