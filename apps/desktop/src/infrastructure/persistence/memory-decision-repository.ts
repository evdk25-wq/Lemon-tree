import type { Decision } from "../../domain/entities/decision";
import type { DecisionRepository } from "../../domain/repositories/decision-repository";

export class MemoryDecisionRepository implements DecisionRepository {
  private decisions: Decision[] = [];

  listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly Decision[]> {
    return Promise.resolve(
      this.decisions.filter(
        (decision) =>
          decision.teamId === teamId && decision.channelId === channelId,
      ),
    );
  }

  save(decision: Decision): Promise<void> {
    this.decisions = [...this.decisions, decision];
    return Promise.resolve();
  }
}
