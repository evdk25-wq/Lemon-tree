import type { Decision } from "../entities/decision";

export interface DecisionRepository {
  listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly Decision[]>;
  save(decision: Decision): Promise<void>;
}
