// auth.js — Authentication & user management
// Default credentials:
//   admin        / T2024!    (niveau 4)
//   moderateur   / mod2T     (niveau 3)
//   utilisateur  / user2T    (niveau 2)
//   invite       / invite    (niveau 1)

const USERS_KEY   = 'site2t_users';
const SESSION_KEY = 'site2t_session';

const DEFAULT_USERS = [
    { id:'1', username:'admin',       password:'T2024!',  level:4, name:'Administrateur', created:'2025-01-01' },
    { id:'2', username:'moderateur',  password:'mod2T',   level:3, name:'Modérateur',     created:'2025-01-01' },
    { id:'3', username:'utilisateur', password:'user2T',  level:2, name:'Utilisateur',    created:'2025-01-01' },
    { id:'4', username:'invite',      password:'invite',  level:1, name:'Invité',         created:'2025-01-01' },
];

const Auth = {
    init() {
        if (!localStorage.getItem(USERS_KEY)) {
            localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    login(username, password) {
        const users = this.getUsers();
        const u = users.find(u => u.username === username && u.password === password);
        if (!u) return null;
        const session = { id: u.id, username: u.username, name: u.name, level: u.level };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    },

    logout() {
        localStorage.removeItem(SESSION_KEY);
    },

    getSession() {
        const d = localStorage.getItem(SESSION_KEY);
        return d ? JSON.parse(d) : null;
    },

    hasAccess(level) {
        const s = this.getSession();
        return s && s.level >= level;
    },

    addUser({ username, password, name, level }) {
        const users = this.getUsers();
        if (users.find(u => u.username === username.trim())) return { ok: false, msg: 'Identifiant déjà utilisé' };
        if (!username.trim() || !password) return { ok: false, msg: 'Champs requis manquants' };
        users.push({
            id: Date.now().toString(),
            username: username.trim(),
            password,
            name: (name || username).trim(),
            level: parseInt(level),
            created: new Date().toISOString().split('T')[0],
        });
        this.saveUsers(users);
        return { ok: true };
    },

    deleteUser(id) {
        this.saveUsers(this.getUsers().filter(u => u.id !== id));
    },

    updateUser(id, changes) {
        const users = this.getUsers();
        const i = users.findIndex(u => u.id === id);
        if (i === -1) return false;
        users[i] = { ...users[i], ...changes };
        this.saveUsers(users);
        return true;
    },

    resetToDefault() {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    },
};
