// OAuth 2.0 PKCE (Proof Key for Code Exchange) utilities.
// Spotify's Authorization Code with PKCE flow requires:
//   1. A cryptographically random `code_verifier`
//   2. A `code_challenge` = base64url(sha256(code_verifier))
//   3. The verifier is exchanged for tokens later — it never leaves the client
//      as anything but its hashed challenge during the authorize step.

const VERIFIER_LENGTH = 64;

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generates a high-entropy random string suitable as a PKCE code_verifier.
 * Spec (RFC 7636) requires 43-128 chars from [A-Z a-z 0-9 - . _ ~].
 */
export function generateCodeVerifier(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const bytes = randomBytes(VERIFIER_LENGTH);
  let result = '';
  for (const byte of bytes) result += charset[byte % charset.length];
  return result;
}

/** Derives the S256 code_challenge from a code_verifier per RFC 7636. */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

/** Generates an unguessable `state` value to defend against CSRF on the redirect. */
export function generateState(): string {
  return base64UrlEncode(randomBytes(16));
}
