const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint, options = {}) {
    let url = `${BASE_URL}${endpoint}`;
    
    if (options.params) {
        const queryString = new URLSearchParams(options.params).toString();
        url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
        delete options.params; 
    }

    const config = {
        headers: {
        "Content-Type": "application/json",
        ...options.headers,
        },
        ...options,
    };

    // Si usas JWT, adjunta el token automáticamente
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, config);

    if (res.status === 401) {
        if (!options.skipRedirect && typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }
        const error = await res.json().catch(() => ({}));
        const message = error.detail || "Sesión expirada";
        throw new Error(message);
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const message = error.detail
            || Object.values(error).flat()[0]
            || `Error ${res.status}`;
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
            skipRedirect: true, 
        });
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        document.cookie = `access_token=${data.access}; path=/; max-age=${60 * 30}`; // 30 min
        return data;
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        document.cookie = "access_token=; path=/; max-age=0";
        window.location.href = "/login";
    },
};