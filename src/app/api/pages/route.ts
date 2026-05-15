import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyTurnstileToken, clientIp } from "@/lib/turnstile-server";
import { consumeRateLimit } from "@/lib/rate-limit-server";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/honeypot";

type Body = {
  turnstileToken: string;
  slug: string;
  editToken: string;
  mode: "memorial" | "living";
  gender: "male" | "female";
  relationship: { en: string; ar: string };
  name: { en: string; ar: string };
  startDate?: string | null;
  endDate?: string | null;
};

function isValidSlug(s: string) {
  return typeof s === "string" && /^[a-z0-9]{10,32}$/.test(s);
}

function clamp(s: string | undefined, max: number): string {
  if (!s) return "";
  return String(s).trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Body & { [HONEYPOT_FIELD]?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill every field; humans never see this one.
  if (isHoneypotTripped(body as Record<string, unknown>)) {
    return Response.json({ ok: true, slug: "noop" }); // Lie back so the bot doesn't probe.
  }

  const ip = clientIp(req);
  const rl = await consumeRateLimit("pages.create", ip);
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

  if (!isValidSlug(body.slug)) {
    return Response.json({ ok: false, error: "invalid_slug" }, { status: 400 });
  }
  if (!body.editToken || body.editToken.length < 24 || body.editToken.length > 64) {
    return Response.json({ ok: false, error: "invalid_edit_token" }, { status: 400 });
  }
  if (body.mode !== "memorial" && body.mode !== "living") {
    return Response.json({ ok: false, error: "invalid_mode" }, { status: 400 });
  }
  if (body.gender !== "male" && body.gender !== "female") {
    return Response.json({ ok: false, error: "invalid_gender" }, { status: 400 });
  }

  const relEn = clamp(body.relationship?.en, 40);
  const relAr = clamp(body.relationship?.ar, 40);
  const nameEn = clamp(body.name?.en, 80);
  const nameAr = clamp(body.name?.ar, 80);

  if (!relEn || !relAr || !nameEn || !nameAr) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("pages")
    .insert({
      id: body.slug,
      mode: body.mode,
      gender: body.gender,
      relationship_en: relEn,
      relationship_ar: relAr,
      name_en: nameEn,
      name_ar: nameAr,
      start_date: body.startDate ?? null,
      end_date: body.endDate ?? null,
      edit_token: body.editToken,
    });

  if (error) {
    const conflict = error.code === "23505" || /duplicate/i.test(error.message);
    return Response.json(
      { ok: false, error: conflict ? "slug_taken" : error.message },
      { status: conflict ? 409 : 500 }
    );
  }

  return Response.json({ ok: true, slug: body.slug });
}
