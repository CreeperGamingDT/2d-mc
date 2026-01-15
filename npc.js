const npcs = [
    {
        name:"Tuteral",
        w:0.9,
        h:1.8,
        ...generateNpcLoc(player.x),
        c:[0.1,0.8,0.3,1]
    }
]

function generateNpcLoc(x) {
    const rand = Math.random()

    x = Math.floor(rand*5)-10
    return {
        x,
        y:getTerrain(x, 0,true).surface+1
    }
}