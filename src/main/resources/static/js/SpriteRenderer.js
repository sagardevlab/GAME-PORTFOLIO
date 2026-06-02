/**
 * SpriteRenderer.js
 * Draws all game objects using HTML5 Canvas 2D API.
 * Pure pixel art — no external image assets required.
 */
const SpriteRenderer = (() => {

    // ── Sky / Background ─────────────────────────────────────────
    function drawBackground(ctx, camX, canvasW, canvasH) {
        // Deep space gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
        grad.addColorStop(0,   '#0a0a1e');
        grad.addColorStop(0.6, '#0d1535');
        grad.addColorStop(1,   '#1a2a10');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }

    function drawStars(ctx, stars, camX, canvasW, canvasH, frame) {
        for (const s of stars) {
            // Parallax: stars move at 10% of camera speed
            const sx = ((s.x - camX * 0.1) % canvasW + canvasW) % canvasW;
            const tw = Math.sin(s.twinkle + frame * 0.03) * 0.4 + 0.6;
            ctx.globalAlpha = s.alpha * tw;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawClouds(ctx, clouds, camX, canvasW, frame) {
        for (const c of clouds) {
            // Clouds drift slowly
            const cx = ((c.x - camX * 0.25 + frame * c.speed * 0.5) % (canvasW + c.w + 400) + canvasW + c.w + 400) % (canvasW + c.w + 400) - c.w;
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#8899cc';
            // Draw puffy cloud with 3 ellipses
            ctx.beginPath();
            ctx.ellipse(cx,          c.y,      c.w * 0.4, c.w * 0.22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + c.w * 0.3, c.y - 6, c.w * 0.32, c.w * 0.19, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx - c.w * 0.25, c.y - 4, c.w * 0.28, c.w * 0.16, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ── Ground ───────────────────────────────────────────────────
    function drawGround(ctx, groundY, worldW, canvasH) {
        // Main ground block
        ctx.fillStyle = '#1a3a0a';
        ctx.fillRect(0, groundY, worldW, canvasH - groundY);

        // Top grass strip
        ctx.fillStyle = '#2d6a14';
        ctx.fillRect(0, groundY, worldW, 12);

        // Grass highlights
        ctx.fillStyle = '#3d8a20';
        for (let x = 0; x < worldW; x += 16) {
            ctx.fillRect(x, groundY, 8, 4);
        }

        // Ground texture dots
        ctx.fillStyle = '#153008';
        for (let x = 20; x < worldW; x += 48) {
            ctx.fillRect(x, groundY + 18, 6, 6);
            ctx.fillRect(x + 24, groundY + 30, 4, 4);
        }
    }

    // ── Platforms ────────────────────────────────────────────────
    function drawPlatforms(ctx, platforms) {
        for (const p of platforms) {
            // Platform body
            ctx.fillStyle = '#2a5a18';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            // Top grass
            ctx.fillStyle = '#3d8a20';
            ctx.fillRect(p.x, p.y, p.w, 5);
            // Highlight
            ctx.fillStyle = '#50aa28';
            ctx.fillRect(p.x + 2, p.y, p.w - 4, 2);
            // Shadow
            ctx.fillStyle = '#152808';
            ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);
        }
    }

    // ── Trees ─────────────────────────────────────────────────────
    function drawTrees(ctx, trees) {
        for (const t of trees) {
            // Trunk
            ctx.fillStyle = '#5c3d1e';
            ctx.fillRect(t.x + 8, t.y + t.h - 20, 10, 22);
            // Leaves (3 layers)
            ctx.fillStyle = '#1a6b10';
            ctx.beginPath();
            ctx.moveTo(t.x + 13, t.y);
            ctx.lineTo(t.x + 26, t.y + t.h * 0.5);
            ctx.lineTo(t.x,      t.y + t.h * 0.5);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#22881a';
            ctx.beginPath();
            ctx.moveTo(t.x + 13, t.y + t.h * 0.15);
            ctx.lineTo(t.x + 28, t.y + t.h * 0.65);
            ctx.lineTo(t.x - 2,  t.y + t.h * 0.65);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#2aaa22';
            ctx.beginPath();
            ctx.moveTo(t.x + 13, t.y + t.h * 0.35);
            ctx.lineTo(t.x + 27, t.y + t.h * 0.8);
            ctx.lineTo(t.x - 1,  t.y + t.h * 0.8);
            ctx.closePath();
            ctx.fill();
        }
    }

    // ── Bushes ────────────────────────────────────────────────────
    function drawBushes(ctx, bushes) {
        for (const b of bushes) {
            ctx.fillStyle = '#1a5e0a';
            ctx.beginPath();
            ctx.arc(b.x,      b.y, 14, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(b.x + 14, b.y, 12, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(b.x - 10, b.y, 10, Math.PI, 0);
            ctx.fill();
            // Highlight
            ctx.fillStyle = '#28881a';
            ctx.beginPath();
            ctx.arc(b.x - 4, b.y - 4, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ── Signs ─────────────────────────────────────────────────────
    function drawSigns(ctx, signs) {
        for (const s of signs) {
            // Post
            ctx.fillStyle = '#7a5c2e';
            ctx.fillRect(s.x + 18, s.y, 6, 36);
            // Board
            ctx.fillStyle = '#c8963c';
            ctx.fillRect(s.x, s.y - 2, 42, 20);
            ctx.fillStyle = '#a07430';
            ctx.fillRect(s.x, s.y + 16, 42, 2);
            // Text
            ctx.fillStyle = '#1a0a00';
            ctx.font = '5px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(s.text, s.x + 21, s.y + 12);
            ctx.textAlign = 'left';
        }
    }

    // ── Buildings ─────────────────────────────────────────────────
    function drawBuildings(ctx, buildings, nearBuilding, frame) {
        for (const b of buildings) {
            const isNear = nearBuilding && nearBuilding.id === b.id;
            const glow = isNear ? Math.sin(frame * 0.08) * 0.5 + 0.5 : 0;

            // Glow effect for nearby building
            if (isNear) {
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur  = 20 + glow * 15;
            }

            // Building body
            ctx.fillStyle = b.color || '#1e3a8a';
            ctx.fillRect(b.x, b.y, b.w, b.h);

            // Wall texture lines
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1;
            for (let ry = b.y + 16; ry < b.y + b.h - 10; ry += 16) {
                ctx.beginPath();
                ctx.moveTo(b.x + 4,      ry);
                ctx.lineTo(b.x + b.w - 4, ry);
                ctx.stroke();
            }

            // Roof
            ctx.fillStyle = shadeColor(b.color || '#1e3a8a', -30);
            ctx.beginPath();
            ctx.moveTo(b.x - 6,          b.y);
            ctx.lineTo(b.x + b.w / 2,    b.y - 28);
            ctx.lineTo(b.x + b.w + 6,    b.y);
            ctx.closePath();
            ctx.fill();

            // Roof trim
            ctx.fillStyle = shadeColor(b.color || '#1e3a8a', 20);
            ctx.fillRect(b.x, b.y, b.w, 4);

            // Door
            const doorW = 22, doorH = 34;
            const doorX  = b.x + (b.w - doorW) / 2;
            const doorY  = b.y + b.h - doorH;
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(doorX, doorY, doorW, doorH);
            ctx.fillStyle = '#1a1a2a';
            ctx.fillRect(doorX + 2, doorY + 2, doorW - 4, doorH - 2);

            // Door handle
            ctx.fillStyle = isNear ? '#ffd700' : '#888888';
            ctx.beginPath();
            ctx.arc(doorX + doorW - 6, doorY + doorH / 2, 3, 0, Math.PI * 2);
            ctx.fill();

            // Windows
            const winY = b.y + 18;
            [[b.x + 8, winY], [b.x + b.w - 24, winY]].forEach(([wx, wy]) => {
                ctx.fillStyle = isNear
                    ? `rgba(255,255,150,${0.6 + glow * 0.4})`
                    : 'rgba(200,220,255,0.3)';
                ctx.fillRect(wx, wy, 16, 14);
                // Cross
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.fillRect(wx + 7, wy, 2, 14);
                ctx.fillRect(wx, wy + 6, 16, 2);
            });

            // Label
            ctx.shadowBlur = 0;
            ctx.font = '5px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = isNear ? '#ffd700' : '#aaccff';
            if (isNear) {
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur  = 8;
            }
            // Wrap label if too long
            const labelText = b.label || b.id.toUpperCase();
            ctx.fillText(labelText, b.x + b.w / 2, b.y - 36);
            ctx.shadowBlur  = 0;
            ctx.shadowColor = 'transparent';
            ctx.textAlign   = 'left';
        }
    }

    // ── Coins ─────────────────────────────────────────────────────
    function drawCoins(ctx, coins, frame) {
        for (const c of coins) {
            if (c.collected) continue;
            const bob = Math.sin(frame * 0.1 + c.id) * 3;
            const spin = Math.abs(Math.sin(frame * 0.05 + c.id * 0.5));

            ctx.globalAlpha = 1;
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur  = 6;
            ctx.beginPath();
            ctx.ellipse(c.x, c.y + bob, 6 * spin + 1, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Shine
            if (spin > 0.5) {
                ctx.fillStyle = '#fff8aa';
                ctx.beginPath();
                ctx.ellipse(c.x - 2, c.y + bob - 2, 2 * spin, 3, -0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    // ── Player ────────────────────────────────────────────────────
    function drawPlayer(ctx, player, frame) {
        const s = player.getState();
        const facing = s.facing;
        const walking = s.isWalking;
        const jumping = s.isJumping;

        ctx.save();

        // Flip for direction
        if (facing === 'left') {
            ctx.translate(s.x + player.WIDTH, s.y);
            ctx.scale(-1, 1);
            ctx.translate(-player.WIDTH, 0);
        } else {
            ctx.translate(s.x, s.y);
        }

        const W = player.WIDTH;
        const H = player.HEIGHT;

        // Shadow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(W / 2, H + 2, W * 0.4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Body bob when walking
        const bob = (walking && !jumping) ? Math.sin(frame * 0.35) * 2 : 0;

        // ─── Pixel art character ───────────────────────────────
        // Legs
        const legAnim = (walking && !jumping) ? Math.sin(frame * 0.35) * 6 : 0;
        ctx.fillStyle = '#1a3a7a';
        // Left leg
        ctx.fillRect(W * 0.2, H * 0.65 + bob, W * 0.25, H * 0.35 - legAnim * 0.5);
        // Right leg
        ctx.fillRect(W * 0.55, H * 0.65 + bob, W * 0.25, H * 0.35 + legAnim * 0.5);

        // Shoes
        ctx.fillStyle = '#cc3333';
        ctx.fillRect(W * 0.15, H * 0.87 + bob - legAnim * 0.3, W * 0.28, 8);
        ctx.fillRect(W * 0.52, H * 0.87 + bob + legAnim * 0.3, W * 0.28, 8);

        // Body
        ctx.fillStyle = '#1155cc';
        ctx.fillRect(W * 0.15, H * 0.35 + bob, W * 0.7, H * 0.32);

        // Overalls pocket
        ctx.fillStyle = '#0a3a99';
        ctx.fillRect(W * 0.32, H * 0.42 + bob, W * 0.36, W * 0.2);

        // Arms
        const armSwing = (walking && !jumping) ? Math.sin(frame * 0.35) * 8 : 0;
        ctx.fillStyle = '#1155cc';
        // Left arm
        ctx.fillRect(W * 0.02, H * 0.36 + bob + armSwing * 0.3, W * 0.18, W * 0.18);
        // Right arm
        ctx.fillRect(W * 0.80, H * 0.36 + bob - armSwing * 0.3, W * 0.18, W * 0.18);

        // Hands
        ctx.fillStyle = '#f5c5a0';
        ctx.beginPath(); ctx.arc(W * 0.09, H * 0.51 + bob + armSwing * 0.4, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(W * 0.91, H * 0.51 + bob - armSwing * 0.4, 5, 0, Math.PI * 2); ctx.fill();

        // Head
        ctx.fillStyle = '#f5c5a0';
        ctx.fillRect(W * 0.2, H * 0.06 + bob, W * 0.6, W * 0.55);

        // Hair
        ctx.fillStyle = '#3a200a';
        ctx.fillRect(W * 0.18, H * 0.04 + bob, W * 0.64, W * 0.18);
        ctx.fillRect(W * 0.15, H * 0.10 + bob, W * 0.10, W * 0.22);

        // Eyes
        const blink = (frame % 120 > 115) ? 1 : 0;
        ctx.fillStyle = '#1a0a00';
        if (blink) {
            ctx.fillRect(W * 0.3, H * 0.16 + bob, W * 0.12, 2);
            ctx.fillRect(W * 0.56, H * 0.16 + bob, W * 0.12, 2);
        } else {
            ctx.beginPath(); ctx.arc(W * 0.36, H * 0.17 + bob, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(W * 0.64, H * 0.17 + bob, 4, 0, Math.PI * 2); ctx.fill();
            // Pupils
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(W * 0.37, H * 0.16 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(W * 0.65, H * 0.16 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Nose
        ctx.fillStyle = '#d4966e';
        ctx.fillRect(W * 0.46, H * 0.21 + bob, 5, 4);

        // Smile
        ctx.strokeStyle = '#a0704a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.24 + bob, 5, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Cap
        ctx.fillStyle = '#cc2222';
        ctx.fillRect(W * 0.15, H * 0.02 + bob, W * 0.7, W * 0.14);
        ctx.fillRect(W * 0.12, H * 0.08 + bob, W * 0.76, W * 0.08);
        // Cap brim
        ctx.fillRect(W * 0.08, H * 0.14 + bob, W * 0.85, W * 0.06);
        // Cap letter "S"
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${W * 0.2}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('S', W * 0.5, H * 0.1 + bob + W * 0.12);
        ctx.textAlign = 'left';

        // Jump dust
        if (jumping) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 3; i++) {
                const px = W * (0.2 + i * 0.3);
                const py = H + Math.sin(frame * 0.2 + i) * 4;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    // ── Coin count HUD element on canvas ─────────────────────────
    function drawCoinCounter(ctx, coins, camX, camY) {
        // Drawn in screen space (before camera transform)
    }

    // ── ENTER prompt on canvas ────────────────────────────────────
    function drawEnterPrompt(ctx, building, frame, canvasW, canvasH) {
        if (!building) return;
        const alpha = Math.abs(Math.sin(frame * 0.06));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fillText('[ ENTER ] to enter', canvasW / 2, canvasH - 30);
        ctx.restore();
    }

    // ── Helpers ───────────────────────────────────────────────────
    function shadeColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + percent));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
        const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
        return `rgb(${r},${g},${b})`;
    }

    return {
        drawBackground,
        drawStars,
        drawClouds,
        drawGround,
        drawPlatforms,
        drawTrees,
        drawBushes,
        drawSigns,
        drawBuildings,
        drawCoins,
        drawPlayer,
        drawEnterPrompt,
    };
})();
