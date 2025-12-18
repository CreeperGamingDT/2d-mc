//window.onerror = (error, file, lineon) => console.error(error + ` (${lineon})`);

//noise.seed(0.67); 

//!FIX
//!SOMEHOW A OBJECT KEY CAN HAVE 2+ VALUES
let loadedChunkData = {}
const maxChunksLoadableLength = 10
let changedBlocks = {
    "0,0": [
        16, 11, convertTypeToNumber("dirt"),
        17, 11, convertTypeToNumber("dirt"),
        18, 10, convertTypeToNumber("dirt"),
        17, 14, convertTypeToNumber("dirt"),
        17, 15, convertTypeToNumber("dirt"),
        18, 16, convertTypeToNumber("water:8"),
        16, 16, convertTypeToNumber("water:7"),
    ]
}



function playerToChunkPos(player) {
    const x = Math.floor(player.x / chunksize)
    const y = Math.floor(player.y / chunksize)
    return { x, y }
}
function removeExcessChunkData() {
    const keysToArr = Object.keys(loadedChunkData)
    if (keysToArr.length > maxChunksLoadableLength) {
        //*new syntax (wow amazing)
        delete loadedChunkData[keysToArr[0]]
    }
}
function getNearChunksBlocksTypeString(player, size) {
    const nearChunks = getNearChunks(player, size)

    let blocks = []
    nearChunks.forEach((chunk) => {
        const blocksInChunk = getBlocksInChunk(`${chunk.x},${chunk.y}`).map(x => [
            x[0] + chunk.x * chunksize,
            x[1] + chunk.y * chunksize,
            convertNumberToType(x[2])
        ])
        blocks.push(...blocksInChunk)
    })
    return blocks;
}
function getNearChunksBlocks(player, size) {
    const nearChunks = getNearChunks(player, size)

    let blocks = []
    nearChunks.forEach((chunk) => {
        const blocksInChunk = getBlocksInChunk(`${chunk.x},${chunk.y}`).map(x => [
            x[0] + chunk.x * chunksize,
            x[1] + chunk.y * chunksize,
            x[2]
        ])
        blocks.push(...blocksInChunk)
    })
    return blocks;
}
function getBlock(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    const nearChunks = getNearChunks({ x, y }, 0)
    //should be only 1 but just in case
    let blocksInChunk;
    nearChunks.forEach((chunk) => {
        blocksInChunk = getBlocksInChunk(`${chunk.x},${chunk.y}`).map(x => [
            x[0] + chunk.x * chunksize,
            x[1] + chunk.y * chunksize,
            x[2]
        ])
    })
    return blocksInChunk.filter(block => (block[0] === x && block[1] === y))
}
function getBlocksAround(block) {
    const blockToObj = {
        x: block[0],
        y: block[1]
    }
    //change to 1 if works
    //(optimize when it works first)
    const nearChunks = getNearChunks(blockToObj, 2)
    let nearChunksData = []
    nearChunks.forEach(chunkLoc => {
        const locToStr = `${chunkLoc.x},${chunkLoc.y}`
        const nearChunkData = getBlocksInChunk(locToStr).map(x => [
            x[0] + chunkLoc.x * chunksize,
            x[1] + chunkLoc.y * chunksize,
            x[2]
        ])
        nearChunksData.push(...nearChunkData)

    })

   // console.log(nearChunksData)
    //sort for blocks around block (in a + shape)
    return nearChunksData.filter((oblock) => isBlockAround(block, oblock))

}
function isBlockAround(block, oblock) {
    if (oblock[0] === block[0]) {
        //check if |
        if (
            oblock[1] === block[1] + blocksize ||
            oblock[1] === block[1] - blocksize
        ) return true;
    }
    if (oblock[1] === block[1]) {
        //check if -
        if (
            oblock[0] === block[0] + blocksize ||
            oblock[0] === block[0] - blocksize
        ) return true;
    }
    return false;
}
function findChangedTypeInBlockIndex(x, y, locToStr) {
    const arr = changedBlocks[locToStr]
    if (!arr) return -1

    let foundIndex = -1;

    //[1,2,3,4,5,6]
    for (let i = 0; i < arr.length; i += 3) {
        if (arr[i] === x && arr[i + 1] === y) {


            foundIndex = i;
            break; // Exit the loop after finding the first match

        }
    }
    return foundIndex
}
function changeBlock(pos, type) {
    const chunkloc = {
        x: Math.floor((pos.x) / chunksize),
        y: Math.floor(pos.y / chunksize)
    }
    const blockInChunk = {
        x: pos.x >= 0 ? Math.floor(pos.x % chunksize) : Math.floor((pos.x) % chunksize) + chunksize,
        y: pos.y >= 0 ? Math.floor(pos.y % chunksize) : Math.floor(pos.y % chunksize) + chunksize,
    }
    const locToStr = `${chunkloc.x},${chunkloc.y}`
    if (!changedBlocks[locToStr]) {
        changedBlocks[locToStr] = []
    }
    const foundIndex = findChangedTypeInBlockIndex(blockInChunk.x, blockInChunk.y, locToStr)
    if (foundIndex !== -1) {
        // remember this
        //!SECOND ARGUMENT IS DELETE COUNT NOT index -> index2
        //YOU SPENT 3 HOURS FIGURING THIS OUT
        //until u googled it...
        if (!isBlockInFront(convertNumberToType(changedBlocks[locToStr][foundIndex+2]))) {
        
        changedBlocks[locToStr].splice(foundIndex, 3)
        }
    }
    changedBlocks[locToStr].push(blockInChunk.x, blockInChunk.y, convertTypeToNumber(type))

    //console.log(JSON.stringify(changedBlocks[locToStr])+" "+locToStr)
}
function getBlocksInChunk(locToStr) {
    const chunkdata = loadedChunkData[locToStr]
    const changedBlocks = changedFlatBlocksToNot(locToStr)

    ////console.log('raics')
    let toreturn = []

    if (!chunkdata) return []

    chunkdata.forEach((block) => {
        //// console.log(block)
        const changedTypeIndex = findChangedTypeInBlockIndex(block[0], block[1], locToStr)
        if (changedTypeIndex === -1) {
            toreturn.push(block)
        }
    })
    return [...toreturn, ...changedBlocks]

}
function changedFlatBlocksToNot(locToStr) {

    let blocks = []
    const changedBlocksInChunk = changedBlocks[locToStr]
    if (!changedBlocksInChunk) return []
    for (let i = 0; i < changedBlocksInChunk.length; i += 3) {
        const block = [changedBlocksInChunk[i], changedBlocksInChunk[i + 1], changedBlocksInChunk[i + 2]]
        if (convertNumberToType(block[2]) !== "air") {
            blocks.push(block)
        }
    }
    return blocks
}

