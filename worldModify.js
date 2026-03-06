function handlePlacing() {
    const blockType = "gold"
    //console.log(selectedBlock)
    const newpos = convertDirectionStringToVector(selectedBlock,selectedBlock.side,1)
    if (aabb({w:blocksize,h:blocksize,...newpos},player)) return
    changeBlock(newpos,blockType)
}
function handleBreaking() {

    if (selectedBlock.progress >= 0) {
        player.mining = true;
    }


    const blockType = selectedBlock.type
    const blockBreakToughness = getBlockBreakToughness(blockType)
    const toolMultiplier = getBlockToolMultipler(blockType)

    console.log(toolMultiplier)
    
    selectedBlock.progress += (1/blockBreakToughness)*toolMultiplier * deltaTime
    
    if (selectedBlock.progress >= 4) {
        destroyDropBlock(selectedBlock)

    }
}
function convertDirectionStringToVector(v,d,size=1) {
    if (d==="left") return {...v,x:v.x-size}
    if (d==="right") return {...v,x:v.x+size}
    if (d==="top") return {...v,y:v.y+size}
    if (d==="bottom") return {...v,y:v.y-size}
    return v
}
function destroyDropBlock() {
    

    //make block air
    changeBlock(selectedBlock,"air")
}