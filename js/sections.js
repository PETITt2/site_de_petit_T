// sections.js — View renderers for each section

// ── Helpers ──────────────────────────────────────────────────────────────────

const LVL_LABEL = { 1:'N1', 2:'N2', 3:'N3', 4:'N4' };
const LVL_NAME  = { 1:'Invité', 2:'Utilisateur', 3:'Modérateur', 4:'Admin' };

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

// ── Static data ───────────────────────────────────────────────────────────────

const DATA = {
    diplomes: {
        lycee: [
            {
                year: '2023',
                title: 'Baccalauréat Général',
                school: 'Lycée Technologique',
                detail: 'Série STI2D — Sciences et Technologies de l\'Industrie et du Développement Durable',
                chips: ['Option SIN', 'Mathématiques', 'Physique-Chimie'],
                mention: 'Bien', mclass: 'm-bien', da: 'var(--l1)',
            },
        ],
        bts: [
            {
                year: '2023–2025',
                title: 'BTS SN — Systèmes Numériques',
                school: 'Lycée Technologique',
                detail: 'Option IR — Informatique et Réseaux',
                chips: ['Réseaux IP', 'Systèmes embarqués', 'Dev logiciel', 'Cybersécurité'],
                mention: 'En cours ⏳', mclass: 'm-cours', da: 'var(--l2)',
            },
        ],
        ais: [
            {
                year: '2022',
                title: 'Certification PIX',
                school: 'PIX / Ministère de l\'Éducation Nationale',
                detail: 'Évaluation des compétences numériques — Niveau avancé',
                chips: ['Traitement de l\'information', 'Communication numérique', 'Sécurité des données'],
                mention: 'Validé ✓', mclass: 'm-valid', da: 'var(--l3)',
            },
            {
                year: '2023',
                title: 'Attestation SecNumAcadémie',
                school: 'ANSSI',
                detail: 'Formation à la cybersécurité — 4 modules complétés',
                chips: ['Sécurité des réseaux', 'Cryptographie', 'RGPD', 'Gestion des risques'],
                mention: 'Validé ✓', mclass: 'm-valid', da: 'var(--l4)',
            },
        ],
    },

    projets: {
        dev: [
            {
                emoji: '🚗', pp: 'radial-gradient(circle,#e63946,transparent)',
                title: 'vroum.io',
                desc: 'Application web de suivi automobile. GPS en temps réel, heatmap des trajets, G-force DeviceMotion, compteur de vitesse live, gestion du garage.',
                chips: ['Vanilla JS', 'Leaflet', 'GPS API', 'LocalStorage'],
                status: 'active', slbl: 'En ligne',
                github: null, demo: null,
            },
            {
                emoji: '🌐', pp: 'radial-gradient(circle,#8b5cf6,transparent)',
                title: 'Site2T',
                desc: 'Site personnel multi-niveaux avec authentification par rôles, gestion de diplômes, projets et stockage. Architecture SPA vanilla.',
                chips: ['HTML/CSS', 'Vanilla JS', 'LocalStorage'],
                status: 'active', slbl: 'En ligne',
                github: null, demo: null,
            },
            {
                emoji: '🤖', pp: 'radial-gradient(circle,#3b82f6,transparent)',
                title: 'Automatisation réseau',
                desc: 'Scripts Python pour configuration automatique de switches/routeurs via SSH. Génération de rapports et supervision.',
                chips: ['Python', 'Paramiko', 'Netmiko', 'SSH'],
                status: 'done', slbl: 'Terminé',
                github: null, demo: null,
            },
            {
                emoji: '📊', pp: 'radial-gradient(circle,#10b981,transparent)',
                title: 'Dashboard IoT',
                desc: 'Interface de visualisation temps réel pour capteurs IoT. Graphiques dynamiques, alertes seuils, export CSV.',
                chips: ['Chart.js', 'MQTT', 'Node.js', 'WebSocket'],
                status: 'wip', slbl: 'En cours',
                github: null, demo: null,
            },
        ],
        elec: [
            {
                emoji: '⚡', pp: 'radial-gradient(circle,#f59e0b,transparent)',
                title: 'Alimentation variable 0–30V',
                desc: 'Alimentation de laboratoire réglable 0–30V / 0–5A avec affichage LCD I²C, régulation PWM et protection court-circuit.',
                chips: ['LM317', 'Arduino Nano', 'PWM', 'LCD I2C'],
                status: 'done', slbl: 'Terminé',
                github: null, demo: null,
            },
            {
                emoji: '📡', pp: 'radial-gradient(circle,#3b82f6,transparent)',
                title: 'Station météo IoT',
                desc: 'Relevés température/humidité/pression avec envoi MQTT vers Grafana. Alimentation solaire + batterie LiPo. OTA updates.',
                chips: ['ESP32', 'BME280', 'MQTT', 'Grafana'],
                status: 'wip', slbl: 'En cours',
                github: null, demo: null,
            },
            {
                emoji: '🔌', pp: 'radial-gradient(circle,#8b5cf6,transparent)',
                title: 'Relayeur WiFi 8 canaux',
                desc: 'Carte 8 relais pilotée par ESP8266 via interface web responsive. Planification horaire et API REST.',
                chips: ['ESP8266', 'Relais 10A', 'REST API', 'HTML'],
                status: 'done', slbl: 'Terminé',
                github: null, demo: null,
            },
        ],
        meca: [
            {
                emoji: '🦾', pp: 'radial-gradient(circle,#e63946,transparent)',
                title: 'Bras robotique 3 axes',
                desc: 'Bras articulé conçu sur SolidWorks, imprimé en PLA. Contrôlé par 3 servos MG996R et Arduino. Interface web de pilotage.',
                chips: ['SolidWorks', 'FDM PLA', 'Arduino', 'MG996R'],
                status: 'done', slbl: 'Terminé',
                github: null, demo: null,
            },
            {
                emoji: '🏎️', pp: 'radial-gradient(circle,#f59e0b,transparent)',
                title: 'Châssis RC brushless',
                desc: 'Conception et fabrication d\'un châssis RC 1/10e avec motorisation brushless 3548, ESC 60A et direction servo pilotés par Arduino.',
                chips: ['SolidWorks', 'PETG 3D', 'Brushless', 'ESC 60A'],
                status: 'wip', slbl: 'En cours',
                github: null, demo: null,
            },
            {
                emoji: '⚙️', pp: 'radial-gradient(circle,#10b981,transparent)',
                title: 'Boîte de vitesses manuelle miniature',
                desc: 'Reproduction fonctionnelle d\'une boîte 5 vitesses à l\'échelle 1/5. Pièces imprimées en résine, synchroniseurs fonctionnels.',
                chips: ['Fusion 360', 'Résine SLA', 'Simulation', 'Engrenages'],
                status: 'done', slbl: 'Terminé',
                github: null, demo: null,
            },
        ],
    },

    stockage: {
        pdfs: [
            { name:'CV_Timothe_2025.pdf',         size:'284 Ko',  date:'mars 2025',  cat:'Personnel',      emoji:'📄' },
            { name:'Rapport_Stage_BTS_S1.pdf',     size:'1.8 Mo',  date:'juin 2024',  cat:'Scolaire',       emoji:'📚' },
            { name:'Baccalaureat_Diplome.pdf',      size:'156 Ko',  date:'juil. 2023', cat:'Diplômes',       emoji:'🎓' },
            { name:'Attestation_PIX_2022.pdf',     size:'98 Ko',   date:'juin 2022',  cat:'Certifications', emoji:'✅' },
            { name:'SecNumAcademie_Attestation.pdf',size:'112 Ko', date:'sept. 2023', cat:'Certifications', emoji:'🛡️' },
            { name:'Note_Technique_Alim_Var.pdf',  size:'876 Ko',  date:'nov. 2024',  cat:'Projets',        emoji:'⚡' },
            { name:'Schema_Bras_Robotique.pdf',    size:'2.1 Mo',  date:'sept. 2024', cat:'Projets',        emoji:'🦾' },
            { name:'Releve_Notes_BTS_S1.pdf',      size:'134 Ko',  date:'janv. 2025', cat:'Scolaire',       emoji:'📋' },
        ],
        sites: [
            { name:'vroum.io',   desc:'App de suivi automobile — GPS, trajets, garage, G-force',           url:'#', emoji:'🚗', status:'online'  },
            { name:'Site2T',     desc:'Site personnel multi-niveaux — diplômes, projets, stockage',         url:'#', emoji:'🌐', status:'online'  },
            { name:'Portfolio v1',desc:'Premier portfolio personnel — version archivée (2023)',              url:'#', emoji:'📦', status:'offline' },
        ],
    },
};

