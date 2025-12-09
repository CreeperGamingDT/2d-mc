function handlePlacing() {
    const blockType = "gold"
    console.log(selectedBlock)
    const newpos = convertDirectionStringToVector(selectedBlock,selectedBlock.side,1)
    if (aabb({w:blocksize,h:blocksize,...newpos},player)) return
    changeBlock(newpos,blockType)
}
function handleBreaking() {
    //const blockBreakToughness = getBlockBreakToughness(blockType)
}
function convertDirectionStringToVector(v,d,size=1) {
    if (d==="left") return {...v,x:v.x-size}
    if (d==="right") return {...v,x:v.x+size}
    if (d==="top") return {...v,y:v.y+size}
    if (d==="bottom") return {...v,y:v.y-size}
    return v
}