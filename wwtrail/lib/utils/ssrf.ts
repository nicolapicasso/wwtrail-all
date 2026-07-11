import dns from 'dns/promises';
import net from 'net';

/**
 * SSRF protection helper.
 *
 * Validates that a user-supplied URL is safe to fetch server-side:
 *  - only http/https protocols
 *  - hostname does not resolve to a private, loopback, link-local or
 *    otherwise reserved IP range (blocks cloud metadata endpoints too)
 *
 * Throws an Error with a safe message when the URL must be rejected.
 * Call this before passing any externally-supplied URL to axios/fetch.
 */

function isBlockedIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts;

  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8 private
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local (cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a >= 224) return true; // multicast + reserved
  return false;
}

function isBlockedIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1') return true; // loopback
  if (lower === '::') return true; // unspecified
  if (lower.startsWith('fe80')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  // IPv4-mapped IPv6 (::ffff:a.b.c.d)
  const mapped = lower.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedIPv4(mapped[1]);
  return false;
}

function isBlockedIP(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) return isBlockedIPv4(ip);
  if (version === 6) return isBlockedIPv6(ip);
  return true; // not a valid IP -> reject to be safe
}

/**
 * Validates a URL against SSRF attacks. Resolves the hostname and ensures no
 * resolved address points to an internal/reserved range. Throws on rejection.
 */
export async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, ''); // strip IPv6 brackets

  // Block obvious hostnames outright.
  const lowerHost = hostname.toLowerCase();
  if (lowerHost === 'localhost' || lowerHost.endsWith('.localhost')) {
    throw new Error('URL host is not allowed');
  }

  // If the host is a literal IP, check it directly.
  if (net.isIP(hostname)) {
    if (isBlockedIP(hostname)) throw new Error('URL host is not allowed');
    return parsed;
  }

  // Otherwise resolve DNS and check every returned address.
  let addresses: dns.LookupAddress[];
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error('Could not resolve URL host');
  }

  if (addresses.length === 0) {
    throw new Error('Could not resolve URL host');
  }

  for (const { address } of addresses) {
    if (isBlockedIP(address)) {
      throw new Error('URL host is not allowed');
    }
  }

  return parsed;
}
