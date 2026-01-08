export const parseJwt = (token: string) => {
    try {
        const segments = token.split('.');
        if (segments.length !== 3) return null;
        const base64Url = segments[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;

    // Current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
};
