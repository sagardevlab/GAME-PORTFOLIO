/**
 * UIBuilder.js
 * Builds the HTML content injected into dialog panels.
 */
const UIBuilder = (() => {

    // ── HOME ──────────────────────────────────────────────────────
    function buildHome(stats) {
        return `
        <div class="home-panel">
            <div class="home-hero">
                <div class="home-avatar">👨‍💻</div>
                <div class="home-info">
                    <div class="home-name">${stats.name || 'SAGAR MEHLA'}</div>
                    <div class="home-role">${stats.title || 'Software Developer @ SAP Labs'}</div>
                    <div class="home-loc">📍 ${stats.location || 'Bengaluru, India 🇮🇳'}</div>
                </div>
            </div>

            <p class="home-bio">
                Hey there, adventurer! 👋 I'm a software developer at SAP Labs India,
                passionate about building scalable backends, crafting CI/CD pipelines,
                and exploring the frontiers of AI-assisted development.
                Walk around my world — enter buildings to discover my work!
            </p>

            <div class="home-stats-grid">
                <div class="stat-box">
                    <span class="stat-val">⚡ ${stats.level || 17}</span>
                    <span class="stat-lbl">LEVEL</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val">🏗️ ${stats.projectCount || 5}</span>
                    <span class="stat-lbl">PROJECTS</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val">🎯 ${stats.skillCount || 24}</span>
                    <span class="stat-lbl">SKILLS</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val">🏆 ${stats.trophyCount || 10}</span>
                    <span class="stat-lbl">TROPHIES</span>
                </div>
            </div>

            <div class="home-links">
                <a class="home-link" href="${stats.github || 'https://github.com/sagardevlab'}" target="_blank" rel="noopener">
                    🐙 GitHub
                </a>
                <a class="home-link" href="${stats.linkedin || 'https://www.linkedin.com/in/sagarmehla/'}" target="_blank" rel="noopener">
                    🔵 LinkedIn
                </a>
                <a class="home-link" href="mailto:${stats.email || 'sagar.dev.lab@gmail.com'}">
                    ✉️ Email
                </a>
            </div>

            <p style="font-family:'VT323',monospace;font-size:1rem;color:#8888bb;margin-top:0.5rem;">
                💡 TIP: Use arrow keys / WASD to move. Jump with W or ↑. Press ENTER near a building to explore!
            </p>
        </div>`;
    }

    // ── PROJECTS ──────────────────────────────────────────────────
    function buildProjects(projects) {
        if (!projects || projects.length === 0) {
            return '<div class="dialog-loading"><div class="spinner"></div><p>Loading quests...</p></div>';
        }

        const cards = projects.map(p => `
            <div class="project-card" style="--card-color:${p.color || '#00e5ff'}" onclick="window.open('${p.githubUrl}','_blank')">
                <span class="status-badge status-${p.status}">${p.status === 'LIVE' ? '● LIVE' : p.status === 'IN_PROGRESS' ? '◑ WIP' : '○ ARCHIVED'}</span>
                <span class="project-icon">${p.icon || '📦'}</span>
                <div class="project-title">${p.title}</div>
                <div class="project-desc">${p.description}</div>
                <div class="project-tags">
                    ${(p.techStack || []).slice(0, 5).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="project-footer">
                    ${p.githubUrl ? `<a class="btn-pixel primary" href="${p.githubUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🐙 GitHub</a>` : ''}
                    ${p.liveUrl  ? `<a class="btn-pixel" href="${p.liveUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🌐 Live</a>` : ''}
                </div>
            </div>
        `).join('');

        return `
        <div style="margin-bottom:0.75rem;font-family:'VT323',monospace;font-size:1.1rem;color:#8888bb;">
            ${projects.length} quests completed. Click any card to view on GitHub!
        </div>
        <div class="projects-grid">${cards}</div>`;
    }

    // ── SKILLS ────────────────────────────────────────────────────
    function buildSkills(skills) {
        if (!skills || skills.length === 0) {
            return '<div class="dialog-loading"><div class="spinner"></div><p>Loading skills...</p></div>';
        }

        const categories = ['ALL', ...new Set(skills.map(s => s.category))];
        const activeTab = 'ALL';

        const tabs = categories.map(cat =>
            `<button class="skill-tab ${cat === activeTab ? 'active' : ''}" onclick="UIBuilder.filterSkills('${cat}', this)">${cat}</button>`
        ).join('');

        const rows = skills.map(s => `
            <div class="skill-row" data-cat="${s.category}">
                <span class="skill-icon-col">${s.icon || '⚡'}</span>
                <span class="skill-name-col rank-${s.rank || 'COMMON'}">${s.name}</span>
                <div class="skill-bar-wrap">
                    <div class="skill-bar-fill" style="width:${s.level}%;background-color:${s.color || '#00e5ff'};color:${s.color || '#00e5ff'}" data-level="${s.level}"></div>
                </div>
                <span class="skill-xp-col">${s.level}/100</span>
            </div>
        `).join('');

        return `
        <div class="skills-tabs" id="skills-tabs">${tabs}</div>
        <div class="skills-list" id="skills-list">${rows}</div>`;
    }

    function filterSkills(cat, btn) {
        // Update tabs
        document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        // Filter rows
        document.querySelectorAll('.skill-row').forEach(row => {
            row.style.display = (cat === 'ALL' || row.dataset.cat === cat) ? 'grid' : 'none';
        });
        AudioManager.play('hover');
    }

    // ── TROPHIES ──────────────────────────────────────────────────
    function buildTrophies(trophies) {
        if (!trophies || trophies.length === 0) {
            return '<div class="dialog-loading"><div class="spinner"></div><p>Loading trophies...</p></div>';
        }

        const cards = trophies.map(t => `
            <div class="trophy-card rarity-${t.rarity}">
                <span class="rarity-label">${t.rarity}</span>
                <span class="trophy-icon">${t.icon || '🏆'}</span>
                <div class="trophy-title">${t.title}</div>
                <div class="trophy-desc">${t.description}</div>
                <div class="trophy-year">${t.earnedAt ? `Earned: ${t.earnedAt}` : ''}</div>
            </div>
        `).join('');

        const platinum = trophies.filter(t => t.rarity === 'PLATINUM').length;
        const gold     = trophies.filter(t => t.rarity === 'GOLD').length;
        const silver   = trophies.filter(t => t.rarity === 'SILVER').length;
        const bronze   = trophies.filter(t => t.rarity === 'BRONZE').length;

        return `
        <div style="display:flex;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;">
            <span style="font-size:0.45rem;color:#00e5ff;">💎 ${platinum} Platinum</span>
            <span style="font-size:0.45rem;color:#ffd700;">🥇 ${gold} Gold</span>
            <span style="font-size:0.45rem;color:#aaaaaa;">🥈 ${silver} Silver</span>
            <span style="font-size:0.45rem;color:#cd7f32;">🥉 ${bronze} Bronze</span>
        </div>
        <div class="trophies-grid">${cards}</div>`;
    }

    // ── CONTACT ───────────────────────────────────────────────────
    function buildContact(stats) {
        return `
        <div class="contact-panel">
            <p class="contact-intro">
                📡 Transmit a message to Sagar's headquarters!
                Whether it's a job quest, collaboration raid, or just to say hey —
                the communication channel is open. 🎮
            </p>

            <form class="contact-form" id="contact-form" onsubmit="UIBuilder.submitContact(event)">
                <div class="form-row">
                    <label class="form-label" for="cf-name">YOUR NAME *</label>
                    <input class="form-input" id="cf-name" name="name" type="text" placeholder="Hero name..." maxlength="100" required />
                </div>
                <div class="form-row">
                    <label class="form-label" for="cf-email">YOUR EMAIL *</label>
                    <input class="form-input" id="cf-email" name="email" type="email" placeholder="hero@guild.com" maxlength="150" required />
                </div>
                <div class="form-row">
                    <label class="form-label" for="cf-subject">SUBJECT *</label>
                    <input class="form-input" id="cf-subject" name="subject" type="text" placeholder="Quest title..." maxlength="150" required />
                </div>
                <div class="form-row">
                    <label class="form-label" for="cf-message">MESSAGE *</label>
                    <textarea class="form-textarea" id="cf-message" name="message" placeholder="Describe your quest..." maxlength="2000" required></textarea>
                </div>
                <div id="cf-error" class="form-error" style="display:none;"></div>
                <button class="btn-submit" id="cf-submit" type="submit">⚡ SEND MESSAGE</button>
            </form>

            <div class="contact-socials">
                <a class="home-link" href="${stats && stats.github ? stats.github : 'https://github.com/sagardevlab'}" target="_blank" rel="noopener">🐙 GitHub</a>
                <a class="home-link" href="${stats && stats.linkedin ? stats.linkedin : 'https://www.linkedin.com/in/sagarmehla/'}" target="_blank" rel="noopener">🔵 LinkedIn</a>
                <a class="home-link" href="mailto:${stats && stats.email ? stats.email : 'sagar.dev.lab@gmail.com'}">✉️ Email</a>
            </div>
        </div>`;
    }

    async function submitContact(e) {
        e.preventDefault();
        const form    = document.getElementById('contact-form');
        const btn     = document.getElementById('cf-submit');
        const errDiv  = document.getElementById('cf-error');

        const data = {
            name:    document.getElementById('cf-name').value.trim(),
            email:   document.getElementById('cf-email').value.trim(),
            subject: document.getElementById('cf-subject').value.trim(),
            message: document.getElementById('cf-message').value.trim(),
        };

        btn.disabled = true;
        btn.textContent = '⏳ SENDING...';
        errDiv.style.display = 'none';

        try {
            await ApiClient.submitContact(data);
            AudioManager.play('success');
            form.innerHTML = `
                <div style="text-align:center;padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;">
                    <span style="font-size:3rem;">🎉</span>
                    <p style="font-size:0.6rem;color:#00ff88;">MESSAGE SENT!</p>
                    <p style="font-family:'VT323',monospace;font-size:1.1rem;color:#8888bb;">
                        Sagar has received your transmission. Expect a reply soon!
                    </p>
                </div>`;
            Toast.show('Message sent! Sagar will reply soon 🎮', 'success');
        } catch (err) {
            AudioManager.play('error');
            errDiv.textContent = '❌ ' + (err.message || 'Failed to send. Please try again.');
            errDiv.style.display = 'block';
            btn.disabled = false;
            btn.textContent = '⚡ SEND MESSAGE';
        }
    }

    // ── Loading placeholder ───────────────────────────────────────
    function buildLoading(msg = 'Loading...') {
        return `<div class="dialog-loading"><div class="spinner"></div><p>${msg}</p></div>`;
    }

    return {
        buildHome,
        buildProjects,
        buildSkills,
        buildTrophies,
        buildContact,
        buildLoading,
        filterSkills,
        submitContact,
    };
})();
