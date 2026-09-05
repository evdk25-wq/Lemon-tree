export type WeatherCondition =
  "clear" | "partlyCloudy" | "cloudy" | "rain" | "snow" | "storm";

export interface WeatherSnapshot {
  readonly location: string;
  readonly temperatureCelsius: number;
  readonly condition: WeatherCondition;
  readonly observedAt: string;
}
