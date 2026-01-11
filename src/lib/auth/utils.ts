import { decodeJwt } from "jose";

/**
 * Checks if a JWT token is expired.
 * @param token The JWT token string.
 * @returns True if the token is expired or invalid, false otherwise.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return true; // No token, considered expired/invalid
  }

  // Try to decode as JWT
  try {
    const decodedJwt = decodeJwt(token);
    const expirationTime = decodedJwt.exp;

    if (typeof expirationTime === "undefined") {
      // No expiration claim, treat as invalid or handle as per your app's policy
      console.warn("JWT token does not have an expiration (exp) claim.");
      return true;
    }

    const nowInSeconds = Date.now() / 1000;
    return expirationTime <= nowInSeconds;
  } catch (error) {
    // Not a valid JWT, treat as expired/invalid
    return true;
  }
}

/**
 * Extracts the public key (subject) from a JWT token.
 * @param token The JWT token string.
 * @returns The public key/wallet address string if available, otherwise null.
 */
export function getPublicKeyFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  // Try to decode as JWT
  try {
    const decodedJwt = decodeJwt(token);
    return decodedJwt.sub ?? null;
  } catch (error) {
    // Not a valid JWT, return null
    return null;
  }
} 
