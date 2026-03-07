function detectItemCollisionWithBlocks(item) {
    const chunks = getNearChunks(item, item.w + item.h);
    const collidingBlocks = getCollidingBlocks(item, chunks);

    for (const block of collidingBlocks) {
        const blockBox = {
            x: block[0],
            y: block[1],
            w: blocksize,
            h: blocksize,
        };
        const nextItemY = item.y + item.vy * deltaTime;

        if (aabb({ ...item, y: nextItemY }, blockBox)) {
            if (item.vy > 0) {
                item.y = blockBox.y - item.h;
            } else {
                item.y = blockBox.y + blocksize;
            }
            item.vy = 0;
        }
    }

    item.y += item.vy * deltaTime;
}

function updateItemPhysics() {
    

    itementities.forEach((item) => {
        item.vy = Math.max(item.vy, -maxfallSpeed*deltaTime);
        item.vy -= gravitySpeed * deltaTime;
        detectItemCollisionWithBlocks(item);
    });
}
