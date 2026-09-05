import type { WeatherSnapshot } from "../../domain/entities/weather";

export interface WeatherProvider {
  getCurrent(): Promise<WeatherSnapshot>;
}
