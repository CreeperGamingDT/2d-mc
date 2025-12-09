//[
//  xOffset,
//  yOffset,
//  blockType,
//]
const tunnelSize = 10
const structures = {
    "oak_tree": [
        [
            0,
            0,
            "oak_log:natural,up"
        ],
        [
            0,
            1,
            "oak_log:natural,up"
        ],
        [
            0,
            2,
            "oak_log:natural,up"
        ],
        [
            0,
            3,
            "oak_log:natural,up"
        ],
        [
            0,
            4,
            "oak_log:natural,up"
        ],
        [
            1,
            4,
            "oak_leaves:natural"
        ],
        [
            -1,
            4,
            "oak_leaves:natural"
        ],
        [
            -1,
            5,
            "oak_leaves:natural"
        ],
        [
            0,
            5,
            "oak_leaves:natural"
        ],
        [
            1,
            5,
            "oak_leaves:natural"
        ],
        [
            -1,
            6,
            "oak_leaves:natural"
        ],
        [
            0,
            6,
            "oak_leaves:natural"
        ],
        [
            1,
            6,
            "oak_leaves:natural"
        ],
    ],
    "well": [
        ...new Array(20).fill(0).map((x, i) => [-2, -i, "dark_stone"]),
        ...new Array(20).fill(0).map((x, i) => [-1, -i - 1, "stone:background"]),
        ...new Array(20).fill(0).map((x, i) => [0, -i - 1, "stone:background"]),
        ...new Array(20).fill(0).map((x, i) => [1, -i - 1, "stone:background"]),
        ...new Array(20).fill(0).map((x, i) => [2, -i, "dark_stone"]),
        ...new Array(3).fill(0).map((x, i) => [i-1, -20, "water:6"]),
        ...new Array(3).fill(0).map((x, i) => [i-1, -20, "stone:background"]),
    ],
    "tunnel:right": [
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  2, "dark_stone"]),
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  1, "stone:background"]),
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  0, "stone:background"]),
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  -1, "stone:background"]),
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  -2, "water:6"]),
        ...new Array(tunnelSize).fill(0).map((x, i) => [i,  -2, "stone:background"]),
    ],
    "tunnel:tinyroom": [
        [0,  4, "dark_stone"],
        [0,  3, "dark_stone"],
        [0,  2, "dark_stone"],
        [0,  1, "stone:background"],
        [0,  0, "stone:background"],
        [0,  -1, "stone:background"],
        [0,  -2, "dark_stone"],
        [0,  -2, "dark_stone"],
        [tunnelSize-2,  4, "dark_stone"],
        [tunnelSize-2,  3, "dark_stone"],
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  2, "dark_stone"]),
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  1, "stone:background"]),
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  0, "stone:background"]),
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  -1, "stone:background"]),
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  -2, "dark_stone"]),
        ...new Array(2).fill(0).map((x, i) => [tunnelSize-1-i,  -2, "dark_stone"]),

        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  4, "dark_stone"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  3, "stone:background"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  2, "stone:background"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  1, "stone:background"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  0, "stone:background"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  -1, "stone:background"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  -2, "dark_stone"]),
        ...new Array(tunnelSize-3).fill(0).map((x, i) => [i+1,  -2, "dark_stone"]),
    ]
}
function getStructure(name, x, y) {
    let structure = structures[name] ?? []
    // console.log(structure)
    structure = structure.map(s => [
        x + s[0],
        y + s[1],
        s[2]
    ])
    //  console.log(structure)
    return structure
}
function addStructure(structure) {
    //!WAY TO LAZY TO OPTIMIZE

    structure.forEach(block => {
        changeBlock({ x: block[0], y: block[1] }, block[2])
    });

}