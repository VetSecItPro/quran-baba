// Hidden-field honeypot. Bots that scrape and fill all inputs trigger it; humans don't see it.
//
// Convention: the form has an `<input name="website" />` positioned off-screen via the className
// returned by HONEYPOT_STYLE. Bots that don't run CSS still fill the field - and they always do.
//
// On the server, treat any non-empty value as a bot. Return 200 with no side effects to avoid
// signaling to the bot that it tripped the trap. (We do return early without writes.)

export const HONEYPOT_FIELD = "website";

// Tailwind classes that hide visually but stay in DOM + tab order is suppressed.
// Don't use display:none - bots have learned to skip hidden inputs.
export const HONEYPOT_STYLE =
  "absolute opacity-0 pointer-events-none -left-[9999px] top-0 w-0 h-0";

export function isHoneypotTripped(body: Record<string, unknown> | undefined | null): boolean {
  if (!body) return false;
  const v = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}
