/**
 * ApiClient.js
 * All REST calls to the Spring Boot backend.
 */
const ApiClient = (() => {

    const BASE = '/api';

    async function get(endpoint) {
        const res = await fetch(BASE + endpoint);
        if (!res.ok) throw new Error(`API error: ${res.status} on ${endpoint}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        return json.data;
    }

    async function post(endpoint, body) {
        const res = await fetch(BASE + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
        return json;
    }

    return {
        getProjects:    () => get('/projects'),
        getProject:     (id) => get(`/projects/${id}`),
        getSkills:      () => get('/skills'),
        getTrophies:    () => get('/trophies'),
        getPlayerStats: () => get('/player-stats'),
        submitContact:  (data) => post('/contact', data),
    };
})();
