import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyTurnstileToken, clientIp } from "@/lib/turnstile-server";
import { consumeRateLimit } from "@/lib/rate-limit-server";
import { isHoneypotTripped } from "@/lib/honeypot";

type Body = {
  turnstileToken: string;
  pageId: string;
  quarter: number;
  name: string;
  dua?: string | null;
  releaseToken: string;
};

export async function POST(req: Request) {
  let body: Body & Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (isHoneypotTripped(body)) {
    return Response.json({ ok: true }); // Silent reject.
  }

  const ip = clientIp(req);
  const rl = await consumeRateLimit("sections.claim", ip);
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited", retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const verified = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!verified) {
    return Response.json({ ok: false, error: "turnstile_failed" }, { status: 403 });
  }

  if (!body.pageId || !/^[a-z0-9]{10,32}$/.test(body.pageId)) {
    return Response.json({ ok: false, error: "invalid_page_id" }, { status: 400 });
  }
  if (!Number.isInteger(body.quarter) || body.quarter < 1 || body.quarter > 240) {
    return Response.json({ ok: false, error: "invalid_quarter" }, { status: 400 });
  }
  if (!body.releaseToken || body.releaseToken.length < 16 || body.releaseToken.length > 64) {
    return Response.json({ ok: false, error: "invalid_release_token" }, { status: 400 });
  }

  // DB enforces 80-char name + 500-char dua caps via RPC. Client guards too.
  const { error } = await supabaseAdmin().rpc("claim_section" as never, {
    p_page_id: body.pageId,
    p_quarter: body.quarter,
    p_name: body.name,
    p_dua: body.dua ?? null,
    p_release_token: body.releaseToken,
  } as never);

  if (error) {
    const taken = /unavailable/i.test(error.message);
    return Response.json(
      { ok: false, error: taken ? "section_unavailable" : error.message },
      { status: taken ? 409 : 400 }
    );
  }

  return Response.json({ ok: true });
}
