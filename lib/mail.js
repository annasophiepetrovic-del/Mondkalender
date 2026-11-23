// Verschickt den Login-Link über Resend (resend.com).
export async function sendLoginMail(email, link) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Login-Link (nur lokal):", link);
      return { dev: true };
    }
    throw new Error("MAIL_NOT_CONFIGURED");
  }
  const text =
    "Hallo,\n\nhier ist dein Link zum Anmelden beim Mondkalender & Ritual-Planer:\n\n" + link +
    "\n\nDer Link gilt 15 Minuten und funktioniert nur einmal. Wenn du ihn nicht angefordert hast, kannst du diese E-Mail einfach ignorieren.";
  const html =
    '<div style="font-family:Arial,sans-serif;color:#2a2140;max-width:480px">' +
    "<p>Hallo,</p><p>hier ist dein Link zum Anmelden beim Mondkalender &amp; Ritual-Planer:</p>" +
    '<p><a href="' + link + '" style="display:inline-block;background:#6b3fa0;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">Jetzt anmelden</a></p>' +
    '<p style="color:#6f6786;font-size:14px">Der Link gilt 15 Minuten und funktioniert nur einmal. Wenn du ihn nicht angefordert hast, kannst du diese E-Mail einfach ignorieren.</p></div>';
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [email], subject: "Dein Login-Link für den Mondkalender", text, html }),
  });
  if (!res.ok) throw new Error("MAIL_ERROR " + res.status + " " + (await res.text()));
  return {};
}
