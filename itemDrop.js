function dropHeldItem(slot) {

    if (!player.heldItem[slot]?.name) return

    const {x,y} = getHeldHandOffset(player.heldItem[slot],slot)
    addItemAt(x,y,player.heldItem[slot].name)

    //remove item from hotbar/inv
    player.heldItem[slot] = {}
    
    
}
function swapHotbarSlots() {
    //switches helditem[0] and helditem[1] data

    [player.heldItem[0], player.heldItem[1]] = [player.heldItem[1], player.heldItem[0]]
}