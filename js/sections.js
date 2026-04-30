// sections.js — View renderers

const LVL_LABEL = { 1:'N1', 2:'N2', 3:'N3', 4:'N4' };
const LVL_NAME  = { 1:'Invité', 2:'Utilisateur', 3:'Modérateur', 4:'Admin' };
const CAT_COLOR = { 'Général':'var(--muted)', 'Important':'var(--l4)', 'Urgent':'#f87171', 'Info':'var(--l2)', 'Mise à jour':'var(--l3)' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function badge(lvl) {
    return `<span class="level-badge level-${lvl}">${LVL_LABEL[lvl]}</span>`;
}
function chips(arr) {
    return arr.map(t => `<span class="tag">${t}</span>`).join('');
}
function breadcrumb(label) {
    return `<div class="breadcrumb">
        <a href="#dashboard">Accueil</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-cur">${label}</span>
    </div>`;
}
function sectionHeader(emoji, bg, title, sub) {
    return `<div class="section-header">
        <div class="section-icon" style="background:${bg};">${emoji}</div>
        <div class="section-title"><h2>${title}</h2><p>${sub}</p></div>
    </div>`;
}
function renderTabs(list, active, section) {
    return `<div class="tabs">${
        list.map(t => `<div class="tab ${t.id === active ? 'active' : ''}"
            onclick="App.navigate('${section}','${t.id}')">${t.lbl}</div>`).join('')
    }</div>`;
}
function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' });
}

// ── Static data ───────────────────────────────────────────────────────────────

