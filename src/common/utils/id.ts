import { randomUUID } from "node:crypto";

/** UUIDv4 IDs are generated on the client for offline records; the server uses this for its own rows. */
export function newId(): string {
  return randomUUID();
}
