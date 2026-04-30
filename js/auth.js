// auth.js — Authentification, inscription, demandes de niveau, sujets, paramètres
// Identifiants par défaut :
//   admin       / T2024!   (niveau 4)
//   moderateur  / mod2T    (niveau 3)
//   utilisateur / user2T   (niveau 2)
//   invite      / invite   (niveau 1)

const USERS_KEY    = 'site2t_users';
const SESSION_KEY  = 'site2t_session';
const REQUESTS_KEY = 'site2t_requests';
const TOPICS_KEY   = 'site2t_topics';
const SETTINGS_KEY = 'site2t_settings';

const DEFAULT_USERS = [
    { id:'1', username:'admin',       password:'T2024!', level:4, name:'Administrateur', created:'2025-01-01' },
    { id:'2', username:'moderateur',  password:'mod2T',  level:3, name:'Modérateur',     created:'2025-01-01' },
    { id:'3', username:'utilisateur', password:'user2T', level:2, name:'Utilisateur',    created:'2025-01-01' },
    { id:'4', username:'invite',      password:'invite', level:1, name:'Invité',         created:'2025-01-01' },
];

const DEFAULT_SETTINGS = {
    allowRegistrations: true,
    maintenanceMode:    false,
    welcomeMessage:     'Bienvenue sur Site2T !',
    siteName:           'Site2T',
};

const Auth = {
    init() {
        if (!localStorage.getItem(USERS_KEY))    localStorage.setItem(USERS_KEY,    JSON.stringify(DEFAULT_USERS));
        if (!localStorage.getItem(SETTINGS_KEY)) localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    },

    // ── Utilisateurs ────────────────────────────────
    getUsers()   { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); },
    saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); },

    login(username, password) {
        const u = this.getUsers().find(u => u.username === username && u.password === password);
        if (!u) return null;
        const s = { id:u.id, username:u.username, name:u.name, level:u.level, isGuest:false };
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        return s;
    },

    loginAsGuest() {
        const s = { id:'__guest__', username:'__guest__', name:'Invité', level:1, isGuest:true };
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        return s;
    },

    logout() { localStorage.removeItem(SESSION_KEY); },

    getSession() {
        const d = localStorage.getItem(SESSION_KEY);
        return d ? JSON.parse(d) : null;
    },

    hasAccess(level) {
        const s = this.getSession();
        return s && s.level >= level;
    },

    isGuest() { const s = this.getSession(); return !!(s?.isGuest); },

    register({ username, name, password }) {
        const settings = this.getSettings();
        if (!settings.allowRegistrations) return { ok:false, msg:'Les inscriptions sont désactivées.' };
        if (!username?.trim() || !password)  return { ok:false, msg:'Champs requis manquants.' };
        if (password.length < 6)             return { ok:false, msg:'Mot de passe trop court (6 caractères min).' };
        const users = this.getUsers();
        if (users.find(u => u.username === username.trim())) return { ok:false, msg:'Identifiant déjà utilisé.' };
        const u = {
            id:      Date.now().toString(),
            username:username.trim(),
            password,
            name:    (name || username).trim(),
            level:   1,
            created: new Date().toISOString().split('T')[0],
        };
        users.push(u);
        this.saveUsers(users);
        const session = { id:u.id, username:u.username, name:u.name, level:1, isGuest:false };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { ok:true, session };
    },

    addUser({ username, password, name, level }) {
        const users = this.getUsers();
        if (users.find(u => u.username === username?.trim())) return { ok:false, msg:'Identifiant déjà utilisé.' };
        if (!username?.trim() || !password) return { ok:false, msg:'Champs requis manquants.' };
        users.push({
            id:      Date.now().toString(),
            username:username.trim(),
            password,
            name:    (name || username).trim(),
            level:   parseInt(level),
            created: new Date().toISOString().split('T')[0],
        });
        this.saveUsers(users);
        return { ok:true };
    },

    deleteUser(id) { this.saveUsers(this.getUsers().filter(u => u.id !== id)); },

    updateUser(id, changes) {
        const users = this.getUsers();
        const i = users.findIndex(u => u.id === id);
        if (i === -1) return false;
        users[i] = { ...users[i], ...changes };
        this.saveUsers(users);
        const session = this.getSession();
        if (session?.id === id) {
            localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...changes }));
        }
        return true;
    },

    resetToDefault() { localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS)); },

    // ── Demandes de niveau ──────────────────────────
    getRequests()   { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); },
    saveRequests(r) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)); },

    addRequest({ userId, username, name, fromLevel, toLevel, message }) {
        const reqs = this.getRequests();
        if (reqs.find(r => r.userId === userId && r.status === 'pending')) {
            return { ok:false, msg:'Vous avez déjà une demande en cours d\'examen.' };
        }
        reqs.push({
            id:        Date.now().toString(),
            userId, username, name, fromLevel,
            toLevel:   parseInt(toLevel),
            message:   message || '',
            date:      new Date().toISOString(),
            status:    'pending',
        });
        this.saveRequests(reqs);
        return { ok:true };
    },

    approveRequest(id) {
        const reqs = this.getRequests();
        const req  = reqs.find(r => r.id === id);
        if (!req) return;
        req.status = 'approved';
        this.saveRequests(reqs);
        this.updateUser(req.userId, { level: req.toLevel });
    },

    denyRequest(id, reason = '') {
        const reqs = this.getRequests();
        const req  = reqs.find(r => r.id === id);
        if (!req) return;
        req.status = 'denied';
        req.reason = reason;
        this.saveRequests(reqs);
    },

    hasPendingRequest(userId) {
        return this.getRequests().some(r => r.userId === userId && r.status === 'pending');
    },

    pendingCount() {
        return this.getRequests().filter(r => r.status === 'pending').length;
    },

    getUserLastRequest(userId) {
        return [...this.getRequests()]
            .filter(r => r.userId === userId)
            .sort((a,b) => new Date(b.date) - new Date(a.date))[0] || null;
    },

    // ── Sujets ──────────────────────────────────────
    getTopics()   { return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]'); },
    saveTopics(t) { localStorage.setItem(TOPICS_KEY, JSON.stringify(t)); },

    addTopic({ title, content, category, minLevel, pinned }) {
        if (!title?.trim() || !content?.trim()) return { ok:false, msg:'Titre et contenu requis.' };
        const topics = this.getTopics();
        topics.unshift({
            id:       Date.now().toString(),
            title:    title.trim(),
            content:  content.trim(),
            category: category || 'Général',
            minLevel: parseInt(minLevel) || 1,
            pinned:   !!pinned,
            date:     new Date().toISOString(),
            author:   this.getSession()?.name || 'Admin',
        });
        this.saveTopics(topics);
        return { ok:true };
    },

    deleteTopic(id) { this.saveTopics(this.getTopics().filter(t => t.id !== id)); },

    toggleTopicPin(id) {
        const topics = this.getTopics();
        const i = topics.findIndex(t => t.id === id);
        if (i !== -1) { topics[i].pinned = !topics[i].pinned; this.saveTopics(topics); }
    },

    // ── Paramètres ──────────────────────────────────
    getSettings() {
        const d = localStorage.getItem(SETTINGS_KEY);
        return { ...DEFAULT_SETTINGS, ...(d ? JSON.parse(d) : {}) };
    },

    saveSettings(s) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...this.getSettings(), ...s }));
    },
};
