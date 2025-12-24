import { Resend } from "resend";

let resendInstance: Resend | null = null;

/**
 * Singleton getter for the Resend client.
 * Ensures we only initialize the SDK once.
 */
export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn(
        "[EmailService] Warning: RESEND_API_KEY not found in .env. Emailing will be disabled."
      );
      // We don't throw here to prevent the entire app from crashing,
      // but the actual send calls will handle the missing client.
      throw new Error("RESEND_API_KEY not configured");
    }

    resendInstance = new Resend(apiKey);
    console.log("[EmailService] Resend client initialized successfully.");
  }

  return resendInstance;
}
