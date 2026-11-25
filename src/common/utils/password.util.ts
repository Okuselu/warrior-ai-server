import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const PREFIX = "scrypt";

/** Hashes a password with a per-user salt using Node's scrypt KDF. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${PREFIX}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/** Constant-time verification; malformed stored hashes simply fail closed. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex] = stored.split("$");
  if (algorithm !== PREFIX || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length === 0) return false;

  const actual = (await scrypt(
    password,
    Buffer.from(saltHex, "hex"),
    expected.length
  )) as Buffer;

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
