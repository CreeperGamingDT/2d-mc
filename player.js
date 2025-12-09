const gravitySpeed = 100

function playerphysics() {

    let thisGravitySpeed = gravitySpeed

    //friction
    if (!enableSpectator) {
        const friction = 0.7
        player.vx *= friction
    }
    //player.vy *= friction

    //clamph
    const maxspeed = player.maxspeed * deltaTime;
    const maxfall = 5000 * deltaTime
    player.vx = Math.min(Math.max(player.vx, -maxspeed), maxspeed);
    player.vy = Math.max(player.vy, -maxfall);


    if ((key[' '] || key['w']) && player.vy > -player.jumpspeedgravitystop * deltaTime) {
        thisGravitySpeed -= player.jumpspeedgravity

    }
    if (detectCollisionWithBlocks({
        x: player.x,
        y: player.y,
    })) {
        if (key[' '] || key['w']) {
            player.vy = player.minjumpspeed
            player.jumpcooldownIndex = player.jumpcooldown

        }

    } else {

        if (!enableSpectator) {
            //gravity
            player.vy -= thisGravitySpeed * deltaTime
        }


    }
    if (enableSpectator) {
        player.vy = 0;
        player.vx = 0;
    }


}
function movement() {
    if (key['a']) {
        player.vx -= player.speed * (enableSpectator + 1)
    }
    if (key['d']) {
        player.vx += player.speed * (enableSpectator + 1)
    }
    if (enableSpectator) {
        if (key['shift'] || key['s']) {
            player.vy -= player.minjumpspeed
        }
        if (key[' '] || key['w']) {
            player.vy = player.minjumpspeed


        }
    }
    if (key['shift'] || key['s']) {
        player.h = player.sneakH
        player.sneaking = true;
    } else {
        player.h = player.regularH
        player.sneaking = false;
    }

    if (key['alt']) {
        handlePlacing()
    }

    //!Fix jump/on ground detectiom




    /* if (key['t']) {
         changeBlock({
             x:player.x+player.w/2,
             y:player.y+player.h/4-1
         },"air")
         ///console.log()
     }*/
    ////console.log(key)

}

function updateplayer() {
    movement()

    playerphysics()
    playerheadrotation()
    playerselection()
}
function playerselection() {
    const block = getBlockLookingAt()
    if (block !== null) {
        if (isSelectionBlockType(block.type)) {
            selectedBlock.x = block.x
            selectedBlock.y = block.y
            selectedBlock.progress = 0
            selectedBlock.side = block.side
        } else {
            selectedBlock.progress = -1
        }
        
    } else {
        selectedBlock.progress = -1
    }
}