const DATA = {
    diplomes: {
        lycee: [
            { year:'2023', title:'Baccalauréat Général', school:'Lycée Technologique',
              detail:'Série STI2D — Sciences et Technologies de l\'Industrie et du Développement Durable',
              chips:['Option SIN','Mathématiques','Physique-Chimie'], mention:'Bien', mclass:'m-bien', da:'var(--l1)' },
        ],
        bts: [
            { year:'2023–2025', title:'BTS SN — Systèmes Numériques', school:'Lycée Technologique',
              detail:'Option IR — Informatique et Réseaux',
              chips:['Réseaux IP','Systèmes embarqués','Dev logiciel','Cybersécurité'],
              mention:'En cours ⏳', mclass:'m-cours', da:'var(--l2)' },
        ],
        ais: [
            { year:'2022', title:'Certification PIX', school:'PIX / MEN',
              detail:'Évaluation des compétences numériques — Niveau avancé',
              chips:['Traitement de l\'info','Communication numérique','Sécurité'],
              mention:'Validé ✓', mclass:'m-valid', da:'var(--l3)' },
            { year:'2023', title:'SecNumAcadémie', school:'ANSSI',
              detail:'Formation à la cybersécurité — 4 modules',
              chips:['Sécurité réseaux','Cryptographie','RGPD','Gestion des risques'],
              mention:'Validé ✓', mclass:'m-valid', da:'var(--l4)' },
        ],
    },
    projets: {
        dev: [
            { emoji:'🚗', pp:'radial-gradient(circle,#e63946,transparent)', title:'vroum.io',
              desc:'App web de suivi auto. GPS temps réel, heatmap des trajets, G-force DeviceMotion, compteur de vitesse.',
              chips:['Vanilla JS','Leaflet','GPS API','LocalStorage'], status:'active', slbl:'En ligne', github:null, demo:null },
            { emoji:'🌐', pp:'radial-gradient(circle,#8b5cf6,transparent)', title:'Site2T',
              desc:'Site personnel multi-niveaux avec auth par rôles, diplômes, projets, stockage et zone admin.',
              chips:['HTML/CSS','Vanilla JS','LocalStorage'], status:'active', slbl:'En ligne', github:null, demo:null },
            { emoji:'🤖', pp:'radial-gradient(circle,#3b82f6,transparent)', title:'Automatisation réseau',
              desc:'Scripts Python de configuration auto de switches/routeurs via SSH. Rapports et supervision.',
              chips:['Python','Paramiko','Netmiko','SSH'], status:'done', slbl:'Terminé', github:null, demo:null },
            { emoji:'📊', pp:'radial-gradient(circle,#10b981,transparent)', title:'Dashboard IoT',
              desc:'Interface de visualisation temps réel pour capteurs IoT. Graphiques dynamiques, alertes seuils, export CSV.',
              chips:['Chart.js','MQTT','Node.js','WebSocket'], status:'wip', slbl:'En cours', github:null, demo:null },
        ],
        elec: [
            { emoji:'⚡', pp:'radial-gradient(circle,#f59e0b,transparent)', title:'Alimentation variable 0–30V',
              desc:'Alim de labo réglable 0–30V / 0–5A avec LCD I²C, régulation PWM et protection court-circuit.',
              chips:['LM317','Arduino Nano','PWM','LCD I2C'], status:'done', slbl:'Terminé', github:null, demo:null },
            { emoji:'📡', pp:'radial-gradient(circle,#3b82f6,transparent)', title:'Station météo IoT',
              desc:'Relevés temp/humidité/pression avec envoi MQTT vers Grafana. Solaire + LiPo. OTA updates.',
              chips:['ESP32','BME280','MQTT','Grafana'], status:'wip', slbl:'En cours', github:null, demo:null },
            { emoji:'🔌', pp:'radial-gradient(circle,#8b5cf6,transparent)', title:'Relayeur WiFi 8 canaux',
              desc:'Carte 8 relais pilotée par ESP8266 via interface web responsive. Planification horaire et API REST.',
              chips:['ESP8266','Relais 10A','REST API','HTML'], status:'done', slbl:'Terminé', github:null, demo:null },
        ],
        meca: [
            { emoji:'🦾', pp:'radial-gradient(circle,#e63946,transparent)', title:'Bras robotique 3 axes',
              desc:'Bras articulé SolidWorks, imprimé en PLA. Contrôlé par 3 servos MG996R et Arduino. Interface web.',
              chips:['SolidWorks','FDM PLA','Arduino','MG996R'], status:'done', slbl:'Terminé', github:null, demo:null },
            { emoji:'🏎️', pp:'radial-gradient(circle,#f59e0b,transparent)', title:'Châssis RC brushless',
              desc:'Châssis RC 1/10e avec motorisation brushless 3548, ESC 60A et direction servo pilotés par Arduino.',
              chips:['SolidWorks','PETG 3D','Brushless','ESC 60A'], status:'wip', slbl:'En cours', github:null, demo:null },
            { emoji:'⚙️', pp:'radial-gradient(circle,#10b981,transparent)', title:'Boîte de vitesses miniature',
              desc:'Reproduction fonctionnelle d\'une boîte 5 vitesses à l\'échelle 1/5. Résine SLA, synchroniseurs fonctionnels.',
              chips:['Fusion 360','Résine SLA','Simulation','Engrenages'], status:'done', slbl:'Terminé', github:null, demo:null },
        ],
    },
    stockage: {
        pdfs: [
            { name:'CV_Timothe_2025.pdf',          size:'284 Ko', date:'mars 2025',  cat:'Personnel',      emoji:'📄' },
            { name:'Rapport_Stage_BTS_S1.pdf',      size:'1.8 Mo', date:'juin 2024',  cat:'Scolaire',       emoji:'📚' },
            { name:'Baccalaureat_Diplome.pdf',       size:'156 Ko', date:'juil. 2023', cat:'Diplômes',       emoji:'🎓' },
            { name:'Attestation_PIX_2022.pdf',      size:'98 Ko',  date:'juin 2022',  cat:'Certifications', emoji:'✅' },
            { name:'SecNumAcademie_Attestation.pdf', size:'112 Ko', date:'sept. 2023', cat:'Certifications', emoji:'🛡️' },
            { name:'Note_Technique_Alim_Var.pdf',   size:'876 Ko', date:'nov. 2024',  cat:'Projets',        emoji:'⚡' },
            { name:'Schema_Bras_Robotique.pdf',     size:'2.1 Mo', date:'sept. 2024', cat:'Projets',        emoji:'🦾' },
            { name:'Releve_Notes_BTS_S1.pdf',       size:'134 Ko', date:'janv. 2025', cat:'Scolaire',       emoji:'📋' },
        ],
        sites: [
            { name:'vroum.io',    desc:'App de suivi automobile — GPS, trajets, garage, G-force', url:'#', emoji:'🚗', status:'online'  },
            { name:'Site2T',      desc:'Site personnel multi-niveaux — diplômes, projets, stockage', url:'#', emoji:'🌐', status:'online'  },
            { name:'Portfolio v1',desc:'Premier portfolio personnel — version archivée (2023)',     url:'#', emoji:'📦', status:'offline' },
        ],
    },
};

