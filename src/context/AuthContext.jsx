import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/** Decode a JWT payload without a library (JWTs are just Base64-encoded JSON). */
function decodeToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

/** Returns true if the token is expired or un-decodable. */
function isTokenExpired(token) {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUser = localStorage.getItem('luzo_user');

        if (storedToken && storedRole) {
            // If access token is expired but a refresh token exists,
            // the Axios interceptor in api.js will handle refreshing it transparently.
            // Just restore the session optimistically — expired access tokens are fine
            // as long as the refresh token is still valid (90 days).
            if (isTokenExpired(storedToken) && !localStorage.getItem('refreshToken')) {
                // No refresh token either — wipe everything
                localStorage.clear();
            } else {
                try {
                    setToken(storedToken);
                    const userData = storedUser ? JSON.parse(storedUser) : { role: storedRole };
                    setUser(userData);
                } catch {
                    localStorage.clear();
                }
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((tokenValue, refreshTokenValue, userData) => {
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('refreshToken', refreshTokenValue);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('luzo_user', JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('luzo_user');
        setToken(null);
        setUser(null);
    }, []);

    // Called by api.js interceptor when a token has been silently refreshed
    const updateTokens = useCallback((newToken, newRefreshToken) => {
        localStorage.setItem('token', newToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
        setToken(newToken);
    }, []);

    const isAuthenticated = Boolean(token && user);

    const hasRole = useCallback(
        (role) => user?.role === role,
        [user]
    );

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, updateTokens, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
