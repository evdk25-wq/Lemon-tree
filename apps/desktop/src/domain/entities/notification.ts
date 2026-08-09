export interface MentionNotification {
  readonly id: string;
  readonly recipientId: string;
  readonly messageId: string;
  readonly teamId: string;
  readonly channelId: string;
  readonly createdAt: string;
  readonly readAt: string | null;
}
