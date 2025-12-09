const entitiesData = {
    "pig": [
        {
            //leg
            x: 0,
            y: 0,
            w: 0.2,
            h: 0.2,
            c: rgbToNormalized(150, 12, 75)
        },
        {
            //leg
            x: 0.8,
            y: 0,
            w: 0.2,
            h: 0.2,
            c: rgbToNormalized(150, 12, 75)
        },
        {
            //body
            x: 0,
            y: 0.2,
            w: 1.2,
            h: 0.4,
            c: rgbToNormalized(219, 48, 158)
        },
        {
            //head
            x: 1.2,
            y: 0.2,
            w: 0.2,
            h: 0.3,
            c: rgbToNormalized(171, 51, 95)
        },
    ],
     "cow": [
        {
            //leg
            x: 0,
            y: 0,
            w: 0.25,
            h: 0.25,
            c: rgbToNormalized(56, 24, 2)
        },
        {
            //leg
            x: 0.8,
            y: 0,
            w: 0.25,
            h: 0.25,
            c: rgbToNormalized(56, 24, 2)
        },
        {
            //body
            x: 0,
            y: 0.25,
            w: 1.4,
            h: 0.5,
            c: rgbToNormalized(76, 24, 2)
        },
        {
            //head
            x: 1.3,
            y: 0.35,
            w: 0.3,
            h: 0.4,
            c: rgbToNormalized(76, 24, 2)
        },
        {
            //under thingy
            x: 0.3,
            y: 0.175,
            w: 0.075,
            h: 0.075,
            c: rgbToNormalized(224, 47, 213)
        },
        {
            //under thingy
            x: 0.525,
            y: 0.175,
            w: 0.075,
            h: 0.075,
            c: rgbToNormalized(224, 47, 213)
        },
        {
            //under thingy
            x: 0.4,
            y: 0.15,
            w: 0.1,
            h: 0.1,
            c: rgbToNormalized(224, 47, 213)
        },
    ]
}
const entitiesHitbox = {
    "pig": {
        x: 0,
        y: 0,
        w: 1.4,
        h: 0.6,
        passive: true,
    },
    "cow": {
        x: 0,
        y: 0,
        w: 1.4,
        h: 0.6,
        passive: true,
    }
}

//f = flipped?
const entities = {
    "pig": [],
    "cow": []
}
let lastentitiesDate = Date.now()
const lastentities = {
    "pig": [],
    "cow": []
}

function renderEntity(name, x, y, flipped = false) {
    
    let entity = entitiesData[name]
    let entityHitbox = entitiesHitbox[name]
    if (flipped) {
        entity = entity.map(d => ({
            ...d,
            x: x + (entityHitbox.w - d.x),
            y: y + d.y,
            w: -d.w,
        }))
    } else {
        entity = entity.map(d => ({
            ...d,
            x: d.x + x,
            y: d.y + y
        }))
    }
    return entity
}
function renderEntities() {
    const keys = Object.keys(entities)

    ////console.log(lastentitiesDate+"-"+Date.now())
    //converts milliseconds elasped since last time to value 0 - 1
    const lerpTime = Math.min((Date.now() - lastentitiesDate) / (tickTime), 1)



    let allentities = []
    keys.forEach(key => {
        
        lastentities[key].forEach((lastentity, i) => {
            const lerpPos = lerp(lastentity, entities[key][i], lerpTime);
            allentities.push(...renderEntity(key, lerpPos.x, lerpPos.y, lastentity.f))
        })
    })
    return allentities
}
function getEntityHitbox(name, x, y) {
    let entity = entitiesHitbox[name]
    entity = {
        ...entity,
        x: entity.x + x,
        y: entity.y + y
    }
    return entity
}
function getPassiveEntitiesInChunk(chunkloc) {
    let toreturn = {}
    let length = 0;

    const keys = Object.keys(entities)
    keys.forEach(key => {
        if (!entitiesHitbox[key].passive) return;
        entities[key].forEach((entity, i) => {
           //// console.log("entity"+JSON.stringify(entity))

            //get in chunk
            const x = Math.floor(entity.x / chunksize)
            const y = Math.floor(entity.y / chunksize)
           // console.log("p"+x+" "+chunkloc.x)
            if (x === chunkloc.x && y === chunkloc.y) {
                if (toreturn[key] === undefined) {
                    toreturn[key] = []
                }
                toreturn[key].push(entity)
                length += 1
                
            }
        })
    })
    return {data:toreturn,length};
}