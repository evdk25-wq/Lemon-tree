import type { WeatherProvider } from "../ports/weather-provider";

export class GetCurrentWeather {
  constructor(private readonly weatherProvider: WeatherProvider) {}

  execute() {
    return this.weatherProvider.getCurrent();
  }
}