// ── Sections ──────────────────────────────────────────────────────────────────

const Sections = {

    // ── Dashboard ──
    dashboard() {
        const user     = Auth.getSession();
        const settings = Auth.getSettings();
        const hour     = new Date().getHours();
        const greet    = hour < 5 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

        // Maintenance check
        if (settings.maintenanceMode && user.level < 4) {
            return `<div class="access-denied">
                <div class="access-denied-ico">🔧</div>
                <h2>Maintenance en cours</h2>
                <p>Le site est temporairement indisponible. Revenez plus tard.</p>
                <button class="btn" onclick="App.logout()" style="margin-top:16px;padding:9px 20px;">← Déconnexion</button>
            </div>`;
        }

        // Welcome message
        const welcomeHtml = settings.welcomeMessage
            ? `<div class="welcome-msg">${settings.welcomeMessage}</div>` : '';

        // Topics for this level
        const allTopics = Auth.getTopics().filter(t => user.level >= t.minLevel);
        const pinned    = allTopics.filter(t => t.pinned);
        const recent    = allTopics.filter(t => !t.pinned).slice(0, 4);

        const topicCard = (t) => {
            const catColor = CAT_COLOR[t.category] || 'var(--muted)';
            return `<div class="topic-card" data-tilt>
                <div class="topic-cat" style="color:${catColor};">${t.pinned ? '📌 ' : ''}${t.category}</div>
                <div class="topic-title">${t.title}</div>
                <div class="topic-content">${t.content}</div>
                <div class="topic-meta">${badge(t.minLevel)} · ${fmtDate(t.date)} · ${t.author}</div>
            </div>`;
        };

        const topicsHtml = (pinned.length + recent.length) > 0 ? `
            <div class="topics-section">
                <h3 class="topics-heading">📢 Annonces</h3>
                <div class="topics-grid">
                    ${pinned.map(topicCard).join('')}
                    ${recent.map(topicCard).join('')}
                </div>
            </div>
        ` : '';

        // Guest banner
        const guestBanner = user.isGuest ? `
            <div class="guest-banner">
                <span>👤 Vous naviguez en tant qu'invité.</span>
                <div style="display:flex;gap:8px;flex-shrink:0;">
                    <button class="btn sm" onclick="App.logout()">Se connecter</button>
                    <button class="btn sm" onclick="App.logout(); setTimeout(()=>document.getElementById('tab-register').click(),100)">Créer un compte</button>
                </div>
            </div>` : '';

        // Upgrade request status
        let requestBanner = '';
        if (!user.isGuest && user.level < 4) {
            const req = Auth.getUserLastRequest(user.id);
            if (req?.status === 'pending') {
                requestBanner = `<div class="request-banner pending">
                    ⏳ Votre demande de niveau ${LVL_LABEL[req.toLevel]} est en cours d'examen.
                </div>`;
            } else if (req?.status === 'approved') {
                requestBanner = `<div class="request-banner approved">
                    ✅ Votre demande a été approuvée — niveau ${LVL_LABEL[req.toLevel]} accordé !
                </div>`;
            } else if (req?.status === 'denied') {
                requestBanner = `<div class="request-banner denied">
                    ❌ Votre demande de niveau ${LVL_LABEL[req.toLevel]} a été refusée.
                </div>`;
            }
        }

        const cards = [
            { id:'diplomes', emoji:'🎓', bg:'rgba(16,185,129,.12)',  ca:'16,185,129',  title:'Diplômes',    desc:'Baccalauréat, BTS et certifications professionnelles.', tags:['Lycée','BTS','AIS'], lvl:1 },
            { id:'projets',  emoji:'💡', bg:'rgba(59,130,246,.12)',  ca:'59,130,246',  title:'Projets',     desc:'Réalisations en développement, électronique et mécanique.', tags:['Dev','Elec','Meca'], lvl:2 },
            { id:'stockage', emoji:'🗄️', bg:'rgba(139,92,246,.12)', ca:'139,92,246', title:'Stockage',    desc:'Fichiers PDF et sites web hébergés accessibles en ligne.', tags:['PDF','Sites web'], lvl:3 },
            { id:'test',     emoji:'⚙️', bg:'rgba(245,158,11,.12)', ca:'245,158,11', title:'Zone Admin',  desc:'Administration, gestion des utilisateurs et outils système.', tags:['Admin','Sujets'], lvl:4 },
        ];

        const cardsHtml = cards.map(c => {
            const locked = !Auth.hasAccess(c.lvl);
            const onclick = locked
                ? (user.isGuest ? `App.logout()` : `App.showUpgradeModal()`)
                : `App.navigate('${c.id}')`;
            return `<div class="sec-card ${locked ? 'locked' : ''}" style="--ca:rgba(${c.ca},.18)" onclick="${onclick}" data-tilt="${locked ? '' : '1'}">
                <div class="sc-badge">${badge(c.lvl)}</div>
                <div class="sc-icon" style="background:${c.bg};">${locked ? '🔒' : c.emoji}</div>
                <div class="sc-title">${c.title}</div>
                <div class="sc-desc">${c.desc}</div>
                <div class="sc-tags">${chips(c.tags)}</div>
                ${locked && !user.isGuest ? `<div class="sc-request-hint">Cliquer pour demander l'accès</div>` : ''}
            </div>`;
        }).join('');

        return `
        ${welcomeHtml}
        ${guestBanner}
        ${requestBanner}
        ${topicsHtml}
        <div class="dash-greeting">
            <h1>${greet}, ${user.name} 👋</h1>
            <p>Niveau d'accès : ${badge(user.level)} &nbsp;—&nbsp; ${LVL_NAME[user.level]}</p>
        </div>
        <div class="dash-grid">${cardsHtml}</div>`;
    },

    // ── Diplômes ──
    diplomes(tab = 'lycee') {
        if (!Auth.hasAccess(1)) return this._denied(1);
        const tabs = [{ id:'lycee', lbl:'🎓 Lycée' }, { id:'bts', lbl:'🏫 BTS' }, { id:'ais', lbl:'✅ AIS' }];
        const items = DATA.diplomes[tab] || [];
        const cards = items.map(d => `
            <div class="diploma-card" style="--da:${d.da};" data-tilt>
                <div class="diploma-year">${d.year}</div>
                <div class="diploma-title">${d.title}</div>
                <div class="diploma-school">📍 ${d.school}</div>
                <div class="diploma-detail">${d.detail}</div>
                <div class="diploma-chips">${chips(d.chips)}</div>
                <span class="mention ${d.mclass}">${d.mention}</span>
            </div>`).join('');
        return `
        ${breadcrumb('Diplômes')}
        ${sectionHeader('🎓','rgba(16,185,129,.12)','Diplômes & Certifications','Parcours académique et certifications professionnelles')}
        ${renderTabs(tabs, tab, 'diplomes')}
        <div class="cards-grid">${cards}</div>`;
    },

    // ── Projets ──
    projets(tab = 'dev') {
        if (!Auth.hasAccess(2)) return this._denied(2);
        const tabs = [{ id:'dev', lbl:'💻 Dev' }, { id:'elec', lbl:'⚡ Elec' }, { id:'meca', lbl:'🔧 Meca' }];
        const items = DATA.projets[tab] || [];
        const cards = items.map(p => {
            const codeBtn = p.github
                ? `<a href="${p.github}" target="_blank" class="link-btn">📁 Code</a>`
                : `<button class="link-btn" onclick="App.toast('Repo privé','info')">📁 Code</button>`;
            const demoBtn = p.demo ? `<a href="${p.demo}" target="_blank" class="link-btn">🌐 Demo</a>` : '';
            const dotCls  = p.status === 'active' ? 'dot-active' : p.status === 'done' ? 'dot-done' : 'dot-wip';
            return `<div class="proj-card" data-tilt>
                <div class="proj-preview" style="--pp:${p.pp};">${p.emoji}</div>
                <div class="proj-body">
                    <div class="proj-title">${p.title}</div>
                    <div class="proj-desc">${p.desc}</div>
                    <div class="proj-chips">${chips(p.chips)}</div>
                    <div class="proj-footer">
                        <div class="proj-links">${codeBtn}${demoBtn}</div>
                        <div class="proj-status"><span class="dot ${dotCls}"></span>${p.slbl}</div>
                    </div>
                </div>
            </div>`;
        }).join('');
        return `
        ${breadcrumb('Projets')}
        ${sectionHeader('💡','rgba(59,130,246,.12)','Projets','Réalisations personnelles et scolaires')}
        ${renderTabs(tabs, tab, 'projets')}
        <div class="cards-grid">${cards}</div>`;
    },

    // ── Stockage ──
    stockage(tab = 'pdfs') {
        if (!Auth.hasAccess(3)) return this._denied(3);
        const tabs = [{ id:'pdfs', lbl:'📄 Fichiers PDF' }, { id:'sites', lbl:'🌐 Sites web' }];
        let content = '';

        if (tab === 'pdfs') {
            content = `<div class="file-list">${DATA.stockage.pdfs.map(f => `
                <div class="file-item">
                    <div class="file-ico" style="background:rgba(239,68,68,.1);">${f.emoji}</div>
                    <div class="file-info">
                        <div class="file-name">${f.name}</div>
                        <div class="file-meta">${f.size} · ${f.date} · ${f.cat}</div>
                    </div>
                    <div class="file-acts">
                        <button class="btn sm" onclick="App.toast('Téléchargement simulé','success')">⬇ DL</button>
                        <button class="btn sm" onclick="App.toast('Aperçu non disponible en local','info')">👁</button>
                    </div>
                </div>`).join('')}</div>`;
        }

        if (tab === 'sites') {
            content = `<div class="site-grid">${DATA.stockage.sites.map(s => {
                const dotCls = s.status === 'online' ? 'dot-active' : '';
                const lbl    = s.status === 'online' ? 'En ligne' : 'Hors ligne';
                return `<div class="site-card" data-tilt>
                    <div class="site-thumb">${s.emoji}</div>
                    <div>
                        <div class="site-name">${s.name}</div>
                        <div class="site-url">${s.url === '#' ? 'URL non configurée' : s.url}</div>
                    </div>
                    <div class="site-desc">${s.desc}</div>
                    <div class="site-foot">
                        <div class="proj-status"><span class="dot ${dotCls}"></span>${lbl}</div>
                        <button class="btn sm" onclick="App.toast('${s.status === 'online' ? 'Ouverture…' : 'Site hors ligne'}','${s.status === 'online' ? 'info' : 'error'}')">🌐 Ouvrir</button>
                    </div>
                </div>`;
            }).join('')}</div>`;
        }

        return `
        ${breadcrumb('Stockage')}
        ${sectionHeader('🗄️','rgba(139,92,246,.12)','Stockage','Fichiers et ressources en ligne')}
        ${renderTabs(tabs, tab, 'stockage')}
        ${content}`;
    },

    // ── Admin / Test ──
    test(tab = 'utilisateurs') {
        if (!Auth.hasAccess(4)) return this._denied(4);
        const pendingCount = Auth.pendingCount();
        const tabs = [
            { id:'utilisateurs', lbl:'👥 Utilisateurs' },
            { id:'demandes',     lbl:`📩 Demandes${pendingCount > 0 ? ` <span class="tab-badge">${pendingCount}</span>` : ''}` },
            { id:'sujets',       lbl:'📢 Sujets' },
            { id:'parametres',   lbl:'⚙️ Paramètres' },
        ];

        const tabsHtml = `<div class="tabs admin-tabs">${
            tabs.map(t => `<div class="tab ${t.id === tab ? 'active' : ''}"
                onclick="App.navigate('test','${t.id}')">${t.lbl}</div>`).join('')
        }</div>`;

        let content = '';
        if      (tab === 'utilisateurs') content = this._adminUsers();
        else if (tab === 'demandes')     content = this._adminRequests();
        else if (tab === 'sujets')       content = this._adminTopics();
        else if (tab === 'parametres')   content = this._adminSettings();

        return `
        ${breadcrumb('Zone Admin')}
        ${sectionHeader('⚙️','rgba(245,158,11,.12)','Administration','Gestion du site et des utilisateurs')}
        ${tabsHtml}
        ${content}`;
    },

    _adminUsers() {
        const users   = Auth.getUsers();
        const session = Auth.getSession();
        const counts  = {
            users:    users.length,
            admins:   users.filter(u => u.level === 4).length,
            projets:  DATA.projets.dev.length + DATA.projets.elec.length + DATA.projets.meca.length,
            pdfs:     DATA.stockage.pdfs.length,
            sites:    DATA.stockage.sites.length,
            topics:   Auth.getTopics().length,
        };
        const userRows = users.map(u => `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td style="color:var(--muted);">${u.name}</td>
                <td>${badge(u.level)}</td>
                <td style="color:var(--muted);font-family:var(--mono);font-size:.76rem;">${u.created || '—'}</td>
                <td><div class="u-actions">
                    ${u.id !== session.id
                        ? `<button class="btn sm" onclick="App.promoteUser('${u.id}','${u.name}',${u.level})">↑</button>
                           <button class="btn sm danger" onclick="App.deleteUser('${u.id}','${u.username}')">Suppr.</button>`
                        : `<span style="font-size:.74rem;color:var(--subtle);">Vous</span>`}
                </div></td>
            </tr>`).join('');
        return `
        <div class="admin-grid">
            <div class="admin-card" data-tilt>
                <div class="admin-card-title">📊 Statistiques</div>
                <div class="stats-row">
                    <div class="stat-item"><div class="stat-val">${counts.users}</div><div class="stat-lab">Comptes</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.admins}</div><div class="stat-lab">Admins</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.projets}</div><div class="stat-lab">Projets</div></div>
                </div>
                <div class="stats-row">
                    <div class="stat-item"><div class="stat-val">${counts.pdfs}</div><div class="stat-lab">PDFs</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.sites}</div><div class="stat-lab">Sites</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.topics}</div><div class="stat-lab">Sujets</div></div>
                </div>
            </div>
            <div class="admin-card" data-tilt>
                <div class="admin-card-title">➕ Nouvel utilisateur</div>
                <div class="add-form">
                    <div class="form-row">
                        <input class="inp" id="nu-user" placeholder="Identifiant">
                        <input class="inp" id="nu-name" placeholder="Nom affiché">
                    </div>
                    <div class="form-row">
                        <input class="inp" type="password" id="nu-pass" placeholder="Mot de passe">
                        <select class="inp" id="nu-level">
                            <option value="1">Niveau 1 — Invité</option>
                            <option value="2">Niveau 2 — Utilisateur</option>
                            <option value="3">Niveau 3 — Modérateur</option>
                            <option value="4">Niveau 4 — Admin</option>
                        </select>
                    </div>
                    <button class="btn primary" onclick="App.addUser()">Créer l'utilisateur</button>
                </div>
            </div>
            <div class="admin-card" style="grid-column:1/-1;">
                <div class="admin-card-title">👥 Utilisateurs (${users.length})</div>
                <div style="overflow-x:auto;">
                    <table class="users-table">
                        <thead><tr><th>Identifiant</th><th>Nom</th><th>Niveau</th><th>Créé le</th><th>Actions</th></tr></thead>
                        <tbody>${userRows}</tbody>
                    </table>
                </div>
            </div>
            <div class="admin-card" style="grid-column:1/-1;">
                <div class="admin-card-title">🔧 Actions rapides</div>
                <div class="quick-actions">
                    <button class="qa-btn" onclick="App.exportData()">📤 Exporter les utilisateurs (JSON)</button>
                    <button class="qa-btn" onclick="App.importData()">📥 Importer des utilisateurs (JSON)</button>
                    <button class="qa-btn danger" onclick="App.resetUsers()">🔄 Réinitialiser aux défauts</button>
                    <input type="file" id="import-file" style="display:none" accept=".json" onchange="App.handleImport(event)">
                </div>
            </div>
        </div>`;
    },

    _adminRequests() {
        const reqs    = Auth.getRequests();
        const pending = reqs.filter(r => r.status === 'pending');
        const history = reqs.filter(r => r.status !== 'pending').slice(0, 10);

        const pendingHtml = pending.length === 0
            ? `<div class="empty-state">✅ Aucune demande en attente</div>`
            : pending.map(r => `
                <div class="request-card pending-card">
                    <div class="req-top">
                        <div>
                            <strong>${r.name}</strong> <span style="color:var(--muted);font-size:.8rem;">(@${r.username})</span>
                            <div style="display:flex;gap:6px;align-items:center;margin-top:4px;">
                                ${badge(r.fromLevel)} <span style="color:var(--muted);font-size:.8rem;">→</span> ${badge(r.toLevel)}
                            </div>
                        </div>
                        <span style="font-size:.75rem;color:var(--muted);white-space:nowrap;">${fmtDate(r.date)}</span>
                    </div>
                    ${r.message ? `<div class="req-message">"${r.message}"</div>` : ''}
                    <div class="req-actions">
                        <button class="btn sm primary-sm" onclick="App.approveRequest('${r.id}','${r.name}',${r.toLevel})">✓ Approuver</button>
                        <button class="btn sm danger"     onclick="App.denyRequest('${r.id}','${r.name}')">✗ Refuser</button>
                    </div>
                </div>`).join('');

        const historyHtml = history.length === 0 ? '' : `
            <div class="admin-card" style="margin-top:18px;">
                <div class="admin-card-title">📋 Historique</div>
                ${history.map(r => `
                    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);font-size:.85rem;">
                        <span class="req-status-badge ${r.status}">${r.status === 'approved' ? '✓' : '✗'}</span>
                        <span>${r.name} <span style="color:var(--muted);">→</span> ${badge(r.toLevel)}</span>
                        <span style="color:var(--muted);margin-left:auto;font-size:.75rem;">${fmtDate(r.date)}</span>
                    </div>`).join('')}
            </div>`;

        return `
        <div class="admin-card">
            <div class="admin-card-title">📩 Demandes en attente (${pending.length})</div>
            ${pendingHtml}
        </div>
        ${historyHtml}`;
    },

    _adminTopics() {
        const topics = Auth.getTopics();
        const topicsList = topics.length === 0
            ? `<div class="empty-state">Aucun sujet créé pour l'instant.</div>`
            : topics.map(t => `
                <div class="topic-mgmt-card">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                        <div style="flex:1;min-width:0;">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                                ${t.pinned ? '<span title="Épinglé">📌</span>' : ''}
                                <strong style="font-size:.9rem;">${t.title}</strong>
                                <span class="tag">${t.category}</span>
                                ${badge(t.minLevel)}
                            </div>
                            <div style="font-size:.82rem;color:var(--muted);line-height:1.5;margin-bottom:6px;">${t.content}</div>
                            <div style="font-size:.74rem;color:var(--subtle);">${t.author} · ${fmtDate(t.date)}</div>
                        </div>
                        <div style="display:flex;gap:5px;flex-shrink:0;">
                            <button class="btn sm" onclick="App.toggleTopicPin('${t.id}')" title="${t.pinned ? 'Désépingler' : 'Épingler'}">
                                ${t.pinned ? '📍' : '📌'}
                            </button>
                            <button class="btn sm danger" onclick="App.deleteTopic('${t.id}')">Suppr.</button>
                        </div>
                    </div>
                </div>`).join('');

        return `
        <div class="admin-grid" style="grid-template-columns:1fr 1fr;">
            <div class="admin-card">
                <div class="admin-card-title">✏️ Créer un sujet</div>
                <div class="add-form">
                    <input class="inp" id="tp-title"   placeholder="Titre du sujet">
                    <textarea class="inp" id="tp-content" rows="3" placeholder="Contenu / message…" style="resize:vertical;"></textarea>
                    <div class="form-row">
                        <select class="inp" id="tp-cat">
                            <option>Général</option>
                            <option>Important</option>
                            <option>Urgent</option>
                            <option>Info</option>
                            <option>Mise à jour</option>
                        </select>
                        <select class="inp" id="tp-level">
                            <option value="1">Visible N1+</option>
                            <option value="2">Visible N2+</option>
                            <option value="3">Visible N3+</option>
                            <option value="4">Visible N4 seulement</option>
                        </select>
                    </div>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--muted);cursor:pointer;">
                        <input type="checkbox" id="tp-pinned" style="accent-color:var(--l4);width:14px;height:14px;">
                        Épingler ce sujet en priorité
                    </label>
                    <button class="btn primary" onclick="App.addTopic()">Publier le sujet</button>
                </div>
            </div>
            <div class="admin-card">
                <div class="admin-card-title">📋 Sujets publiés (${topics.length})</div>
                <div style="display:flex;flex-direction:column;gap:10px;max-height:420px;overflow-y:auto;">
                    ${topicsList}
                </div>
            </div>
        </div>`;
    },

    _adminSettings() {
        const s = Auth.getSettings();
        return `
        <div class="admin-grid">
            <div class="admin-card" data-tilt>
                <div class="admin-card-title">⚙️ Paramètres généraux</div>
                <div class="settings-list">
                    <div class="setting-row">
                        <div class="setting-info">
                            <div class="setting-label">Mode maintenance</div>
                            <div class="setting-desc">Bloque l'accès aux utilisateurs non-admin</div>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" id="s-maintenance" ${s.maintenanceMode ? 'checked' : ''} onchange="App.toggleSetting('maintenanceMode',this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-row">
                        <div class="setting-info">
                            <div class="setting-label">Inscriptions ouvertes</div>
                            <div class="setting-desc">Permet la création de nouveaux comptes</div>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" id="s-registrations" ${s.allowRegistrations ? 'checked' : ''} onchange="App.toggleSetting('allowRegistrations',this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-row" style="flex-direction:column;align-items:flex-start;gap:10px;">
                        <div class="setting-label">Message de bienvenue</div>
                        <input class="inp" id="s-welcome" value="${s.welcomeMessage}" placeholder="Message affiché sur le dashboard">
                        <button class="btn" onclick="App.saveWelcomeMessage()" style="padding:7px 14px;">Enregistrer</button>
                    </div>
                </div>
            </div>

            <div class="admin-card" data-tilt>
                <div class="admin-card-title">🖥️ Informations système</div>
                <div class="sysinfo">
                    ${[
                        ['Version',       '2.0.0'],
                        ['Navigateur',    navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)[/\s]([\d.]+)/)?.[0] || 'Inconnu'],
                        ['Plateforme',    navigator.platform],
                        ['Résolution',    `${screen.width}×${screen.height}`],
                        ['Langue',        navigator.language],
                        ['Fuseau',        Intl.DateTimeFormat().resolvedOptions().timeZone],
                        ['Stockage local',`${(JSON.stringify(localStorage).length/1024).toFixed(1)} Ko`],
                    ].map(([k,v]) => `<div class="sysinfo-row"><span class="sysinfo-key">${k}</span><span class="sysinfo-val">${v}</span></div>`).join('')}
                </div>
            </div>

            <div class="admin-card" data-tilt>
                <div class="admin-card-title">🗑️ Réinitialisation</div>
                <div class="quick-actions">
                    <button class="qa-btn danger" onclick="App.clearTopics()">🗑️ Supprimer tous les sujets</button>
                    <button class="qa-btn danger" onclick="App.clearRequests()">🗑️ Vider l'historique des demandes</button>
                    <button class="qa-btn danger" onclick="App.resetUsers()">🔄 Réinitialiser les utilisateurs</button>
                </div>
            </div>
        </div>`;
    },

    // ── Access Denied ──
    _denied(lvl) {
        return `<div class="access-denied">
            <div class="access-denied-ico">🔒</div>
            <h2>Accès restreint</h2>
            <p>Cette section nécessite le niveau ${badge(lvl)}.<br>Votre niveau actuel est insuffisant.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
                <button class="btn" onclick="App.navigate('dashboard')" style="padding:9px 20px;">← Retour</button>
                ${!Auth.isGuest() && Auth.getSession().level < lvl
                    ? `<button class="btn" onclick="App.showUpgradeModal()" style="padding:9px 20px;">⬆ Demander l'accès</button>` : ''}
            </div>
        </div>`;
    },
};
