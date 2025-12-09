function terrainFunction(x) {
    const eq =
        (perlin.get(x / 40, 0) * 15)

        + 10
    return Math.floor(eq)
}
function getTerrain(x, thisy,getsurface=false) {
    // Get a Perlin noise value (between -1 and 1)
    let y_value = terrainFunction(x)
    if (getsurface) {
    return {surface:y_value}
    }
    //[x,y,type]
    const grass = []
    const dirts = []
    const wets = []
    const airs = []
    const dec = []


    for (let y = 0; y < chunksize; y++) {
        let blockclaimed = false;
        const ty = thisy + y

        if (ty === y_value) {
            grass.push([
                x,
                y_value,
                "grass"
            ])
            blockclaimed = true;
        }

        //3 blocks below grass
        if (ty >= y_value - 3 && ty < y_value) {
            dirts.push([
                x,
                ty,
                "dirt"
            ])
            blockclaimed = true;
        }
        //until y -499
        if (ty >= - (500 - 1) && ty < y_value - 3) {
            //returns stone if not
            if (isCaveAir(x, ty)) {
                const isOre = checkIfOre(x, ty)


                dirts.push([
                    x,
                    ty,
                    isOre
                ])
                blockclaimed = true;
            }
        }

        if (ty === - 500) {
            dirts.push([
                x,
                ty,
                "bedrock"
            ])
            blockclaimed = true;
        }


        //trees
        if (x % 3 == 0) {
            if (ty == y_value + 1) {
                if (seedrand.get(x) > 0.7) {

                    dec.push(...getStructure("oak_tree", x, ty))
                } else if (x % 80 == 0 && Math.abs(x) >= 200) {
                    if (seedrand.get(x) <= 0.5) {
                        //BUG,
                        //if u dont see it, it was never there
                        if (x !== -24) {

                            generateWell(x,ty)
                        }
                    }
                }
            }
        } else {
            if (ty === y_value + 1) {
                if (seedrand.get(x + 1) > 0.4) {
                    dec.push(generatePebble(x,ty))
                }
            }
        }

        if (!blockclaimed && ty >= -500) {
            //!SCRAPPED
            //!TOO COMPLEX FOR SOME REASON
            /* if (ty == 8) {
                 wets.push([
                     x,
                     ty,
                     "water:7"
                 ])
             }
             if (ty < 8) {
                 wets.push([
                     x,
                     ty,
                     "water:8"
                 ])
             }*/
        }
    }

    return {
        terrain: [...grass, ...dirts, ...wets, ...airs, ...dec],
        surface: y_value
    }

}
function isCaveAir(x, y) {
    /*    const caveair = perlin.get((x - 500) / 20, (y - 500) / 20) * 54813970
    
        if (caveair < 1) {
            return true
        }*/
    return true;
    return false;
}
function checkIfOre(x, y) {
    const coal = perlin.get(x / 8, y / 8) * 1.8
    const iron = perlin.get((x + 500) / 3.5, (y + 500) / 3) * 1.8
    const gold = -iron
    const diamond = -coal

    const yChance = y / 1000



    if (coal > 0.7) {
        return "coal"
    }
    if (iron > 0.85 + yChance * 1.25) {
        return "iron"
    }
    if (y < -20) {
        if (gold > 1.0 + yChance) {
            return "gold"
        }
        if (diamond > 1.0 + yChance * 1.25) {
            return "diamond"
        }
    }


    return "stone"
}