function chunkDataToBlock(chunkloc) {
    let toreturnBack = [];
    let toreturnFront = []

    const locToStr = `${chunkloc.x},${chunkloc.y}`

    ////console.log(locToStr)
    const chunkdata = loadedChunkData[locToStr];
    [...chunkdata].forEach(block => {
        const x = block[0] + chunkloc.x * chunksize
        const y = block[1] + chunkloc.y * chunksize
        if (changedBlocks[locToStr]) {

            const changedTypeIndex = findChangedTypeInBlockIndex(block[0], block[1], locToStr)
            if (changedTypeIndex !== -1) {
                const changedType = changedBlocks[locToStr][changedTypeIndex + 2]

                if (block[2] === changedType) {

                        //this code doesnt do anything anyways (i think)
                   // changedBlocks[locToStr].splice(changedTypeIndex, 3)

                }
                return;

            }

        }
        const size = getCustomSize(convertNumberToType(block[2]))
        const toreturn = {
            x: x + size.x,
            y: y + size.y,
            w: size.w,
            h: size.h,
            type: convertNumberToType(block[2])
        }
        if (!isBlockInFront(toreturn.type)) {
            toreturnBack.push(
                toreturn
            )
        } else {
            toreturnFront.push(
                toreturn
            )
        }
    })
    const changedBlocksInChunk = changedBlocks[locToStr]
    if (!changedBlocksInChunk) return { front: toreturnFront, back: toreturnBack }
    for (let i = 0; i < changedBlocksInChunk.length; i += 3) {
        const block = [changedBlocksInChunk[i], changedBlocksInChunk[i + 1], changedBlocksInChunk[i + 2]]
        const typename = convertNumberToType(block[2])
        ////console.log(typename)
        //do you see air?
        //u probably do actually
        if (typename !== "air") {

            const x = block[0] + chunkloc.x * chunksize
            const y = block[1] + chunkloc.y * chunksize
            const size = getCustomSize(typename)
            const toreturn = {
                x: x + size.x,
                y: y + size.y,
                w: size.w,
                h: size.h,
                type: typename
            }
            if (!isBlockInFront(typename)) {
                toreturnBack.push(
                    toreturn
                )
            } else {
                toreturnFront.push(
                    toreturn
                )
            }
        }
    }
    // console.log(toreturn)
    return { front: toreturnFront, back: toreturnBack }
}
function saveChunkData(chunkpos, blocks) {
    loadedChunkData[`${chunkpos.x},${chunkpos.y}`] = []
    blocks.forEach(block => {
        loadedChunkData[`${chunkpos.x},${chunkpos.y}`].push([
            block.x - chunkpos.x * chunksize,
            block.y - chunkpos.y * chunksize,
            convertTypeToNumber(block.type)
        ])
    })
    // console.log(loadedChunkData[`${chunkpos.x},${chunkpos.y}`].flat(1))
    //loadedChunkData[`${chunkpos.x},${chunkpos.y}`] = Int32Array(loadedChunkData[`${chunkpos.x},${chunkpos.y}`].flat(1))
    // console.log([...loadedChunkData[`${chunkpos.x},${chunkpos.y}`]])
}

function generateChunk(chunkloc) {

    //// console.log('chs')
    generateEntities(chunkloc);
    //check if its in memory
    if (loadedChunkData[`${chunkloc.x},${chunkloc.y}`]) return chunkDataToBlock(chunkloc)
    addPassiveEntity(chunkloc)


    //convert chunkloc to real pos
    const wp = {
        x: chunkloc.x * chunksize,
        y: chunkloc.y * chunksize
    }

    let blocks = []
    for (var x = 0; x < chunksize; x++) {
        //easy variable name thingy idk
        const wx = wp.x + x

        blocks.push(...getTerrain(wx, wp.y).terrain)




    }
    //console.log(blocks)

    //convert to be rendered
    const toreturn = []


    blocks.forEach(coord => {

        const size = getCustomSize(coord[2])
        toreturn.push({
            x: coord[0] + size.x,
            y: coord[1] + size.y,
            w: size.w,
            h: size.h,
            type: coord[2],
        })

    })


    saveChunkData(chunkloc, toreturn)

    return {back:toreturn,front:[]}
}
