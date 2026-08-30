import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

const SECRET = process.env.SESSION_SECRET ?? "";
const ADMIN_USER = process.env.ADMIN_USER ?? "";
const ADMIN_PASS = process.env.ADMIN_PASS ?? "";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function safeCompare(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
}

export function createAdminToken(username: string): string {
  if (!SECRET) {
    throw new Error("SESSION_SECRET is required");
  }

  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${username}.${exp}`;

  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !SECRET) return false;

  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let payload: string;

  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expected = sign(payload);
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return false;
  }

  const parts = payload.split(".");
  const username = parts.slice(0, -1).join(".");
  const exp = Number(parts.at(-1));

  return (
    safeCompare(username, ADMIN_USER) &&
    Number.isFinite(exp) &&
    Date.now() < exp
  );
}

export function checkAdminCredentials(
  username: string,
  password: string
): boolean {
  if (!SECRET || !ADMIN_USER || !ADMIN_PASS) {
    return false;
  }

  return (
    safeCompare(username, ADMIN_USER) &&
    safeCompare(password, ADMIN_PASS)
  );
}

export function isAdminRequest(req: Request): boolean {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : undefined;

  return verifyAdminToken(token);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
