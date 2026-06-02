/**
 * Camera.js
 * Smooth scrolling camera that follows the player.
 */
const Camera = (() => {

    let x = 0;
    let y = 0;
    let targetX = 0;
    const LERP = 0.1;

    function update(playerX, playerY, canvasW, canvasH) {
        targetX = playerX - canvasW / 2 + Player.WIDTH / 2;
        targetX = Math.max(0, Math.min(GameMap.WORLD_W - canvasW, targetX));
        x += (targetX - x) * LERP;
        x = Math.max(0, Math.min(GameMap.WORLD_W - canvasW, x));
        y = 0;
    }

    function getX() { return Math.floor(x); }
    function getY() { return Math.floor(y); }

    function applyTransform(ctx) {
        ctx.translate(-getX(), -getY());
    }

    return { update, getX, getY, applyTransform };
})();
