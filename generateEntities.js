function generateEntities(chunkloc) {
    const surfaceLevel = getTerrain(chunkloc.x * chunksize, chunkloc.y * chunksize,true).surface

    if (Math.floor(surfaceLevel / chunksize) === chunkloc.y) {
        const passiveEntitiesInChunk = getPassiveEntitiesInChunk(chunkloc)

        //// console.log(passiveEntitiesInChunk.length)
        ////console.log(chunkloc)
        if (passiveEntitiesInChunk.length > 0) {
            ////    console.log("how")
            if (passiveEntitiesInChunk.length <= maxPassiveInChunk) {
                addPassiveEntity(chunkloc)
            }
        }
    }
}
function addPassiveEntity(chunkloc) {
    ////  console.log("c"+JSON.stringify(chunkloc))
    const randomPosX = chunkloc.x * chunksize + Math.round(Math.random() * chunksize) ?? 0

    //console.log(randomPosX)
    // console.log(entities)
    //pig
    // console.log('s')
    const surfaceLevel = getTerrain(Math.floor(randomPosX), chunkloc.y * chunksize,true).surface+1

    const newEntity = { x: randomPosX, y: surfaceLevel, f: false, feelLikeMoving: false }

    //check if on surface chunk
    if (Math.floor(surfaceLevel / chunksize) === chunkloc.y) {

        const random = Math.random()

        const passiveLength = 2
        if (random <= 1 / passiveLength) {
            entities.pig.push(
                newEntity
            )
        } else if (random <= 2 / passiveLength) {
            entities.cow.push(
                newEntity
            )
        }
    }
    //console.log('e')
    //  console.log(entities)
}