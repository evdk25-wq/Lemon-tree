export interface TypingPresenceEvent {
  readonly userId: string;
  readonly teamId: string;
  readonly channelId: string;
  readonly typing: boolean;
  readonly updatedAt: string;
}

export interface TypingPresence {
  publish(event: TypingPresenceEvent): Promise<void>;
  subscribe(listener: (event: TypingPresenceEvent) => void): () => void;
}
