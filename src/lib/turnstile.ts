export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
