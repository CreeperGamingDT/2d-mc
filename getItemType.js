const itemTypes = {
    "iron_axe":{
        breakMultiplier:3,
        type:"axe"
    },
    "stone_axe":{
        breakMultiplier:2.2,
        type:"axe"
    }
}
function getBlockToolMultipler(blockType) {
    const heldItemData = itemTypes[player.heldItem.name] ?? {}

    if (!heldItemData.type) return 1

    if (hasComponent(blockType,`faster_break:${heldItemData.type}`)) {
        return heldItemData.breakMultiplier
    } else {
        return 1
    }
}