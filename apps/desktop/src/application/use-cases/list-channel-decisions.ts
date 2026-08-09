import type { Decision } from "../../domain/entities/decision";
import type { DecisionRepository } from "../../domain/repositories/decision-repository";

export class ListChannelDecisions {
  constructor(private readonly decisions: DecisionRepository) {}

  execute(teamId: string, channelId: string): Promise<readonly Decision[]> {
    return this.decisions.listByChannel(teamId, channelId);
  }
}
