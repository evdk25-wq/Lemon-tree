export interface Decision {
  readonly id: string;
  readonly projectId: string;
  readonly teamId: string;
  readonly channelId: string;
  readonly sourceMessageId: string;
  readonly content: string;
  readonly createdBy: string;
  readonly createdAt: string;
}
