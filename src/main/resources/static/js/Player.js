/**
 * Player.js
 * Manages player state, physics, movement, and animation.
 */
const Player = (() => {

    const WIDTH  = 40;
    const HEIGHT = 52;

    const SPEED     = 3.5;
    const JUMP_VEL  = -13;
    const GRAVITY   = 0.5;
    const MAX_FALL  = 16;

    let state = {
        x: 60,
        y: GameMap.GROUND_Y - HEIGHT,
        vx: 0,
        vy: 0,
        facing: 'right',
        isJumping: false,
        isWalking: false,
        frame: 0,
        stepTimer: 0,
        coins: 0,
    };

    const keys = {
        left: false, right: false, up: false, down: false,
        action: false, actionConsumed: false
    };

    function getState() { return state; }
    function getKeys()  { return keys; }
    function getSize()  { return { w: WIDTH, h: HEIGHT }; }

    function setKey(dir, val) {
        if (dir === 'action') {
            if (val && !keys.action) { keys.action = true; keys.actionConsumed = false; }
            if (!val) { keys.action = false; }
        } else {
            keys[dir] = val;
        }
    }

    function consumeAction() {
        if (keys.action && !keys.actionConsumed) {
            keys.actionConsumed = true;
            return true;
        }
        return false;
    }

    function update() {
        const s = state;

        let moving = false;
        if (keys.left) {
            s.vx = -SPEED;
            s.facing = 'left';
            moving = true;
        } else if (keys.right) {
            s.vx = SPEED;
            s.facing = 'right';
            moving = true;
        } else {
            s.vx = 0;
        }

        if (keys.up && !s.isJumping) {
            s.vy = JUMP_VEL;
            s.isJumping = true;
            AudioManager.play('jump');
        }

        s.vy = Math.min(s.vy + GRAVITY, MAX_FALL);
        s.x += s.vx;
        s.y += s.vy;

        s.x = GameMap.clampX(s.x, WIDTH);

        if (GameMap.isOnGround(s.y, HEIGHT)) {
            if (s.vy > 2) AudioManager.play('land');
            s.y  = GameMap.GROUND_Y - HEIGHT;
            s.vy = 0;
            s.isJumping = false;
        }

        const plat = GameMap.getPlatformAt(s.x, s.y, WIDTH, HEIGHT);
        if (plat && s.vy >= 0) {
            s.y  = plat.y - HEIGHT;
            s.vy = 0;
            s.isJumping = false;
        }

        if (s.y < 64) { s.y = 64; s.vy = 0; }

        s.isWalking = moving;
        s.frame++;

        if (moving && !s.isJumping) {
            s.stepTimer++;
            if (s.stepTimer % 18 === 0) AudioManager.play('step');
        } else {
            s.stepTimer = 0;
        }

        for (const coin of GameMap.coins) {
            if (coin.collected) continue;
            const dx = Math.abs(s.x + WIDTH / 2 - coin.x);
            const dy = Math.abs(s.y + HEIGHT / 2 - coin.y);
            if (dx < 20 && dy < 20) {
                coin.collected = true;
                s.coins++;
                AudioManager.play('coin');
            }
        }
    }

    function setPosition(x, y) {
        state.x = x;
        state.y = y;
        state.vx = 0;
        state.vy = 0;
    }

    return {
        getState, getKeys, getSize,
        setKey, consumeAction,
        update, setPosition,
        WIDTH, HEIGHT
    };
})();
