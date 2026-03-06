


const types = {

    //color
    "player": {
        color: [0, 0, 1, 1],
    },
    "player:head": {
        color: [0.3, 0, 0.7, 1],
    },
    "air": {
        color: [0, 0, 0, 0],
        components: [
            "nocollision"
        ],
        toughness:0,
    },
    "grass": {
        color: [0, 0.7, 0, 1],
        toughness:1,
        components: [
            "faster_break:shovel"
        ]
    },
    "dirt": {
        color: rgbToNormalized(64, 46, 18, 1),
        toughness:1,
        components: [
            "faster_break:shovel"
        ]
    },
    "stone": {
        color: [0.3, 0.3, 0.3, 1],
        toughness:1.5,
        components: [
            "faster_break:pickaxe"
        ]
    },
    "stone:background": {
        color: [0.20, 0.20, 0.20, 1],
        components: [
            "nocollision"
        ],
        toughness:1.5,
    },
    "coal": {
        color: rgbToNormalized(38, 34, 27, 1),
        toughness:1.8,
        components: [
            "faster_break:pickaxe"
        ]
    },
    "iron": {
        color: rgbToNormalized(99 * 1.5, 93 * 1.5, 98 * 1.5, 1),
        toughness:1.9,
        components: [
            "faster_break:pickaxe"
        ]
    },
    "gold": {
        color: rgbToNormalized(214, 181, 73, 1),
        toughness:1.9,
        components: [
            "faster_break:pickaxe"
        ]
    },
    "diamond": {
        color: rgbToNormalized(34, 184, 214, 1),
        toughness:2,
        components: [
            "faster_break:pickaxe"
        ]
    },
    "bedrock": {
        color: rgbToNormalized(26, 28, 28, 1),
        toughness:Infinity,
    },

    "water:8": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ]
    },
    "water:7": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize:{
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 1) / 6
        },
    },
    "water:6": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize:{
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 2) / 6
        },
    },
    "water:5": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize:{
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 3) / 6
        },
    },
    "water:4": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize:{
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 4) / 6
        },
    },
    "water:3": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize: {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 4.5) / 6
        },
    },
    "water:2": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize: {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 5) / 6
        },
    },
    "water:1": {
        color: rgbToNormalized(0, 0, 255, 0.5),
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize: {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 5.5) / 6
        },
    },

    "oak_log:natural": {
        color: rgbToNormalized(74*1.2, 59*1.2, 38*1.2, 1),
        toughness:1.3,
        components: [
            "nocollision",     
            "faster_break:axe"
        ],
        
    },
    "oak_log": {
        color: rgbToNormalized(74*1.2, 59*1.2, 38*1.2, 1),
        toughness:1.3,
        components: [     
            "faster_break:axe"
        ],
        
    },
    "oak_leaves:natural": {
        toughness:0.2,
        color: rgbToNormalized(10, 115, 0, 1),
    },
    "oak_leaves": {
        toughness:0.2,
        color: rgbToNormalized(10, 115, 0, 1),
    },

    "pebble:1": {
        color: [0.38, 0.38, 0.38, 1],
        toughness:1.5,
        components: [
            "nocollision",
            "infrontRender",
            "faster_break:pickaxe"
        ],
        customSize: {
            x: blocksize / 2 - 0.5,
            y: 0,
            w: 0.4,
            h: 0.2,
        },
    },
    "pebble:2": {
        color: [0.42, 0.42, 0.42, 1],
        toughness:1.5,
        components: [
            "nocollision",
            "infrontRender",
            "faster_break:pickaxe"
        ],
        customSize: {
            x: 0.15,
            y: 0,
            w: 0.2,
            h: 0.1,
        },
    },
    "pebble:3": {
        color: [0.39, 0.39, 0.39, 1],
        toughness:1.5,
        components: [
            "nocollision",
            "infrontRender",
            "faster_break:pickaxe"
        ],
        customSize: {
            x: 0.3,
            y: 0,
            w: 0.3,
            h: 0.15,
        },
    },
    "pebble:4": {
        color: [0.41, 0.41, 0.41, 1],
        toughness:1.5,
        components: [
            "nocollision",
            "infrontRender",
            "faster_break:pickaxe"
        ],
        customSize: {
            x: 0.4,
            y: 0,
            w: 0.2,
            h: 0.1,
        },
    },
    "pebble:5": {
        color: [0.35, 0.35, 0.35, 1],
        toughness:1.5,
        components: [
            "nocollision",
            "infrontRender",
        ],
        customSize: {
            x: 0.1,
            y: 0,
            w: 0.8,
            h: 0.4,
        },
    },

    "dark_stone": {
        color: [0.12, 0.12, 0.12, 1],
        toughness:1.75,
    },
}
let selectionAllowed = [
   // ...Object.keys(types)
]
function hasComponent(type,compName) {
    if (!type) return false
    return (types[type].components ?? []).includes(compName)
}
function isSelectionBlockType(type) {
    if (selectionAllowed.findIndex(x => x === type) !== -1) return true;
    return false;
}
function isBlockInFront(type) {
    return hasComponent(type,"infrontRender")
}

function hasCollision(type) {
    return !hasComponent(type,"nocollision")
}
function getBlockBreakToughness(type) {
    if (!type) return 0
    return types[type].toughness
}
function convertTypeToName(type) {
    return type.split(":")[0]
}
function extractTypeData(type) {
    const split = type.split(":")
    return split[split.length - 1]
}
function getCustomSize(type) {
    return types[type].customSize ?? 
    {
        x: 0,
        y: 0,
        w: blocksize,
        h: blocksize
    }
}

function convertTypeToColor(type) {
    return types[type].color

}



function convertTypeToNumber(type) {
    return Object.keys(types).findIndex(x => x === type)
}
function convertNumberToType(numb) {
    //// console.log(Object.keys(types)[numb])
    return Object.keys(types)[numb]
}

function convertWorldToScreen(pos) {
    //screen is a square
    const psize = document.getElementById("ui").offsetHeight

    const maxview = camera.viewSize
 
    const cx = pos.x - camera.x
    const cy = pos.y + camera.y

    const screenX = (cx / maxview) * psize
    const screenY = (cy / maxview) * psize

    return {x:screenX,y:screenY}
}

function convertProgressToColor(color, progress) {
    const flooredProgress = Math.floor(progress)
    let toreturn = color;

    const progress1 = 0.07
    if (flooredProgress === 0) {
        toreturn = color.map(x => x - 0.1)
    } else if (flooredProgress === 1) {
        toreturn = color.map(x => x - 0.15)
    } else if (flooredProgress === 2) {
        toreturn = color.map(x => x - 0.20)
    } else if (flooredProgress === 3) {
        toreturn = color.map(x => x - 0.30)
    }
    if (flooredProgress !== progress) {
        toreturn = [toreturn[0]+0.1-progress1,toreturn[1]-progress1,toreturn[2]-progress1,1]
    }
    return toreturn
}