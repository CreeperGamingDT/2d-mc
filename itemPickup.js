function pickupItem(index) {

    function equipSlot(slot) {
    
    player.heldItem[slot] = itementities[index]
    itementities.splice(index, 1) //remove item from world (cause u have it now)
    lastitementities.splice(index, 1) //remove item from previous world instance (cause u have it now)
    }

    //IF ITEM IN MAINHAND & OFFHAND
    if (player.heldItem[0].name && player.heldItem[1].name) {
    //hands are full
    //!TODO: add notification on hands full
    return null
    }
    //IF ITEM IN MAINHAND & NOT OFFHAND
    else if (player.heldItem[0].name && !player.heldItem[1].name) {
        equipSlot(1) //equip offhand
    }
    //IF ITEM IN NOT MAINHAND & OFFHAND
    else if (!player.heldItem[0].name && player.heldItem[1].name) {
        equipSlot(0) //equip mainhand
    }
    //IF ITEM IN NOT MAINHAND & NOT OFFHAND
    else if (!player.heldItem[0].name && !player.heldItem[1].name) {
        equipSlot(0) //equip mainhand
    }
}
function swapHotbarSlots() {
    //switches helditem[0] and helditem[1] data

    [player.heldItem[0], player.heldItem[1]] = [player.heldItem[1], player.heldItem[0]]
}