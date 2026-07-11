/**
 * Edge-runtime compatible JWT verification (HS256).
 *
 * Next.js middleware runs on the edge runtime, where `jsonwebtoken` (Node
 * crypto) is unavailable. This uses the Web Crypto API (SubtleCrypto), which is
 * available on the edge, to verify the signature and expiry of an access token.
 */

interface EdgeTokenPayload {
  id: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

function base64UrlToUint8Array(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const base64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlDecodeToString(input: string): string {
  const bytes = base64UrlToUint8Array(input);
  return new TextDecoder().decode(bytes);
}

/**
 * Verifies an HS256 JWT against the given secret. Returns the decoded payload
 * when the signature is valid and the token has not expired; otherwise null.
 */
export async function verifyJwtEdge(
  token: string,
  secret: string
): Promise<EdgeTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    const header = JSON.parse(base64UrlDecodeToString(headerB64));
    if (header.alg !== 'HS256') return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToUint8Array(signatureB64) as BufferSource,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`) as BufferSource
    );
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecodeToString(payloadB64)) as EdgeTokenPayload;

    // Reject expired tokens.
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}
