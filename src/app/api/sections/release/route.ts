import { supabaseAdmin } from "@/lib/supabase-admin";
import { clientIp } from "@/lib/turnstile-server";
import { consumeRateLimit } from "@/lib/rate-limit-server";

// Release uses the per-claim release_token as the auth (which only the claimant has).
// No Turnstile required - possession of the token IS the proof. CSP blocks XSS exfil.

type Body = {
  pageId: string;
  quarter: number;
  releaseToken: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const rl = await consumeRateLimit("sections.release", clientIp(req));
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited", retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  if (!body.pageId || !/^[a-z0-9]{10,32}$/.test(body.pageId)) {
    return Response.json({ ok: false, error: "invalid_page_id" }, { status: 400 });
  }
  if (!Number.isInteger(body.quarter) || body.quarter < 1 || body.quarter > 240) {
    return Response.json({ ok: false, error: "invalid_quarter" }, { status: 400 });
  }
  if (!body.releaseToken || body.releaseToken.length < 16) {
    return Response.json({ ok: false, error: "missing_release_token" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().rpc("release_section" as never, {
    p_page_id: body.pageId,
    p_quarter: body.quarter,
    p_release_token: body.releaseToken,
  } as never);

  if (error) {
    const forbidden = /token mismatch|cannot release/i.test(error.message);
    return Response.json(
      { ok: false, error: forbidden ? "forbidden" : error.message },
      { status: forbidden ? 403 : 400 }
    );
  }
  return Response.json({ ok: true });
}
