const TOKEN_KEY = "financeTracker_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function base64UrlDecode(value) {
  const withReplacements = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = withReplacements.length % 4;
  const padded =
    padLength === 0 ? withReplacements : withReplacements + "=".repeat(4 - padLength);
  return atob(padded);
}

export function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadStr = base64UrlDecode(parts[1]);
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

