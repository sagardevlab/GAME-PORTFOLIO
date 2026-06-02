/**
 * GameEngine.js
 * Main game loop — initialises everything and drives the frame tick.
 */
(function () {

    // ── Elements ──────────────────────────────────────────────────
    const canvas       = document.getElementById('gameCanvas');
    const ctx          = canvas.getContext('2d');
    const loadScreen   = document.getElementById('loading-screen');
    const loadBar      = document.getElementById('loading-bar');
    const loadTip      = document.getElementById('loading-tip');
    const pressStart   = document.getElementById('press-start-text');
    const hud          = document.getElementById('hud');
    const hudZone      = document.getElementById('hud-zone');
    const hudXpFill    = document.getElementById('hud-xp-fill');
    const hudXpText    = document.getElementById('hud-xp-text');
    const hudMobileCtrl= document.getElementById('mobile-controls');
    const muteBtn      = document.getElementById('mute-btn');
    const helpBtn      = document.getElementById('help-btn');
    const helpModal    = document.getElementById('help-modal');
    const helpClose    = document.getElementById('help-close');
    const enterPromptEl= document.getElementById('enter-prompt') || createEnterPrompt();

    function createEnterPrompt() {
        const el = document.createElement('div');
        el.id = 'enter-prompt';
        el.className = 'hidden';
        el.textContent = '[ ENTER ] to explore';
        document.body.appendChild(el);
        return el;
    }

    // ── State ─────────────────────────────────────────────────────
    let frame       = 0;
    let started     = false;
    let loaded      = false;
    let nearBuilding = null;
    let currentZone = '🗺️ WORLD MAP';
    let animId      = null;

    // Loading tips
    const tips = [
        'Initialising game world...',
        'Loading pixel sprites...',
        'Tuning the chiptune engine...',
        'Placing buildings...',
        'Scattering coins...',
        'Recruiting the hero...',
        'Ready to play!',
    ];

    // ── Resize canvas ─────────────────────────────────────────────
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight - 60; // below HUD
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Toast helper ──────────────────────────────────────────────
    window.Toast = {
        show(msg, type = 'info', duration = 3500) {
            const container = document.getElementById('toast-container');
            const el = document.createElement('div');
            el.className = `toast ${type}`;
            el.textContent = msg;
            container.appendChild(el);
            setTimeout(() => {
                el.classList.add('fade-out');
                setTimeout(() => el.remove(), 300);
            }, duration);
        }
    };

    // ── Loading sequence ──────────────────────────────────────────
    let loadPct = 0;
    const loadInterval = setInterval(() => {
        loadPct = Math.min(loadPct + Math.random() * 18 + 5, 98);
        loadBar.style.width = loadPct + '%';
        const tipIdx = Math.floor((loadPct / 100) * (tips.length - 1));
        loadTip.textContent = tips[tipIdx];

        if (loadPct >= 98) {
            clearInterval(loadInterval);
            loadBar.style.width = '100%';
            loadTip.textContent = 'Ready!';
            setTimeout(() => {
                loaded = true;
                pressStart.style.display = 'block';
            }, 400);
        }
    }, 120);

    function startGame() {
        if (!loaded || started) return;
        started = true;
        AudioManager.init();
        AudioManager.play('select');

        loadScreen.classList.add('fade-out');
        setTimeout(() => {
            loadScreen.style.display = 'none';
            hud.classList.remove('hidden');
            if (isMobile()) hudMobileCtrl.classList.remove('hidden');

            // XP bar from server
            const ps = window.PLAYER_STATS || {};
            const xp = ps.xp || 8750;
            const maxXp = ps.maxXp || 10000;
            hudXpFill.style.width = ((xp / maxXp) * 100) + '%';
            hudXpText.textContent = `XP: ${xp} / ${maxXp}`;

            gameLoop();
        }, 600);
    }

    // ── Keyboard input ────────────────────────────────────────────
    const KEY_MAP = {
        ArrowLeft: 'left',  a: 'left',  A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
        ArrowUp: 'up',    w: 'up',    W: 'up',   ' ': 'up',
        ArrowDown: 'down',  s: 'down',  S: 'down',
        Enter: 'action',
    };

    document.addEventListener('keydown', (e) => {
        if (!started) { startGame(); return; }

        // ESC closes dialog
        if (e.key === 'Escape') {
            if (DialogManager.isDialogOpen()) { DialogManager.close(); return; }
            if (!helpModal.classList.contains('hidden')) { helpModal.classList.add('hidden'); return; }
            return;
        }

        if (DialogManager.isDialogOpen()) return;

        const dir = KEY_MAP[e.key];
        if (dir) {
            e.preventDefault();
            Player.setKey(dir, true);
        }
    });

    document.addEventListener('keyup', (e) => {
        const dir = KEY_MAP[e.key];
        if (dir) Player.setKey(dir, false);
    });

    // ── Mobile touch controls ─────────────────────────────────────
    function bindMobileBtn(id, dir) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('touchstart', (e) => { e.preventDefault(); Player.setKey(dir, true); AudioManager.resume(); }, { passive: false });
        el.addEventListener('touchend',   (e) => { e.preventDefault(); Player.setKey(dir, false); }, { passive: false });
        el.addEventListener('mousedown',  () => Player.setKey(dir, true));
        el.addEventListener('mouseup',    () => Player.setKey(dir, false));
    }
    bindMobileBtn('btn-left',   'left');
    bindMobileBtn('btn-right',  'right');
    bindMobileBtn('btn-up',     'up');
    bindMobileBtn('btn-down',   'down');
    bindMobileBtn('btn-jump',   'up');
    bindMobileBtn('btn-action', 'action');

    // ── Any key / tap to start ────────────────────────────────────
    document.addEventListener('click',      () => startGame());
    document.addEventListener('touchstart', () => startGame(), { passive: true });

    // ── Mute button ───────────────────────────────────────────────
    muteBtn.addEventListener('click', () => {
        const muted = AudioManager.toggleMute();
        muteBtn.textContent = muted ? '🔇' : '🔊';
        Toast.show(muted ? 'Sound OFF' : 'Sound ON', 'info', 1500);
    });

    // ── Help modal ────────────────────────────────────────────────
    helpBtn.addEventListener('click', () => {
        helpModal.classList.toggle('hidden');
        AudioManager.play('hover');
    });
    helpClose.addEventListener('click', () => {
        helpModal.classList.add('hidden');
        AudioManager.play('select');
    });

    // ── Utility ───────────────────────────────────────────────────
    function isMobile() {
        return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
    }

    // ── Game loop ─────────────────────────────────────────────────
    function gameLoop() {
        animId = requestAnimationFrame(gameLoop);
        frame++;

        if (!DialogManager.isDialogOpen()) {
            Player.update();
        }

        const ps     = Player.getState();
        const canvasW = canvas.width;
        const canvasH = canvas.height;

        Camera.update(ps.x, ps.y, canvasW, canvasH);

        // ── Check for building proximity ─────────────────────────
        const prevBuilding = nearBuilding;
        nearBuilding = GameMap.getBuildingNearPlayer(ps.x, ps.y);

        if (nearBuilding && !prevBuilding) {
            Toast.show('Press ENTER to enter ' + (nearBuilding.label || nearBuilding.id), 'info', 2000);
            AudioManager.play('hover');
        }

        // Show/hide enter prompt
        if (nearBuilding) {
            enterPromptEl.classList.remove('hidden');
            enterPromptEl.textContent = `[ ENTER ] ${nearBuilding.label || nearBuilding.id}`;
        } else {
            enterPromptEl.classList.add('hidden');
        }

        // ── Handle ENTER action ──────────────────────────────────
        if (!DialogManager.isDialogOpen() && nearBuilding && Player.consumeAction()) {
            DialogManager.open(nearBuilding.zone);
        }

        // ── HUD zone label ────────────────────────────────────────
        if (nearBuilding) {
            hudZone.textContent = (nearBuilding.label || nearBuilding.id);
        } else {
            // Determine zone from X position
            const px = ps.x;
            if      (px < 300)  hudZone.textContent = '🗺️ WORLD MAP';
            else if (px < 700)  hudZone.textContent = '🏰 PROJECTS ZONE';
            else if (px < 1200) hudZone.textContent = '⚔️ SKILLS ZONE';
            else if (px < 1700) hudZone.textContent = '🏆 TROPHY ZONE';
            else if (px < 2200) hudZone.textContent = '📡 CONTACT ZONE';
            else                hudZone.textContent = '🌌 THE BEYOND';
        }

        // ── Draw ──────────────────────────────────────────────────
        ctx.clearRect(0, 0, canvasW, canvasH);

        // Background (screen space)
        SpriteRenderer.drawBackground(ctx, Camera.getX(), canvasW, canvasH);
        SpriteRenderer.drawStars(ctx, GameMap.stars, Camera.getX(), canvasW, canvasH, frame);
        SpriteRenderer.drawClouds(ctx, GameMap.clouds, Camera.getX(), canvasW, frame);

        // Apply camera transform for world-space objects
        ctx.save();
        Camera.applyTransform(ctx);

        SpriteRenderer.drawGround(ctx, GameMap.GROUND_Y, GameMap.WORLD_W, canvasH);
        SpriteRenderer.drawPlatforms(ctx, GameMap.platforms);
        SpriteRenderer.drawTrees(ctx, GameMap.trees);
        SpriteRenderer.drawBushes(ctx, GameMap.bushes);
        SpriteRenderer.drawSigns(ctx, GameMap.signs);
        SpriteRenderer.drawBuildings(ctx, GameMap.buildings, nearBuilding, frame);
        SpriteRenderer.drawCoins(ctx, GameMap.coins, frame);
        SpriteRenderer.drawPlayer(ctx, Player, frame);

        ctx.restore();

        // Screen-space overlays
        SpriteRenderer.drawEnterPrompt(ctx, nearBuilding, frame, canvasW, canvasH);

        // Coin counter in corner
        const collected = GameMap.coins.filter(c => c.collected).length;
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'right';
        ctx.fillText(`🪙 ${ps.coins}/${GameMap.coins.length}`, canvasW - 10, 24);
        ctx.textAlign = 'left';
    }

})();
