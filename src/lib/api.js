const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshToken() {
  const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
  if (!refresh) throw new Error("No hay refresh token");

  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Refresh expirado");

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  document.cookie = `access_token=${data.access}; path=/; max-age=${60 * 30}`;
  return data.access;
}

async function request(endpoint, options = {}) {
  let url = `${BASE_URL}${endpoint}`;

  if (options.params) {
    const queryString = new URLSearchParams(options.params).toString();
    url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    delete options.params;
  }

  // _isRetry y skipRedirect no deben llegar al fetch
  const { _isRetry, skipRedirect, ...fetchOptions } = options;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(url, config);

  // Si el access expiró y no es una petición de login/refresh, intenta renovar
  if (res.status === 401 && !_isRetry && !skipRedirect) {
    try {
      const newToken = await refreshToken();
      config.headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, config);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        document.cookie = "access_token=; path=/; max-age=0";
        window.location.href = "/login";
      }
      throw new Error("Sesión expirada");
    }
  }

  if (res.status === 401) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Credenciales incorrectas");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message = error.detail || Object.values(error).flat()[0] || `Error ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get:    (endpoint, opts) => request(endpoint, { method: "GET", ...opts }),
  post:   (endpoint, body, opts) => request(endpoint, { method: "POST", body: JSON.stringify(body), ...opts }),
  put:    (endpoint, body, opts) => request(endpoint, { method: "PUT", body: JSON.stringify(body), ...opts }),
  patch:  (endpoint, body, opts) => request(endpoint, { method: "PATCH", body: JSON.stringify(body), ...opts }),
  delete: (endpoint, opts) => request(endpoint, { method: "DELETE", ...opts }),

  login: async (username, password) => {
    const data = await request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipRedirect: true, // evita el flujo de refresh en caso de 401
    });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    document.cookie = `access_token=${data.access}; path=/; max-age=${60 * 30}`;
    return data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "access_token=; path=/; max-age=0";
    window.location.href = "/login";
  },
};