// ── Sections ──────────────────────────────────────────────────────────────────

const Sections = {

    // ── Dashboard ──
    dashboard() {
        const user = Auth.getSession();
        const now  = new Date();
        const hour = now.getHours();
        const greet = hour < 5 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

        const cards = [
            { id:'diplomes', emoji:'🎓', bg:'rgba(16,185,129,.12)',  ca:'16,185,129',  title:'Diplômes',   desc:'Baccalauréat, BTS et certifications professionnelles.',           tags:['Lycée','BTS','AIS'],     lvl:1 },
            { id:'projets',  emoji:'💡', bg:'rgba(59,130,246,.12)',  ca:'59,130,246',  title:'Projets',    desc:'Réalisations en développement, électronique et mécanique.',       tags:['Dev','Elec','Meca'],     lvl:2 },
            { id:'stockage', emoji:'🗄️', bg:'rgba(139,92,246,.12)', ca:'139,92,246', title:'Stockage',   desc:'Fichiers PDF et sites web hébergés accessibles en ligne.',        tags:['PDF','Sites web'],       lvl:3 },
            { id:'test',     emoji:'⚙️', bg:'rgba(245,158,11,.12)', ca:'245,158,11', title:'Zone Admin', desc:'Administration, gestion des utilisateurs et outils système.',     tags:['Admin','Utilisateurs'],  lvl:4 },
        ];

        const html = cards.map(c => {
            const locked = !Auth.hasAccess(c.lvl);
            return `<div class="sec-card ${locked ? 'locked' : ''}"
                style="--ca: rgba(${c.ca},.18)"
                onclick="${locked ? `App.toast('Niveau ${c.lvl} requis','error')` : `App.navigate('${c.id}')`}">
                <div class="sc-badge">${badge(c.lvl)}</div>
                <div class="sc-icon" style="background:${c.bg};">${locked ? '🔒' : c.emoji}</div>
                <div class="sc-title">${c.title}</div>
                <div class="sc-desc">${c.desc}</div>
                <div class="sc-tags">${chips(c.tags)}</div>
            </div>`;
        }).join('');

        return `
        <div class="dash-greeting">
            <h1>${greet}, ${user.name} 👋</h1>
            <p>Niveau d'accès : ${badge(user.level)} &nbsp;—&nbsp; ${LVL_NAME[user.level]}</p>
        </div>
        <div class="dash-grid">${html}</div>`;
    },

    // ── Diplômes ──
    diplomes(tab = 'lycee') {
        if (!Auth.hasAccess(1)) return this._denied(1);
        const tabs = [
            { id:'lycee', lbl:'🎓 Lycée' },
            { id:'bts',   lbl:'🏫 BTS'   },
            { id:'ais',   lbl:'✅ AIS'   },
        ];

        const items = DATA.diplomes[tab] || [];
        const cards = items.map(d => `
            <div class="diploma-card" style="--da:${d.da};">
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
        const tabs = [
            { id:'dev',  lbl:'💻 Dev'  },
            { id:'elec', lbl:'⚡ Elec' },
            { id:'meca', lbl:'🔧 Meca' },
        ];

        const items = DATA.projets[tab] || [];
        const cards = items.map(p => {
            const codeBtn = p.github
                ? `<a href="${p.github}" target="_blank" class="link-btn">📁 Code</a>`
                : `<button class="link-btn" onclick="App.toast('Repo privé','info')">📁 Code</button>`;
            const demoBtn = p.demo
                ? `<a href="${p.demo}" target="_blank" class="link-btn">🌐 Demo</a>`
                : '';
            const dotClass = p.status === 'active' ? 'dot-active' : p.status === 'done' ? 'dot-done' : 'dot-wip';
            return `<div class="proj-card">
                <div class="proj-preview" style="--pp:${p.pp};">${p.emoji}</div>
                <div class="proj-body">
                    <div class="proj-title">${p.title}</div>
                    <div class="proj-desc">${p.desc}</div>
                    <div class="proj-chips">${chips(p.chips)}</div>
                    <div class="proj-footer">
                        <div class="proj-links">${codeBtn}${demoBtn}</div>
                        <div class="proj-status"><span class="dot ${dotClass}"></span>${p.slbl}</div>
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
        const tabs = [
            { id:'pdfs',  lbl:'📄 Fichiers PDF' },
            { id:'sites', lbl:'🌐 Sites web'     },
        ];

        let content = '';

        if (tab === 'pdfs') {
            const rows = DATA.stockage.pdfs.map(f => `
                <div class="file-item">
                    <div class="file-ico" style="background:rgba(239,68,68,.1);">${f.emoji}</div>
                    <div class="file-info">
                        <div class="file-name">${f.name}</div>
                        <div class="file-meta">${f.size} · ${f.date} · <span class="tag" style="border:none;background:none;padding:0;">${f.cat}</span></div>
                    </div>
                    <div class="file-acts">
                        <button class="btn sm" onclick="App.toast('Téléchargement simulé','success')">⬇ DL</button>
                        <button class="btn sm" onclick="App.toast('Aperçu non disponible en local','info')">👁</button>
                    </div>
                </div>`).join('');
            content = `<div class="file-list">${rows}</div>`;
        }

        if (tab === 'sites') {
            const rows = DATA.stockage.sites.map(s => {
                const dotCls = s.status === 'online' ? 'dot-active' : '';
                const lbl    = s.status === 'online' ? 'En ligne' : 'Hors ligne';
                return `<div class="site-card">
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
            }).join('');
            content = `<div class="site-grid">${rows}</div>`;
        }

        return `
        ${breadcrumb('Stockage')}
        ${sectionHeader('🗄️','rgba(139,92,246,.12)','Stockage','Fichiers et ressources en ligne')}
        ${renderTabs(tabs, tab, 'stockage')}
        ${content}`;
    },

    // ── Admin / Test ──
    test() {
        if (!Auth.hasAccess(4)) return this._denied(4);
        const users   = Auth.getUsers();
        const session = Auth.getSession();

        const userRows = users.map(u => `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td style="color:var(--muted);">${u.name}</td>
                <td>${badge(u.level)}</td>
                <td style="color:var(--muted);font-family:var(--mono);font-size:.78rem;">${u.created || '—'}</td>
                <td>
                    <div class="u-actions">
                        ${u.id !== session.id
                            ? `<button class="btn sm danger" onclick="App.deleteUser('${u.id}','${u.username}')">Supprimer</button>`
                            : `<span style="font-size:.75rem;color:var(--subtle);">Vous</span>`}
                    </div>
                </td>
            </tr>`).join('');

        const counts = {
            users:   users.length,
            admins:  users.filter(u => u.level === 4).length,
            projets: DATA.projets.dev.length + DATA.projets.elec.length + DATA.projets.meca.length,
            pdfs:    DATA.stockage.pdfs.length,
            sites:   DATA.stockage.sites.length,
            diplomes:Object.values(DATA.diplomes).flat().length,
        };

        const sysRows = [
            ['Version',       '1.0.0'],
            ['Navigateur',    navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)[/\s]([\d.]+)/)?.[0] || 'Inconnu'],
            ['Plateforme',    navigator.platform],
            ['Résolution',    `${screen.width}×${screen.height}`],
            ['Langue',        navigator.language],
            ['Fuseau horaire',Intl.DateTimeFormat().resolvedOptions().timeZone],
            ['Mémoire',       navigator.deviceMemory ? navigator.deviceMemory + ' Go' : 'Inconnu'],
            ['Stockage local',`${(JSON.stringify(localStorage).length / 1024).toFixed(1)} Ko utilisés`],
        ].map(([k,v]) => `<div class="sysinfo-row"><span class="sysinfo-key">${k}</span><span class="sysinfo-val">${v}</span></div>`).join('');

        return `
        ${breadcrumb('Zone Admin')}
        ${sectionHeader('⚙️','rgba(245,158,11,.12)','Administration','Gestion des utilisateurs et outils système')}

        <div class="admin-grid">

            <!-- Statistiques -->
            <div class="admin-card">
                <div class="admin-card-title">📊 Statistiques</div>
                <div class="stats-row">
                    <div class="stat-item"><div class="stat-val">${counts.users}</div><div class="stat-lab">Utilisateurs</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.admins}</div><div class="stat-lab">Admins</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.projets}</div><div class="stat-lab">Projets</div></div>
                </div>
                <div class="stats-row">
                    <div class="stat-item"><div class="stat-val">${counts.pdfs}</div><div class="stat-lab">PDFs</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.sites}</div><div class="stat-lab">Sites</div></div>
                    <div class="stat-item"><div class="stat-val">${counts.diplomes}</div><div class="stat-lab">Diplômes</div></div>
                </div>
            </div>

            <!-- Ajouter un utilisateur -->
            <div class="admin-card">
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

            <!-- Liste utilisateurs -->
            <div class="admin-card" style="grid-column:1/-1;">
                <div class="admin-card-title">👥 Utilisateurs (${users.length})</div>
                <div style="overflow-x:auto;">
                    <table class="users-table">
                        <thead><tr>
                            <th>Identifiant</th><th>Nom</th><th>Niveau</th><th>Créé le</th><th>Actions</th>
                        </tr></thead>
                        <tbody>${userRows}</tbody>
                    </table>
                </div>
            </div>

            <!-- Infos système -->
            <div class="admin-card">
                <div class="admin-card-title">🖥️ Informations système</div>
                <div class="sysinfo">${sysRows}</div>
            </div>

            <!-- Actions rapides -->
            <div class="admin-card">
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

    // ── Access Denied ──
    _denied(lvl) {
        return `<div class="access-denied">
            <div class="access-denied-ico">🔒</div>
            <h2>Accès restreint</h2>
            <p>Cette section nécessite le niveau ${badge(lvl)}.<br>Votre niveau actuel est insuffisant pour y accéder.</p>
            <button class="btn" onclick="App.navigate('dashboard')" style="padding:9px 20px;">← Retour à l'accueil</button>
        </div>`;
    },
};
