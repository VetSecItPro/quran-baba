import "server-only";
import { supabaseAdmin } from "./supabase-admin";

export type RateAction = "pages.create" | "sections.claim" | "sections.release" | "sections.complete";

const LIMITS: Record<RateAction, { max: number; windowSeconds: number }> = {
  "pages.create":      { max: 3,   windowSeconds: 3600 },   // 3 pages / hour / IP
  "sections.claim":    { max: 60,  windowSeconds: 3600 },   // 60 claims / hour / IP
  "sections.release":  { max: 120, windowSeconds: 3600 },
  "sections.complete": { max: 120, windowSeconds: 3600 },
};

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export async function consumeRateLimit(action: RateAction, ip: string): Promise<RateLimitResult> {
  if (!ip) {
    // No IP means we can't enforce; allow but log later if abuse surfaces.
    return { ok: true, remaining: -1 };
  }
  const { max, windowSeconds } = LIMITS[action];
  const sb = supabaseAdmin() as unknown as {
    from: (t: string) => any;
    rpc: (n: string, a: any) => Promise<any>;
  };
  const sinceIso = new Date(Date.now() - windowSeconds * 1000).toISOString();

  // Count recent hits for this (ip, action) within the window.
  // rate_limits isn't in our hand-written Database types - we type the client loosely above.
  const { count, error: countErr } = await sb
    .from("rate_limits")
    .select("id", { head: true, count: "exact" })
    .eq("ip", ip)
    .eq("action", action)
    .gte("created_at", sinceIso);

  if (countErr) {
    // Fail open on infra errors so legit users aren't blocked.
    console.warn("rate-limit count failed", countErr.message);
    return { ok: true, remaining: -1 };
  }

  const used = count ?? 0;
  if (used >= max) {
    return { ok: false, retryAfterSeconds: windowSeconds };
  }

  // Record this hit.
  await sb.from("rate_limits").insert({ ip, action });

  // Opportunistic GC - keep table from growing forever. ~1% of requests trigger cleanup.
  if (Math.random() < 0.01) {
    sb.rpc("gc_rate_limits", { p_keep_seconds: 7200 }).then(() => {});
  }

  return { ok: true, remaining: max - used - 1 };
}
