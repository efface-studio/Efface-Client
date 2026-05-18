import crypto from "node:crypto";

// SOLAPI (formerly CoolSMS) message send wrapper.
//
// Auth: HMAC-SHA256 over `date + salt` with the API secret, sent as
// the `Authorization` header alongside the API key. The date is an ISO
// timestamp; the salt is a random 32-char nonce.
//
// Docs: https://developers.solapi.com/references/authentication

const SOLAPI_ENDPOINT = "https://api.solapi.com/messages/v4/send";

export type SendSmsArgs = {
  to: string;       // canonical "01012345678"
  text: string;     // <= 90 bytes for SMS, longer auto-promoted to LMS by SOLAPI
};

export type SendSmsResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

function buildAuthHeader(apiKey: string, apiSecret: string): string {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${date}${salt}`)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export async function sendSms(args: SendSmsArgs): Promise<SendSmsResult> {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_SENDER_PHONE;
  if (!apiKey || !apiSecret || !from) {
    return { ok: false, error: "solapi_env_missing" };
  }

  const body = {
    message: {
      to: args.to,
      from: from.replace(/[^\d]/g, ""),
      text: args.text,
    },
  };

  try {
    const res = await fetch(SOLAPI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: buildAuthHeader(apiKey, apiSecret),
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as
      | { messageId?: string; errorCode?: string; errorMessage?: string }
      | null;
    if (!res.ok || !json?.messageId) {
      return {
        ok: false,
        error: json?.errorCode || json?.errorMessage || `http_${res.status}`,
      };
    }
    return { ok: true, messageId: json.messageId };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.name : "fetch_failed" };
  }
}
