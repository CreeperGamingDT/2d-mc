function getAngleLookAt(pos1, pos2) {
    //degrees
    return Math.atan2(
        (pos2.y - pos1.y), (pos2.x - pos1.x)
    ) * 180 / Math.PI

}
function playerheadrotation() {
    const headCenterRelative = {
        x: canvas.offsetWidth / 2 + player.w / 2,
        y: canvas.offsetHeight / 2 + player.h + player.head.h * 2
    }
    const mousedS = mouse

    player.head.r = getAngleLookAt(headCenterRelative, mousedS)
}
function getBlockLookingAt() {
    const nearChunks = getNearChunks(player, chunksize / 2)

    //generate chunks
    let generatedChunks = []
    

    //*Subract camera so it doesnt have to process it non-relative
    nearChunks.forEach((pos) => generatedChunks.push(...generateChunk(pos).back.map(
        b => (
            {
                ...b,
                x: b.x - camera.x,
                y: b.y - camera.y
            }
        ))))

    const block = castRay(
        {
            x: player.x +player.w - player.head.w / 2-camera.x,
            y: player.y +player.h - player.head.h / 2-camera.y
        },
        player.head.r,
        generatedChunks,
        25
    )
   // console.log(block)
    if (block !== null) {
        const b = block.object
    return {...b,x:b.x+camera.x,y:b.y+camera.y,side:block.side}
    } else {
        return null;
    }
}