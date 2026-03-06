function leavesPhysics() {
    //get leaf blocks in sim distance
const blocks = getNearChunksBlocksTypeString(player,camera.simulateSize)

const leafBlocks = blocks.filter(block=>block[2].includes(
    [
        "oak_leaves:natural"
        //if we add more leaves type
    ]
))
const leafDecayRadius = 5
//console.log(blocks)
leafBlocks.forEach(block=>{
 //   console.log(block)
    const blocksAround = getBlocksAround(block).map(b=>[b[0],b[1],convertNumberToType(b[2])])

    if (blocksAround.filter(block=>block[2].includes(
        [
            "oak_log:natural",
        ]
    )).length > 0 ||
blocksAround.filter(block=>block[2].includes(
        [
            "oak_leaves:natural",
        ]
    )).length >= 2) {
    //    console.log("leaf")
    } else {
        const blockToObj = {
            x:block[0],
            y:block[1]
        }
        changeBlock(blockToObj,"air")
    }
})
}