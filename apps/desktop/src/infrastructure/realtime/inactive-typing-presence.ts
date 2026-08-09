import type {
  TypingPresence,
  TypingPresenceEvent,
} from "../../application/ports/typing-presence";

export class InactiveTypingPresence implements TypingPresence {
  publish(event: TypingPresenceEvent): Promise<void> {
    return Promise.resolve(event).then(() => undefined);
  }

  subscribe(listener: (event: TypingPresenceEvent) => void): () => void {
    return () => {
      void listener;
    };
  }
}
