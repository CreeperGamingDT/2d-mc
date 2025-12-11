


const types = {

    //color
    "player": [0, 0, 1, 1],
    "player:head": [0.3, 0, 0.7, 1],
    "air": [0, 0, 0, 0],
    "grass": [0, 0.7, 0, 1],
    "dirt": rgbToNormalized(64, 46, 18, 1),
    "stone": [0.3, 0.3, 0.3, 1],
    "stone:background": [0.20, 0.20, 0.20, 1],
    "coal": rgbToNormalized(38, 34, 27, 1),
    "iron": rgbToNormalized(99 * 1.5, 93 * 1.5, 98 * 1.5, 1),
    "gold": rgbToNormalized(214, 181, 73, 1),
    "diamond": rgbToNormalized(34, 184, 214, 1),
    "bedrock": rgbToNormalized(26, 28, 28, 1),

    "water:8": rgbToNormalized(0, 0, 255, 0.5),
    "water:7": rgbToNormalized(0, 0, 255, 0.5),
    "water:6": rgbToNormalized(0, 0, 255, 0.5),
    "water:5": rgbToNormalized(0, 0, 255, 0.5),
    "water:4": rgbToNormalized(0, 0, 255, 0.5),
    "water:3": rgbToNormalized(0, 0, 255, 0.5),
    "water:2": rgbToNormalized(0, 0, 255, 0.5),
    "water:1": rgbToNormalized(0, 0, 255, 0.5),

    "oak_log:natural,up": rgbToNormalized(74, 59, 38, 1),
    "oak_leaves:natural": rgbToNormalized(10, 115, 0, 1),

    "pebble:1": [0.38, 0.38, 0.38, 1],
    "pebble:2": [0.42, 0.42, 0.42, 1],
    "pebble:3": [0.39, 0.39, 0.39, 1],
    "pebble:4": [0.41, 0.41, 0.41, 1],
    "pebble:5": [0.35, 0.35, 0.35, 1],

    "dark_stone": [0.12, 0.12, 0.12, 1],

}
const nocollision = [
    "water:8",
    "water:7",
    "water:6",
    "water:5",
    "water:4",
    "water:3",
    "water:2",
    "water:1",
    "air",
    "oak_log:natural,up",
    "pebble:1",
    "pebble:2",
    "pebble:3",
    "pebble:4",
    "pebble:5",
    "stone:background",

]
const transparent = [
    "water:8",
    "water:7",
    "water:6",
    "water:5",
    "water:4",
    "water:3",
    "water:2",
    "water:1",
    "air",
    "pebble:1",
    "pebble:2",
    "pebble:3",
    "pebble:4",
    "pebble:5",
]
const selectionAllowed = [
    "oak_log:natural,up"
]
function isSelectionBlockType(type) {
    return true;
    if (selectionAllowed.findIndex(x => x === type) !== -1) return true;
    return false;
}
function isBlockInFront(type) {
    if (transparent.findIndex(x => x === type) !== -1) return true;
    return false;
}
function hasCollision(type) {
    if (nocollision.findIndex(x => x === type) !== -1) return false;
    return true;
}
function convertTypeToName(type) {
    return type.split(":")[0]
}
function extractTypeData(type) {
    const split = type.split(":")
    return split[split.length - 1]
}
function getCustomSize(type) {
    //WHAT DO YOU MEAN CANNOT BE INIT BEFORE FUNC
    //works now but if its outside IT DOESNT FOR SOME REASON
    //nvm is cause blocksize (no error viewer)
    const customSize = {
        //hardcoded water
        //womp womp
        "water:7": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 1) / 6
        },
        "water:6": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 2) / 6
        },
        "water:5": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 3) / 6
        },
        "water:4": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 4) / 6
        },
        "water:3": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 4) / 6
        },
        "water:2": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 5) / 6
        },
        "water:1": {
            x: 0,
            y: 0,
            w: blocksize,
            h: blocksize - (0 + 5.5) / 6
        },
        //rock that pebble
        "pebble:1": {
            x: blocksize / 2 - 0.5,
            y: 0,
            w: 0.4,
            h: 0.2,
        },
        "pebble:2": {
            x: 0.15,
            y: 0,
            w: 0.2,
            h: 0.1,
        },
        "pebble:3": {
            x: 0.3,
            y: 0,
            w: 0.3,
            h: 0.15,
        },
        "pebble:4": {
            x: 0.4,
            y: 0,
            w: 0.2,
            h: 0.1,
        },
        "pebble:5": {
            x: 0.1,
            y: 0,
            w: 0.8,
            h: 0.4,
        },
    }
    ////console.log(type)
    const size = customSize[type];
    if (!size) return {
        x: 0,
        y: 0,
        w: blocksize,
        h: blocksize
    }
    ////console.log(size)
    return size
}

function convertTypeToColor(type) {
    return types[type]

}



function convertTypeToNumber(type) {
    return Object.keys(types).findIndex(x => x === type)
}
function convertNumberToType(numb) {
    //// console.log(Object.keys(types)[numb])
    return Object.keys(types)[numb]
}

function convertProgressToColor(color, progress) {
    if (progress === 0) {
        return color.map(x => x + 0.07)
    } else if (progress === 1) {
        return color.map(x => x + 0.1)
    } else if (progress === 2) {
        return color.map(x => x + 0.25)
    } else if (progress === 3) {
        return color.map(x => x + 0.45)
    }
    return color
}