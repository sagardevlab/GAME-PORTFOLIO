/**
 * DialogManager.js
 * Opens, populates, and closes the dialog overlay panels.
 */
const DialogManager = (() => {

    const overlay  = document.getElementById('dialog-overlay');
    const box      = document.getElementById('dialog-box');
    const iconEl   = document.getElementById('dialog-icon');
    const titleEl  = document.getElementById('dialog-title');
    const bodyEl   = document.getElementById('dialog-body');
    const closeBtn = document.getElementById('dialog-close');

    let isOpen = false;
    let onCloseCb = null;

    // Cached data
    const cache = { stats: null, projects: null, skills: null, trophies: null };

    // Zone config
    const zones = {
        HOME:     { icon: '🏠', title: 'HOME BASE — Sagar Mehla' },
        PROJECTS: { icon: '🏰', title: 'PROJECTS CASTLE' },
        SKILLS:   { icon: '⚔️', title: 'SKILLS DUNGEON' },
        TROPHIES: { icon: '🏆', title: 'TROPHY HALL' },
        CONTACT:  { icon: '📡', title: 'CONTACT HQ' },
    };

    closeBtn.addEventListener('click', close);

    function open(zone, onClose) {
        if (isOpen) return;
        onCloseCb = onClose || null;
        isOpen    = true;

        const cfg = zones[zone] || { icon: '📜', title: zone };
        iconEl.textContent  = cfg.icon;
        titleEl.textContent = cfg.title;

        // Show loading immediately
        bodyEl.innerHTML = UIBuilder.buildLoading('Entering ' + cfg.title + '...');
        overlay.classList.remove('hidden');
        AudioManager.play('enter');

        // Load content async
        loadZone(zone);
    }

    async function loadZone(zone) {
        try {
            switch (zone) {
                case 'HOME': {
                    if (!cache.stats) cache.stats = await ApiClient.getPlayerStats();
                    bodyEl.innerHTML = UIBuilder.buildHome(cache.stats);
                    break;
                }
                case 'PROJECTS': {
                    if (!cache.projects) cache.projects = await ApiClient.getProjects();
                    bodyEl.innerHTML = UIBuilder.buildProjects(cache.projects);
                    break;
                }
                case 'SKILLS': {
                    if (!cache.skills) cache.skills = await ApiClient.getSkills();
                    bodyEl.innerHTML = UIBuilder.buildSkills(cache.skills);
                    // Animate bars in after render
                    setTimeout(() => {
                        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                            const level = bar.dataset.level;
                            bar.style.width = '0%';
                            requestAnimationFrame(() => {
                                bar.style.transition = 'width 0.8s ease';
                                bar.style.width = level + '%';
                            });
                        });
                    }, 50);
                    break;
                }
                case 'TROPHIES': {
                    if (!cache.trophies) cache.trophies = await ApiClient.getTrophies();
                    bodyEl.innerHTML = UIBuilder.buildTrophies(cache.trophies);
                    AudioManager.play('powerup');
                    break;
                }
                case 'CONTACT': {
                    if (!cache.stats) cache.stats = await ApiClient.getPlayerStats();
                    bodyEl.innerHTML = UIBuilder.buildContact(cache.stats);
                    break;
                }
                default:
                    bodyEl.innerHTML = '<p style="color:#ff4466;font-size:0.6rem;">Unknown zone!</p>';
            }
        } catch (err) {
            bodyEl.innerHTML = `
                <div style="padding:2rem;text-align:center;color:#ff4466;font-size:0.55rem;">
                    ❌ Failed to load: ${err.message}<br><br>
                    <button onclick="DialogManager.retry('${zone}')" class="btn-pixel" style="margin-top:1rem;">🔄 RETRY</button>
                </div>`;
            AudioManager.play('error');
        }
    }

    function retry(zone) {
        // Clear cache for this zone
        if (zone === 'PROJECTS') cache.projects = null;
        if (zone === 'SKILLS')   cache.skills   = null;
        if (zone === 'TROPHIES') cache.trophies = null;
        bodyEl.innerHTML = UIBuilder.buildLoading('Retrying...');
        loadZone(zone);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        overlay.classList.add('hidden');
        AudioManager.play('exit');
        if (onCloseCb) { onCloseCb(); onCloseCb = null; }
    }

    function isDialogOpen() { return isOpen; }

    return { open, close, retry, isDialogOpen };
})();
