function getNearChunks(player, size) {
    //!store in cache (OPTIMIZE)
    const offsetChunkSize = size
    //how dad i forgot this...
    //a month of coding this and never realised until nov/23/25
    const noffsetChunkPos = playerToChunkPos(player)

    const offsetPPChunkPos = playerToChunkPos({ x: player.x + offsetChunkSize, y: player.y + offsetChunkSize })
    const offsetNNChunkPos = playerToChunkPos({ x: player.x - offsetChunkSize, y: player.y - offsetChunkSize })
    const offsetPNChunkPos = playerToChunkPos({ x: player.x + offsetChunkSize, y: player.y - offsetChunkSize })
    const offsetNPChunkPos = playerToChunkPos({ x: player.x - offsetChunkSize, y: player.y + offsetChunkSize })

    const arr = [noffsetChunkPos,offsetNNChunkPos, offsetNPChunkPos, offsetPPChunkPos, offsetPNChunkPos]
    const removedDuplicates = arr.filter((obj, index, self) =>
        index === self.findIndex(o => o.x === obj.x && o.y === obj.y)
    );
    return removedDuplicates
}
//*
function getCollidingBlocks(player, chunks) {
    //to lazy to rename variable
    let nearblocks = []
    // console.log(player)
    // console.log(chunks)
    chunks.forEach(pos => {

        const locToStr = `${pos.x},${pos.y}`
        const chunkdata = getBlocksInChunk(locToStr).filter(x=>hasCollision(convertNumberToType(x[2])))
      ////  console.log(chunkdata)
        if (!chunkdata) return;
        

        //!Checks collision with all blocks from <4 chunks (OPTIMIZE when motivation)
        nearblocks.push(
            ...chunkdata.map((x)=>[x[0]+pos.x*chunksize,x[1]+pos.y*chunksize,x[2]])
        )
    });
   // console.log(nearblocks)
    return nearblocks
}
function detectCollisionWithBlocks(nextpos) {
    let bottomCollide = false;
    if (!enableSpectator) {
    const chunks = getNearChunks(nextpos, (player.w + player.h))
    //console.log(chunks)

    const collidingBlocks = getCollidingBlocks(
        {
            x: nextpos.x,
            y: nextpos.y,
            w: player.x - nextpos.x + player.w,
            h: player.y - nextpos.y + player.h
        }, chunks)
    // console.log(collidingBlocks)

    const playercenter = {
        x: nextpos.x + player.w / 2,
        y: nextpos.y + player.h / 2
    }
    
    function doCollisionsDetectAdjusting(boxB) {
        //box collisions

        //!HOW DOES THIS WORKKKKKKKK WJAAHDAKHLAFHAKFHAKFILOAFHOIAjifjaofkl
        //dont touch it if it works

        const newPlayerX = player.x+player.vx * deltaTime
        const newPlayerY = player.y+player.vy * deltaTime

        //console.log(player)
        if (aabb({ ...player, x: newPlayerX }, boxB)) {
            if (player.vx > 0) {
                player.x = boxB.x - player.w
            } else {
                player.x = boxB.x + blocksize
            }
            player.vx = 0
        }
        if (aabb({ ...player, y: newPlayerY }, boxB)) {
              
            if (player.vy > 0) {
                player.y = boxB.y - player.h
                player.vy = 0
                return false
            } else {
                player.y = boxB.y + blocksize
                player.vy = 0
                   return true;
            }
            
          
         
        }
        return false;
    }
    
    collidingBlocks.forEach(block => {
        const blockToObj = {
            x: block[0],
            y: block[1],
            w: blocksize,
            h: blocksize,
            vx: 0,
            vy: 0,
        }
        
        if (doCollisionsDetectAdjusting(blockToObj)) {
            bottomCollide = true;
        }

    })
} 
    //console.log(collidingBlocks) 
    //update

    if (player.sneaking)
    if (bottomCollide) {
        player.vx *= player.sneakSpeedReduce
    } else {
        player.vx *= player.sneakSpeedAirReduce
    }

    player.x += player.vx * deltaTime
    player.y += player.vy * deltaTime

    return bottomCollide   
}