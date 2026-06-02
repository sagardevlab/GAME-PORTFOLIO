/**
 * GameMap.js
 * Defines the game world: ground, platforms, buildings, decorations.
 */
const GameMap = (() => {

    const TILE = 32;
    const WORLD_W = 3200;
    const WORLD_H = 600;
    const GROUND_Y = 460;

    const buildings = [
        {
            id: 'home',
            label: '🏠 HOME BASE',
            x: 80,
            y: GROUND_Y - 110,
            w: 100,
            h: 110,
            color: '#1e3a8a',
            zone: 'HOME',
        },
        {
            id: 'projects',
            label: '🏰 PROJECTS',
            x: 420,
            y: GROUND_Y - 115,
            w: 120,
            h: 115,
            color: '#7c3aed',
            zone: 'PROJECTS',
        },
        {
            id: 'skills',
            label: '⚔️ SKILLS',
            x: 900,
            y: GROUND_Y - 115,
            w: 110,
            h: 115,
            color: '#065f46',
            zone: 'SKILLS',
        },
        {
            id: 'trophies',
            label: '🏆 TROPHIES',
            x: 1400,
            y: GROUND_Y - 115,
            w: 130,
            h: 115,
            color: '#92400e',
            zone: 'TROPHIES',
        },
        {
            id: 'contact',
            label: '📡 CONTACT',
            x: 1920,
            y: GROUND_Y - 115,
            w: 120,
            h: 115,
            color: '#0e7490',
            zone: 'CONTACT',
        },
    ];

    const platforms = [
        { x: 300,  y: GROUND_Y - 70,  w: 80,  h: 16 },
        { x: 560,  y: GROUND_Y - 100, w: 80,  h: 16 },
        { x: 240,  y: GROUND_Y - 130, w: 60,  h: 16 },
        { x: 760,  y: GROUND_Y - 80,  w: 70,  h: 16 },
        { x: 850,  y: GROUND_Y - 140, w: 60,  h: 16 },
        { x: 1040, y: GROUND_Y - 90,  w: 80,  h: 16 },
        { x: 1150, y: GROUND_Y - 80,  w: 80,  h: 16 },
        { x: 1250, y: GROUND_Y - 120, w: 60,  h: 16 },
        { x: 1340, y: GROUND_Y - 70,  w: 70,  h: 16 },
        { x: 1570, y: GROUND_Y - 80,  w: 80,  h: 16 },
        { x: 1650, y: GROUND_Y - 130, w: 60,  h: 16 },
        { x: 1720, y: GROUND_Y - 75,  w: 70,  h: 16 },
        { x: 1820, y: GROUND_Y - 100, w: 80,  h: 16 },
        { x: 2080, y: GROUND_Y - 80,  w: 80,  h: 16 },
        { x: 2180, y: GROUND_Y - 130, w: 60,  h: 16 },
        { x: 2300, y: GROUND_Y - 80,  w: 100, h: 16 },
    ];

    const coins = [];
    for (let i = 0; i < 40; i++) {
        coins.push({
            x: 200 + i * 72,
            y: GROUND_Y - 60 - (i % 5) * 30,
            collected: false,
            id: i,
        });
    }

    const signs = [
        { x: 200,  y: GROUND_Y - 42, text: 'MY WORK' },
        { x: 680,  y: GROUND_Y - 42, text: 'SKILLS' },
        { x: 1180, y: GROUND_Y - 42, text: 'AWARDS' },
        { x: 1700, y: GROUND_Y - 42, text: 'CONTACT' },
    ];

    const trees = [
        { x: 160, y: GROUND_Y - 70, h: 70 },
        { x: 680, y: GROUND_Y - 70, h: 65 },
        { x: 820, y: GROUND_Y - 60, h: 55 },
        { x: 1100, y: GROUND_Y - 70, h: 70 },
        { x: 1200, y: GROUND_Y - 60, h: 55 },
        { x: 1600, y: GROUND_Y - 70, h: 65 },
        { x: 1750, y: GROUND_Y - 60, h: 60 },
        { x: 2100, y: GROUND_Y - 70, h: 70 },
        { x: 2250, y: GROUND_Y - 65, h: 60 },
        { x: 2450, y: GROUND_Y - 70, h: 65 },
    ];

    const bushes = [
        { x: 220, y: GROUND_Y - 20 },
        { x: 370, y: GROUND_Y - 20 },
        { x: 600, y: GROUND_Y - 20 },
        { x: 790, y: GROUND_Y - 20 },
        { x: 1050, y: GROUND_Y - 20 },
        { x: 1300, y: GROUND_Y - 20 },
        { x: 1560, y: GROUND_Y - 20 },
        { x: 1780, y: GROUND_Y - 20 },
        { x: 2000, y: GROUND_Y - 20 },
        { x: 2200, y: GROUND_Y - 20 },
    ];

    const clouds = [];
    for (let i = 0; i < 18; i++) {
        clouds.push({
            x: 100 + i * 175 + Math.random() * 80,
            y: 40  + Math.random() * 120,
            w: 80  + Math.random() * 60,
            speed: 0.2 + Math.random() * 0.3
        });
    }

    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * WORLD_W,
            y: Math.random() * WORLD_H * 0.7,
            r: 0.5 + Math.random() * 1.5,
            alpha: 0.3 + Math.random() * 0.7,
            twinkle: Math.random() * Math.PI * 2
        });
    }

    function getBuildingNearPlayer(playerX, playerY, threshold = 85) {
        for (const b of buildings) {
            const cx = b.x + b.w / 2;
            const cy = b.y + b.h / 2;
            const dist = Math.hypot(playerX + 20 - cx, playerY + 26 - cy);
            if (dist < threshold) return b;
        }
        return null;
    }

    function getPlatformAt(px, py, pw, ph) {
        for (const plat of platforms) {
            const playerBottom = py + ph;
            const onTop = playerBottom >= plat.y && playerBottom <= plat.y + plat.h + 6;
            const horizontalOverlap = px + pw > plat.x + 2 && px < plat.x + plat.w - 2;
            if (onTop && horizontalOverlap) return plat;
        }
        return null;
    }

    function isOnGround(py, ph) {
        return (py + ph) >= GROUND_Y;
    }

    function clampX(x, playerW) {
        return Math.max(0, Math.min(WORLD_W - playerW, x));
    }

    return {
        WORLD_W, WORLD_H, GROUND_Y, TILE,
        buildings, platforms, coins,
        signs, trees, bushes, clouds, stars,
        getBuildingNearPlayer,
        getPlatformAt,
        isOnGround,
        clampX,
    };
})();
