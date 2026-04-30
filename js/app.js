// app.js — Main app: init, router, canvas, toasts, admin actions

const App = {

    // ── Init ──────────────────────────────────────────────────────────────────

    init() {
        Auth.init();
        this._initCanvas();

        // Eye toggle
        document.getElementById('eye-btn').addEventListener('click', () => {
            const inp  = document.getElementById('password');
            const icon = document.getElementById('eye-icon');
            const show = inp.type === 'password';
            inp.type   = show ? 'text' : 'password';
            icon.innerHTML = show
                ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
                : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', e => {
            e.preventDefault();
            this._handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Mobile menu
        document.getElementById('menu-toggle').addEventListener('click', () => this._toggleSidebar());

        // Hash navigation
        window.addEventListener('hashchange', () => this._routeHash());

        // Close sidebar on sidebar nav click
        document.querySelectorAll('.sidebar-link').forEach(a => {
            a.addEventListener('click', () => this.closeSidebar());
        });

        // Restore session
        const user = Auth.getSession();
        if (user) {
            this._showApp(user);
        }
    },

    // ── Login ─────────────────────────────────────────────────────────────────

    _handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const btn      = document.getElementById('login-btn');
        const errEl    = document.getElementById('login-error');
        const arrow    = document.getElementById('login-arrow');
        const spinner  = document.getElementById('login-spinner');

        btn.classList.add('loading');
        arrow.classList.add('hidden');
        spinner.classList.remove('hidden');
        errEl.classList.add('hidden');

        setTimeout(() => {
            const user = Auth.login(username, password);
            btn.classList.remove('loading');
            arrow.classList.remove('hidden');
            spinner.classList.add('hidden');

            if (user) {
                this._showApp(user);
            } else {
                errEl.textContent = 'Identifiant ou mot de passe incorrect.';
                errEl.classList.remove('hidden');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        }, 380);
    },

    _showApp(user) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');

        // Update header user chip
        const badge = document.getElementById('user-level-badge');
        badge.textContent = `N${user.level}`;
        badge.className   = `level-badge level-${user.level}`;
        document.getElementById('user-name-display').textContent = user.name;

        // Update sidebar
        document.getElementById('sidebar-badge').textContent = `N${user.level}`;
        document.getElementById('sidebar-badge').className   = `level-badge level-${user.level}`;
        document.getElementById('sidebar-name').textContent  = user.name;

        // Lock nav links by level
        document.querySelectorAll('[data-level]').forEach(el => {
            const req = parseInt(el.getAttribute('data-level'));
            el.classList.toggle('locked', user.level < req);
        });

        this._routeHash();
    },

    // ── Router ────────────────────────────────────────────────────────────────

    _routeHash() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        const [section, tab] = hash.split('/');
        this._render(section, tab);
    },

    navigate(section, tab = null) {
        const hash = tab ? `#${section}/${tab}` : `#${section}`;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        } else {
            this._render(section, tab);
        }
    },

    _render(section, tab) {
        if (!Auth.getSession()) return;

        const container = document.getElementById('view-container');
        if (!container) return;

        // Fade out
        container.style.opacity   = '0';
        container.style.transform = 'translateY(8px)';

        let html = '';
        switch (section) {
            case 'diplomes': html = Sections.diplomes(tab); break;
            case 'projets':  html = Sections.projets(tab);  break;
            case 'stockage': html = Sections.stockage(tab); break;
            case 'test':     html = Sections.test();        break;
            default:         html = Sections.dashboard();   break;
        }

        container.innerHTML = html;

        // Fade in
        requestAnimationFrame(() => {
            container.style.transition = 'opacity .25s ease, transform .25s ease';
            container.style.opacity    = '1';
            container.style.transform  = 'translateY(0)';
        });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ── Logout ────────────────────────────────────────────────────────────────

    logout() {
        Auth.logout();
        window.location.hash = '';
        document.getElementById('app').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('login-form').reset();
        document.getElementById('login-error').classList.add('hidden');
        this.closeSidebar();
        this.toast('Déconnecté avec succès', 'info');
    },

    // ── Sidebar ───────────────────────────────────────────────────────────────

    _toggleSidebar() {
        const sb  = document.getElementById('sidebar');
        const ov  = document.getElementById('sidebar-overlay');
        const open = sb.classList.contains('hidden');
        sb.classList.toggle('hidden',  !open);
        ov.classList.toggle('hidden',  !open);
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    },

    // ── Admin actions ─────────────────────────────────────────────────────────

    addUser() {
        const username = document.getElementById('nu-user').value.trim();
        const name     = document.getElementById('nu-name').value.trim();
        const password = document.getElementById('nu-pass').value;
        const level    = document.getElementById('nu-level').value;

        const res = Auth.addUser({ username, name, password, level });
        if (res.ok) {
            this.toast(`Utilisateur "${username}" créé`, 'success');
            this.navigate('test');
        } else {
            this.toast(res.msg, 'error');
        }
    },

    deleteUser(id, username) {
        if (!confirm(`Supprimer l'utilisateur "${username}" ? Cette action est irréversible.`)) return;
        Auth.deleteUser(id);
        this.toast(`Utilisateur "${username}" supprimé`, 'success');
        this.navigate('test');
    },

    exportData() {
        const payload = {
            version: '1.0',
            exported: new Date().toISOString(),
            users: Auth.getUsers(),
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `site2t-${Date.now()}.json` });
        a.click();
        URL.revokeObjectURL(url);
        this.toast('Export téléchargé', 'success');
    },

    importData() {
        document.getElementById('import-file').click();
    },

    handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                if (Array.isArray(data.users)) {
                    Auth.saveUsers(data.users);
                    this.toast(`${data.users.length} utilisateurs importés`, 'success');
                    this.navigate('test');
                } else {
                    this.toast('Format invalide — clé "users" manquante', 'error');
                }
            } catch {
                this.toast('Impossible de lire le fichier JSON', 'error');
            }
        };
        reader.readAsText(file);
    },

    resetUsers() {
        if (!confirm('Réinitialiser tous les utilisateurs aux valeurs par défaut ?')) return;
        Auth.resetToDefault();
        this.toast('Utilisateurs réinitialisés', 'success');
        this.navigate('test');
    },

    // ── Toast ─────────────────────────────────────────────────────────────────

    toast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const el = document.createElement('div');
        el.className   = `toast toast-${type}`;
        el.textContent = msg;
        container.appendChild(el);

        setTimeout(() => {
            el.style.opacity   = '0';
            el.style.transform = 'translateX(16px)';
            setTimeout(() => el.remove(), 320);
        }, 3200);
    },

    // ── Canvas background ─────────────────────────────────────────────────────

    _initCanvas() {
        const canvas = document.getElementById('bg-canvas');
        const ctx    = canvas.getContext('2d');
        let   pts    = [];

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const COLORS = [
            [245, 158, 11],   // gold
            [139, 92,  246],  // purple
            [59,  130, 246],  // blue
        ];

        class Pt {
            constructor() { this.reset(true); }
            reset(full = false) {
                this.x  = Math.random() * canvas.width;
                this.y  = full ? Math.random() * canvas.height : (Math.random() > .5 ? -4 : canvas.height + 4);
                this.vx = (Math.random() - .5) * .28;
                this.vy = (Math.random() - .5) * .28;
                this.r  = Math.random() * 1.4 + .3;
                this.a  = Math.random() * .35 + .08;
                this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
            move() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -10 || this.x > canvas.width  + 10 ||
                    this.y < -10 || this.y > canvas.height + 10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.a})`;
                ctx.fill();
            }
        }

        const COUNT = Math.min(100, Math.floor(window.innerWidth / 14));

        resize();
        pts = Array.from({ length: COUNT }, () => new Pt());

        const drawLines = () => {
            const MAX_DIST = 130;
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_DIST) {
                        const alpha = .045 * (1 - d / MAX_DIST);
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
                        ctx.lineWidth   = .6;
                        ctx.stroke();
                    }
                }
            }
        };

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach(p => { p.move(); p.draw(); });
            drawLines();
            requestAnimationFrame(loop);
        };

        window.addEventListener('resize', () => {
            resize();
            pts.forEach(p => p.reset(true));
        });

        loop();
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
