/**
 * MarketMind — Centralized API client.
 * Attaches JWT auth header automatically to all requests.
 */

// Always call backend directly at localhost:8000
const BASE_URL = 'http://127.0.0.1:8000';


function getToken() {
    return localStorage.getItem('mm_token');
}

async function request(path, options = {}, retries = 3) {
    console.log(`[API] 📡 Fetching ${path}...`);
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
            console.log(`[API] ✅ Resolved ${path} with status ${res.status}`);

            if (res.status === 429 && i < retries - 1) {
                const delay = 2000 * (i + 1);
                console.warn(`[API] ⚠️ Rate limited (429). Retrying in ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: res.statusText }));
                throw new Error(JSON.stringify(errorData));
            }
            return res.json();
        } catch (err) {
            if (i === retries - 1) {
                console.error(`[API] ❌ Failed ${path} after ${retries} attempts:`, err);
                throw err;
            }
            // If it's a network error, we might want to retry too
            console.warn(`[API] ⚠️ Attempt ${i + 1} failed. Retrying...`, err);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

function get(path) { return request(path, { method: 'GET' }); }
function post(path, body) { return request(path, { method: 'POST', body: JSON.stringify(body) }); }

async function postForm(path, formData) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || 'Upload failed');
    return res.json();
}

/** SSE streaming — calls onToken(token) for each streamed token, onDone() when complete. */
async function streamPost(path, body, onToken, onDone) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = JSON.parse(line.slice(6));
            if (data.done) { onDone(); return; }
            onToken(data.token);
        }
    }
    onDone();
}

const api = {
    // Auth
    register: (data) => post('/auth/register', data),
    login: (data) => post('/auth/login', data),
    getProfile: () => get('/auth/me'),

    // Module 1 — Campaigns
    generateCampaign: (data) => post('/campaigns/generate', data),
    streamCampaign: (data, onToken, onDone) => streamPost('/campaigns/stream', data, onToken, onDone),

    // Module 2 — Instagram
    generateInstagram: (data) => post('/instagram/generate', data),
    generateInstagramPost: (data) => post('/instagram/generate', { ...data, mode: 'post' }),
    getPipelineSteps: () => get('/instagram/pipeline-steps'),

    // Module 3 — Pitch
    generateColdEmail: (data) => post('/pitch/cold-email', data),
    generatePitch: (data) => post('/pitch/sales-pitch', data),
    generateProposal: (data) => post('/pitch/proposal', data),

    // Module 4 — Competitor
    analyseCompetitor: (data) => post('/competitor/analyse', data),
    analyseCompetitors: (data) => post('/competitor/analyse', data),
    getWeeklyDigest: () => get('/competitor/weekly-digest'),

    // Module 5 — Leads
    scoreLead: (data) => post('/leads/score', data),
    scoreLeads: (data) => post('/leads/score', data),
    scoreBatch: (formData) => postForm('/leads/score-batch', formData),
    generateBulkOutreach: (data) => post('/leads/outreach', data),

    // Module 6 — Simulator
    getPersonas: () => get('/simulator/personas'),
    sendMessage: (data) => post('/simulator/message', data).then(res => ({ ...res, content: res.persona_response })),
    practiceSale: (data) => post('/simulator/message', { persona: data.persona, rep_message: data.rep_message, history: data.history || [], model: data.model }).then(res => ({ ...res, content: res.persona_response })),
    getDebrief: (data) => post('/simulator/debrief', data),

    // Module 7 — Intelligence
    getWeeklyBrief: (data) => post('/intelligence/weekly-brief', data),
    getDashboardStats: () => get('/intelligence/dashboard-stats'),
    getOpportunityAlerts: () => get('/intelligence/opportunity-alerts'),

    // Module 8 — Products
    getProducts: () => get('/products/'),
    createProduct: (data) => post('/products/', data),
    deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

    // Outcome Memory
    logOutcome: (data) => post('/memory/log', data),
    getMemoryRules: () => get('/memory/rules'),
    getMemoryStatus: () => get('/memory/status'),
};

export default api;
