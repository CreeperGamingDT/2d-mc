//PREFERENCES
const ItemBorderColor_DEFAULT = [0,0,0,0.5]
const ItemBorderColor_SELECTED = [0,0,0,0.8]
const itemBorderSize_DEFAULT = 0.03
const itemBorderSize_SELECTED = 0.05

const itemBlockSize = 0.4



//CONSTANTS FOR EASY ACCESS (DO NOT MODIFY)
const toolItemHitbox = {w:0.55,h:0.55}
const blockItemHitbox = {w:itemBlockSize,h:itemBlockSize}

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

        ],
        hitbox:toolItemHitbox
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

        ],
        hitbox:toolItemHitbox
    },
    "oak_log": {
        breakMultiplier: 2.2,
        type: "block",
        textureData:[
            {
                x:0,
                y:0,
                w:itemBlockSize,
                h:itemBlockSize,
                c:types.oak_log.color
            }
        ],
        hitbox:blockItemHitbox
    },
}
const itementities = [
    //!TEMP
    {
        name:"oak_log",
        x:0,
        y:12,
        vx:0,
        vy:0,
        w:itemBlockSize,
        h:itemBlockSize,
    }
]
let lastitementities = [
]




function getBlockToolMultipler(blockType) {
    //MAINHAND
    const heldItemData = itemTypes[player.heldItem[0].name] ?? {}

    if (!heldItemData.type) return 1

    if (hasComponent(blockType, `faster_break:${heldItemData.type}`)) {
        return heldItemData.breakMultiplier
    } else {
        return 1
    }
}
function renderItem(item, x, y, flipped,border) {
    if (!item) throw Error(`Attempted to render an item that doesn't exist: Reading ${item}`);

    let itemTexture = item.textureData



    if (flipped) {
        itemTexture = itemTexture.map(d => ({
            ...d,
            x: x + (item.hitbox.w - d.x),
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
            const itemTexture = renderItem(
                itemTypes[lastitem.name],
                lerpPos.x,
                lerpPos.y,
                false,
                {
                    size:selectedItem.index===i?
                    itemBorderSize_SELECTED:
                    itemBorderSize_DEFAULT,
                    color:selectedItem.index===i?
                    ItemBorderColor_SELECTED:
                    ItemBorderColor_DEFAULT
                }
            )
            allitems.push(...itemTexture)
        })
    //update lerp
    lastitementities = structuredClone(itementities)

    //player held item (MAINHAND)
    const heldItemM = itemTypes[player.heldItem[0].name] ?? null
    //if there is one add it
    if (heldItemM) {
        let { x, y } = player
        const flipped = (player.vx < 0)

        //offset
        x += player.holdItemOffset.x * !flipped
        x += player.holdItemOffset.fx * flipped //flipped offset
        y += player.holdItemOffset.y
        const itemTexture = renderItem(heldItemM, x, y, flipped)
        allitems.push(...itemTexture)
    }

    //player held item (OFFHAND)
    const heldItemO = itemTypes[player.heldItem[1].name] ?? null
    //if there is one add it
    if (heldItemO) {
        let { x, y } = player
        const flipped = (player.vx < 0)

        //offset 
        x += (player.holdItemOffset.x-heldItemO.hitbox.w) * flipped
        x += (player.holdItemOffset.fx+heldItemO.hitbox.w) * !flipped //flipped offset (INVERTED FROM MAINHAND)
        y += player.holdItemOffset.y
        const itemTexture = renderItem(heldItemO, x, y, flipped)
        allitems.push(...itemTexture)
    }
    return allitems
}

function addItemAt(x,y,name) {
    if (!itemTypes[name]) throw Error("Item name does not exist, Reading: "+name)
    itementities.push({
        name,
        x,
        y,
        vx:0,
        vy:0,
        w:itemTypes[name],
        h:itemTypes[name]
    })
}
function addItemAtCenter(x,y,name) {
    if (!itemTypes[name]) throw Error("Item name does not exist, Reading: "+name)
    itementities.push({
        name,
        x:x+itemTypes[name].hitbox.w/2,
        y:y+itemTypes[name].hitbox.h/2,
        vx:0,
        vy:0,
        w:itemTypes[name].hitbox.w,
        h:itemTypes[name].hitbox.h
    })
}