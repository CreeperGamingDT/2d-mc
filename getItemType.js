const itemTypeGroupColors = {
    "iron": rgbToNormalized(190, 190, 190),
    "stone": rgbToNormalized(130, 130, 130),
    "stick": rgbToNormalized(64, 42, 18),
}
const itemTypes = {
    "iron_axe": {
        breakMultiplier: 3,
        type: "axe",
        textureData: [
            {
                //handle
                x: 0.0,
                y: 0.0,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                //handle
                x: 0.075,
                y: 0.075,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                //handle
                x: 0.15,
                y: 0.15,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                // ore
                x: 0.3,
                y: 0.05,
                w: 0.15,
                h: 0.10,
                c: itemTypeGroupColors.iron
            },
            {
                // ore
                x: 0.3,
                y: 0.15,
                w: 0.25,
                h: 0.25,
                c: itemTypeGroupColors.iron
            },
            {
                // ore
                x: 0.55,
                y: 0.25,
                w: 0.10,
                h: 0.15,
                c: itemTypeGroupColors.iron
            },
            {
                // ore
                x: 0.2,
                y: 0.30,
                w: 0.20,
                h: 0.20,
                c: itemTypeGroupColors.iron
            },

        ]
    },
    "stone_axe": {
        breakMultiplier: 2.2,
        type: "axe",
        textureData: [
            {
                //handle
                x: 0.0,
                y: 0.0,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                //handle
                x: 0.075,
                y: 0.075,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                //handle
                x: 0.15,
                y: 0.15,
                w: 0.15,
                h: 0.15,
                c: itemTypeGroupColors.stick
            },
            {
                // ore
                x: 0.3,
                y: 0.05,
                w: 0.15,
                h: 0.10,
                c: itemTypeGroupColors.stone
            },
            {
                // ore
                x: 0.3,
                y: 0.15,
                w: 0.25,
                h: 0.25,
                c: itemTypeGroupColors.stone
            },
            {
                // ore
                x: 0.55,
                y: 0.25,
                w: 0.10,
                h: 0.15,
                c: itemTypeGroupColors.stone
            },
            {
                // ore
                x: 0.2,
                y: 0.30,
                w: 0.20,
                h: 0.20,
                c: itemTypeGroupColors.stone
            },

        ]
    },
    "oak_log": {
        breakMultiplier: 2.2,
        type: "block",
        textureData:[
            {
                x:0,
                y:0,
                w:0.2,
                h:0.2,
                c:types.oak_log.color
            }
        ]
    },
}
const itementities = [
    {
        name:"oak_log",
        x:0,
        y:12,
    }
]
let lastitementities = [
    {
        name:"oak_log",
        x:0,
        y:12,
    }
]
//

function getBlockToolMultipler(blockType) {
    const heldItemData = itemTypes[player.heldItem.name] ?? {}

    if (!heldItemData.type) return 1

    if (hasComponent(blockType, `faster_break:${heldItemData.type}`)) {
        return heldItemData.breakMultiplier
    } else {
        return 1
    }
}
function renderItem(item, x, y, flipped,border) {
    if (!item) throw Error(`Attempted to render an item that doesn't exist: Reading ${item}`);
    const itemHitbox = {
        w: 0.5,
        h: 0.5,
    }

    let itemTexture = item.textureData


    if (flipped) {
        itemTexture = itemTexture.map(d => ({
            ...d,
            x: x + (itemHitbox.w - d.x),
            y: y + d.y,
            w: -d.w,
            border
        }))
    } else {
        itemTexture = itemTexture.map(d => ({
            ...d,
            x: x + d.x,
            y: y + d.y,
            
            border
        }))
    }

    

    return itemTexture
}

function renderItems() {
    let allitems = []


    //converts milliseconds elasped since last time to value 0 - 1
    const lerpTime = Math.min((Date.now() - lastentitiesDate) / (tickTime), 1)
    //itementities
       lastitementities.forEach((lastitem, i) => {
            const lerpPos = lerp(lastitem, itementities[i], lerpTime);
            //add a lil border for effectionism
            const itemTexture = renderItem(itemTypes[lastitem.name], lerpPos.x, lerpPos.y, false,{size:0.1,color:[0,0,0,0.5]})
            allitems.push(...itemTexture)
        })
    //update lerp
    lastitementities = structuredClone(itementities)

    //player held item
    const heldItem = itemTypes[player.heldItem.name] ?? null
    //if there is one add it
    if (heldItem) {
        let { x, y } = player
        const flipped = (player.vx < 0)

        //offset
        x += player.holdItemOffset.x * !flipped
        x += player.holdItemOffset.fx * flipped //flipped offset
        y += player.holdItemOffset.y
        const itemTexture = renderItem(heldItem, x, y, flipped)
        allitems.push(...itemTexture)
    }
    return allitems
}