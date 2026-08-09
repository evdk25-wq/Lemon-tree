import type { Decision } from "../../domain/entities/decision";
import type { ProjectMessage } from "../../domain/entities/project";
import type { DecisionRepository } from "../../domain/repositories/decision-repository";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";

export class CreateDecisionFromMessage {
  constructor(
    private readonly decisions: DecisionRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(projectId: string, message: ProjectMessage): Promise<Decision> {
    const existing = await this.decisions.listByChannel(
      message.teamId,
      message.channelId,
    );
    const previous = existing.find(
      (decision) => decision.sourceMessageId === message.id,
    );
    if (previous) return previous;
    const decision: Decision = {
      id: this.ids.generate(),
      projectId,
      teamId: message.teamId,
      channelId: message.channelId,
      sourceMessageId: message.id,
      content: message.content,
      createdBy: message.author.id,
      createdAt: this.clock.now(),
    };
    await this.decisions.save(decision);
    return decision;
  }
}
