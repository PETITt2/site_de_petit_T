// app.js — Router, canvas, 3D tilt, toasts, all action handlers

const App = {

    // ── Init ──────────────────────────────────────────────────────────────────

    init() {
        Auth.init();
        this._initCanvas();

        // Password eye toggle
        document.getElementById('eye-btn').addEventListener('click', () => {
            const inp  = document.getElementById('password');
            const icon = document.getElementById('eye-icon');
            const show = inp.type === 'password';
            inp.type   = show ? 'text' : 'password';
            icon.innerHTML = show
                ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
                : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
        });

        // Form tab toggles
        document.getElementById('tab-login').addEventListener('click', () => this._showLoginForm());
        document.getElementById('tab-register').addEventListener('click', () => this._showRegisterForm());

        // Login form
        document.getElementById('login-form').addEventListener('submit', e => { e.preventDefault(); this._handleLogin(); });

        // Register form
        document.getElementById('register-form').addEventListener('submit', e => { e.preventDefault(); this._handleRegister(); });

        // Guest button
        document.getElementById('guest-btn').addEventListener('click', () => this._loginAsGuest());

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
        if (user) this._showApp(user);
    },

    // ── Form toggles ──────────────────────────────────────────────────────────

    _showLoginForm() {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
    },

    _showRegisterForm() {
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
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
        }, 350);
    },

    _handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const name     = document.getElementById('reg-name').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm  = document.getElementById('reg-confirm').value;
        const errEl    = document.getElementById('register-error');

        errEl.classList.add('hidden');

        if (password !== confirm) {
            errEl.textContent = 'Les mots de passe ne correspondent pas.';
            errEl.classList.remove('hidden');
            return;
        }

        const res = Auth.register({ username, name, password });
        if (res.ok) {
            this.toast(`Compte créé ! Bienvenue, ${res.session.name} 🎉`, 'success');
            this._showApp(res.session);
        } else {
            errEl.textContent = res.msg;
            errEl.classList.remove('hidden');
        }
    },

    _loginAsGuest() {
        const user = Auth.loginAsGuest();
        this.toast('Connexion en tant qu\'invité (N1)', 'info');
        this._showApp(user);
    },

    // ── Show App ──────────────────────────────────────────────────────────────

    _showApp(user) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');

        // Header user chip
        const badge = document.getElementById('user-level-badge');
        badge.textContent = `N${user.level}`;
        badge.className   = `level-badge level-${user.level}`;
        document.getElementById('user-name-display').textContent = user.name;

        // Sidebar
        document.getElementById('sidebar-badge').textContent = `N${user.level}`;
        document.getElementById('sidebar-badge').className   = `level-badge level-${user.level}`;
        document.getElementById('sidebar-name').textContent  = user.name;

        // Upgrade button (only for logged-in non-admin users, not guests)
        const upgBtn    = document.getElementById('upgrade-btn');
        const sideUpg   = document.getElementById('sidebar-upgrade');
        const showUpg   = !user.isGuest && user.level < 4;
        upgBtn.classList.toggle('hidden', !showUpg);
        sideUpg.classList.toggle('hidden', !showUpg);

        // Lock nav links
        document.querySelectorAll('[data-level]').forEach(el => {
            const req = parseInt(el.getAttribute('data-level'));
            el.classList.toggle('locked', user.level < req);
        });

        // Admin notification badge
        this._updateAdminBadge();

        // Maintenance banner for non-admin
        const settings = Auth.getSettings();
        const banner   = document.getElementById('maintenance-banner');
        if (settings.maintenanceMode && user.level < 4) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }

        this._routeHash();
    },

    _updateAdminBadge() {
        const n    = Auth.pendingCount();
        const el   = document.getElementById('admin-notif');
        if (el) {
            el.textContent = n;
            el.classList.toggle('hidden', n === 0);
        }
    },

    // ── Router ────────────────────────────────────────────────────────────────

    _routeHash() {
        if (!Auth.getSession()) return;
        const hash = window.location.hash.slice(1) || 'dashboard';
        const [section, tab] = hash.split('/');
        this._render(section, tab);
    },

    navigate(section, tab = null) {
        const hash = tab ? `#${section}/${tab}` : `#${section}`;
        if (window.location.hash !== hash) window.location.hash = hash;
        else this._render(section, tab);
    },

    _render(section, tab) {
        if (!Auth.getSession()) return;
        const container = document.getElementById('view-container');
        if (!container) return;

        container.style.opacity   = '0';
        container.style.transform = 'translateY(8px)';

        let html = '';
        switch (section) {
            case 'diplomes': html = Sections.diplomes(tab); break;
            case 'projets':  html = Sections.projets(tab);  break;
            case 'stockage': html = Sections.stockage(tab); break;
            case 'test':     html = Sections.test(tab);     break;
            default:         html = Sections.dashboard();   break;
        }

        container.innerHTML = html;

        requestAnimationFrame(() => {
            container.style.transition = 'opacity .22s ease, transform .22s ease';
            container.style.opacity    = '1';
            container.style.transform  = 'translateY(0)';
            this.initTilt();
        });

        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.section === section);
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
        document.getElementById('register-form').reset();
        document.getElementById('login-error').classList.add('hidden');
        document.getElementById('register-error').classList.add('hidden');
        this._showLoginForm();
        this.closeSidebar();
        this.toast('Déconnecté', 'info');
    },

    // ── Sidebar ───────────────────────────────────────────────────────────────

    _toggleSidebar() {
        const sb   = document.getElementById('sidebar');
        const ov   = document.getElementById('sidebar-overlay');
        const open = sb.classList.contains('hidden');
        sb.classList.toggle('hidden',  !open);
        ov.classList.toggle('hidden',  !open);
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    },

    // ── Upgrade request modal ─────────────────────────────────────────────────

    showUpgradeModal() {
        const user = Auth.getSession();
        if (!user) return;

        // Filter to only levels above current
        const sel = document.getElementById('upgrade-level');
        if (sel) {
            Array.from(sel.options).forEach(opt => {
                opt.disabled = parseInt(opt.value) <= user.level;
            });
            // Select first available
            const first = Array.from(sel.options).find(o => !o.disabled);
            if (first) sel.value = first.value;
        }

        const errEl = document.getElementById('upgrade-error');
        if (errEl) errEl.classList.add('hidden');

        document.getElementById('upgrade-modal').classList.remove('hidden');
    },

    hideUpgradeModal() {
        document.getElementById('upgrade-modal').classList.add('hidden');
    },

    submitUpgradeRequest() {
        const user    = Auth.getSession();
        const toLevel = document.getElementById('upgrade-level')?.value;
        const message = document.getElementById('upgrade-message')?.value?.trim();
        const errEl   = document.getElementById('upgrade-error');

        const res = Auth.addRequest({
            userId:    user.id,
            username:  user.username,
            name:      user.name,
            fromLevel: user.level,
            toLevel,
            message,
        });

        if (res.ok) {
            this.hideUpgradeModal();
            this.toast('Demande envoyée à l\'administrateur ✉️', 'success');
            this._updateAdminBadge();
            this.navigate('dashboard');
        } else {
            if (errEl) { errEl.textContent = res.msg; errEl.classList.remove('hidden'); }
        }
    },

    // ── Admin: User management ────────────────────────────────────────────────

    addUser() {
        const username = document.getElementById('nu-user')?.value.trim();
        const name     = document.getElementById('nu-name')?.value.trim();
        const password = document.getElementById('nu-pass')?.value;
        const level    = document.getElementById('nu-level')?.value;
        const res = Auth.addUser({ username, name, password, level });
        if (res.ok) {
            this.toast(`Utilisateur "${username}" créé`, 'success');
            this.navigate('test', 'utilisateurs');
        } else {
            this.toast(res.msg, 'error');
        }
    },

    deleteUser(id, username) {
        if (!confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
        Auth.deleteUser(id);
        this.toast(`"${username}" supprimé`, 'success');
        this.navigate('test', 'utilisateurs');
    },

    promoteUser(id, name, currentLevel) {
        if (currentLevel >= 4) { this.toast('Déjà au niveau maximum', 'warn'); return; }
        if (!confirm(`Passer "${name}" au niveau ${currentLevel + 1} ?`)) return;
        Auth.updateUser(id, { level: currentLevel + 1 });
        this.toast(`${name} → N${currentLevel + 1}`, 'success');
        this.navigate('test', 'utilisateurs');
    },

    exportData() {
        const blob = new Blob([JSON.stringify({ version:'2.0', exported: new Date().toISOString(), users: Auth.getUsers() }, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        Object.assign(document.createElement('a'), { href: url, download: `site2t-${Date.now()}.json` }).click();
        URL.revokeObjectURL(url);
        this.toast('Export téléchargé', 'success');
    },

    importData() { document.getElementById('import-file')?.click(); },

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
                    this.navigate('test', 'utilisateurs');
                } else { this.toast('Format invalide', 'error'); }
            } catch { this.toast('Erreur de lecture JSON', 'error'); }
        };
        reader.readAsText(file);
    },

    resetUsers() {
        if (!confirm('Réinitialiser les utilisateurs aux valeurs par défaut ?')) return;
        Auth.resetToDefault();
        this.toast('Réinitialisé', 'success');
        this.navigate('test', 'utilisateurs');
    },

    // ── Admin: Requests ───────────────────────────────────────────────────────

    approveRequest(id, name, toLevel) {
        if (!confirm(`Approuver la demande de ${name} → N${toLevel} ?`)) return;
        Auth.approveRequest(id);
        this._updateAdminBadge();
        this.toast(`${name} promu au niveau N${toLevel} ✓`, 'success');
        this.navigate('test', 'demandes');
    },

    denyRequest(id, name) {
        if (!confirm(`Refuser la demande de ${name} ?`)) return;
        Auth.denyRequest(id);
        this._updateAdminBadge();
        this.toast(`Demande de ${name} refusée`, 'warn');
        this.navigate('test', 'demandes');
    },

    // ── Admin: Topics ─────────────────────────────────────────────────────────

    addTopic() {
        const title   = document.getElementById('tp-title')?.value.trim();
        const content = document.getElementById('tp-content')?.value.trim();
        const cat     = document.getElementById('tp-cat')?.value;
        const level   = document.getElementById('tp-level')?.value;
        const pinned  = document.getElementById('tp-pinned')?.checked;
        const res = Auth.addTopic({ title, content, category: cat, minLevel: level, pinned });
        if (res.ok) {
            this.toast('Sujet publié ✓', 'success');
            this.navigate('test', 'sujets');
        } else {
            this.toast(res.msg, 'error');
        }
    },

    deleteTopic(id) {
        if (!confirm('Supprimer ce sujet ?')) return;
        Auth.deleteTopic(id);
        this.toast('Sujet supprimé', 'success');
        this.navigate('test', 'sujets');
    },

    toggleTopicPin(id) {
        Auth.toggleTopicPin(id);
        this.navigate('test', 'sujets');
    },

    clearTopics() {
        if (!confirm('Supprimer tous les sujets ?')) return;
        Auth.saveTopics([]);
        this.toast('Tous les sujets supprimés', 'success');
        this.navigate('test', 'sujets');
    },

    clearRequests() {
        if (!confirm('Vider l\'historique des demandes ?')) return;
        Auth.saveRequests([]);
        this._updateAdminBadge();
        this.toast('Historique vidé', 'success');
        this.navigate('test', 'demandes');
    },

    // ── Admin: Settings ───────────────────────────────────────────────────────

    toggleSetting(key, value) {
        Auth.saveSettings({ [key]: value });
        const user = Auth.getSession();
        const settings = Auth.getSettings();
        const banner   = document.getElementById('maintenance-banner');
        if (settings.maintenanceMode && user && user.level < 4) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
        this.toast(`Paramètre "${key}" ${value ? 'activé' : 'désactivé'}`, 'success');
    },

    saveWelcomeMessage() {
        const msg = document.getElementById('s-welcome')?.value || '';
        Auth.saveSettings({ welcomeMessage: msg });
        this.toast('Message de bienvenue enregistré', 'success');
    },

    // ── Toast ─────────────────────────────────────────────────────────────────

    toast(msg, type = 'info') {
        const el = document.createElement('div');
        el.className   = `toast toast-${type}`;
        el.textContent = msg;
        document.getElementById('toast-container').appendChild(el);
        setTimeout(() => {
            el.style.opacity   = '0';
            el.style.transform = 'translateX(16px)';
            setTimeout(() => el.remove(), 320);
        }, 3200);
    },

    // ── 3D Holographic Tilt ───────────────────────────────────────────────────

    initTilt() {
        const SEL = '.diploma-card, .proj-card, .sec-card:not(.locked), .site-card, .topic-card, [data-tilt="1"]';

        document.querySelectorAll(SEL).forEach(el => {
            // Inject shimmer overlay once
            if (!el.querySelector('.card-shimmer')) {
                const s = document.createElement('div');
                s.className = 'card-shimmer';
                el.appendChild(s);
            }
            const shimmer = el.querySelector('.card-shimmer');

            const MAX = el.classList.contains('sec-card') ? 13 : 19;
            const SC  = el.classList.contains('sec-card') ? 1.022 : 1.032;

            el.onmousemove = function(e) {
                const r  = el.getBoundingClientRect();
                const x  = (e.clientX - r.left) / r.width;
                const y  = (e.clientY - r.top)  / r.height;
                const rx = (y - 0.5) * -MAX;
                const ry = (x - 0.5) *  MAX;

                el.style.transition = 'transform .08s ease, box-shadow .08s ease';
                el.style.transform  = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${SC},${SC},${SC})`;

                // Shadow follows tilt direction
                const sx = (-ry * 3.5).toFixed(1);
                const sy = ( rx * 3.5).toFixed(1);
                // Hue shifts: left=purple, center=blue, right=amber
                const hue = Math.round(x * 280 + 200);
                const gR  = hue > 420 ? 251 : hue > 320 ? 96 : 167;
                const gG  = hue > 420 ? 191 : hue > 320 ? 165 : 139;
                const gB  = hue > 420 ?  36 : hue > 320 ? 250 : 250;
                el.style.boxShadow = `${sx}px ${sy}px 55px rgba(0,0,0,.52), 0 0 90px rgba(${gR},${gG},${gB},.22), inset 0 1px 0 rgba(255,255,255,.13)`;

                // Holographic shimmer: specular + rainbow foil
                const angle = Math.round(x * 360);
                const px    = Math.round(x * 100);
                const py    = Math.round(y * 100);
                shimmer.style.background = [
                    `radial-gradient(ellipse 52% 42% at ${px}% ${py}%, rgba(255,255,255,.26), transparent 62%)`,
                    `linear-gradient(${angle}deg, rgba(255,60,130,.11), rgba(255,210,0,.09), rgba(0,220,255,.11), rgba(130,60,255,.12), rgba(60,255,160,.08))`,
                ].join(',');
                shimmer.style.opacity = '1';
            };

            el.onmouseleave = function() {
                el.style.transition = 'transform .65s cubic-bezier(.03,.98,.52,.99), box-shadow .65s ease';
                el.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
                el.style.boxShadow  = '';
                shimmer.style.opacity = '0';
            };
        });
    },

    // ── Canvas background ─────────────────────────────────────────────────────

    _initCanvas() {
        const canvas = document.getElementById('bg-canvas');
        const ctx    = canvas.getContext('2d');
        let   pts    = [];

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

        const COLORS = [[245,158,11], [139,92,246], [59,130,246]];

        class Pt {
            constructor() { this.reset(true); }
            reset(full = false) {
                this.x  = Math.random() * canvas.width;
                this.y  = full ? Math.random() * canvas.height : (Math.random() > .5 ? -4 : canvas.height + 4);
                this.vx = (Math.random() - .5) * .26;
                this.vy = (Math.random() - .5) * .26;
                this.r  = Math.random() * 1.3 + .3;
                this.a  = Math.random() * .32 + .07;
                this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
            move() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < -10 || this.x > canvas.width+10 || this.y < -10 || this.y > canvas.height+10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
                ctx.fillStyle = `rgba(${this.c},${this.a})`;
                ctx.fill();
            }
        }

        resize();
        pts = Array.from({ length: Math.min(90, Math.floor(window.innerWidth/13)) }, () => new Pt());

        const drawLines = () => {
            for (let i = 0; i < pts.length; i++)
                for (let j = i+1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d  = Math.sqrt(dx*dx + dy*dy);
                    if (d < 125) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(139,92,246,${.042*(1-d/125)})`;
                        ctx.lineWidth = .55;
                        ctx.stroke();
                    }
                }
        };

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach(p => { p.move(); p.draw(); });
            drawLines();
            requestAnimationFrame(loop);
        };

        window.addEventListener('resize', () => { resize(); pts.forEach(p => p.reset(true)); });
        loop();
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
