export const AUTH_TOKEN_KEY = "token";
export const LEGACY_AUTH_TOKEN_KEY = "medichain_token";
export const AUTH_USER_KEY = "medichain_user";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function decodeBase64UrlSegment(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4 || 4)) % 4),
    "="
  );

  return atob(padded);
}

export function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  const payloadSegment = token.split(".")[1];

  if (!payloadSegment) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64UrlSegment(payloadSegment));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

export function decorateUserWithTokenClaims(user, token) {
  const tokenPayload = decodeJwtPayload(token);

  if (!user && !tokenPayload) {
    return null;
  }

  return {
    ...(user ?? {}),
    id: user?.id ?? tokenPayload?.id ?? null,
    uid: user?.uid ?? tokenPayload?.uid ?? null,
    role: user?.role ?? tokenPayload?.role ?? null,
  };
}

export function getStoredToken() {
  if (!hasStorage()) {
    return null;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    return token;
  }

  // Migrate older sessions forward without breaking refresh persistence.
  const legacyToken = localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);

  if (legacyToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, legacyToken);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
    return legacyToken;
  }

  return null;
}

export function getStoredUser() {
  if (!hasStorage()) {
    return null;
  }

  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function getStoredSession() {
  const token = getStoredToken();

  if (!token || isTokenExpired(token)) {
    clearAuthSession();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  return {
    user: decorateUserWithTokenClaims(getStoredUser(), token),
    token,
    isAuthenticated: true,
  };
}

export function persistAuthSession({ token, user }) {
  if (!hasStorage()) {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(decorateUserWithTokenClaims(user, token))
    );
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function clearAuthSession() {
  if (!hasStorage()) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
