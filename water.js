
//! SCRAPPED
//! TOO COMPLEX FOR SOME REASON


function waterPhysics() {
    //get water chunks in sim distance
const blocks = getNearChunksBlocksTypeString(player,camera.simulateSize)

const waterBlocks = blocks.filter(block=>block[2].split(":")[0] == "water")

//console.log(blocks)
nextWaterLoc(waterBlocks)
}
function nextWaterLoc(currentwaterblocks) {

    //find another way
    //idk if laggy
    const freezeloadedChunkData = JSON.parse(JSON.stringify(loadedChunkData))
    //make chunks freezed until after water complete

    function getBlocksInChunk(locToStr) {
    const chunkdata = freezeloadedChunkData[locToStr]
    const changedBlocks = changedFlatBlocksToNot(locToStr)

    ////console.log('raics')
    let toreturn = []

    if (!chunkdata) return []
    
    chunkdata.forEach((block) => {
       //// console.log(block)
        const changedTypeIndex = findChangedTypeInBlockIndex(block[0], block[1], locToStr)
        if (changedTypeIndex === -1) {
            toreturn.push(block)
        }
    })
    return [...toreturn,...changedBlocks]

}
    function getBlocksAround(block) {
         const blockToObj = {
        x:block[0],
        y:block[1]
    }
    //change to 1 if works
    //(optimize when it works first)
    const nearChunks = getNearChunks(blockToObj,2)
    let nearChunksData = []
    nearChunks.forEach(chunkLoc=>{
        const locToStr = `${chunkLoc.x},${chunkLoc.y}`
        const nearChunkData = getBlocksInChunk(locToStr)
        nearChunksData.push(...nearChunkData)

    })

    return nearChunksData
    }

    currentwaterblocks.forEach(water => {
      
        const blocks = getBlocksAround(water)
        let left = true, right = true, down = true;
        let waterleft = 0, waterright = 0, waterdown = 0;

        //idk why i named it this
        //basically left, right, down, but in coords
        const arounds = [
            [water[0] + 1, water[1]],
            [water[0] - 1, water[1]],
            [water[0], water[1] - 1]
        ]
//console.log(blocks)
        blocks.forEach((block)=>{
            
            //skip if air
            const numbToType = convertNumberToType(block[2])

            if (convertTypeToName(numbToType) !== "water") {
            if (numbToType !== "air") {
                //check if block on right
                if (isArrEqual(block, [...arounds[0], block[2]])) {
                    right = false;
                }
                //check if block on left
                if (isArrEqual(block, [...arounds[1], block[2]])) {
                    left = false;
                }
                //check if block down
                if (isArrEqual(block, [...arounds[2], block[2]])) {
                    down = false;
                }
            }
        } else {
            
            const waterNumb = Number(extractTypeData(convertNumberToType(block[2])))
            
            //!Add increase water to block
              //check if block on right
                if (isArrEqual(block, [...arounds[0], block[2]])) {
                    waterright = waterNumb;
                }
                //check if block on left
                if (isArrEqual(block, [...arounds[1], block[2]])) {
                    waterleft = waterNumb;
                }
                //check if block down
                if (isArrEqual(block, [...arounds[2], block[2]])) {
                    waterdown = waterNumb;
                }
        }
        })

        //

       
        if (down ) {
            left = false;
            right = false;
        }
        if (waterleft && waterright) {
            left = false;
            right = false;
            down = false;
        }

     //   console.log(left)
      //  console.log(right)
       // console.log(down)
        //update water

      
        const waterstate = extractTypeData(water[2])

        function getReducedByNumbState(numb) {
        return waterstate-numb<=0?"air":`water:${waterstate-numb}`
        }
        function calculateNextWater(numb) {
            if (numb === 0) return "water:1"

            const waternumb = numb

            if (waternumb === 8-1) return `water:${waternumb}`

            return `water:${waternumb+1}`
            
        }

        //!ISSUE
        //water:1 == -3 -> 0 but adds 3 (+3 water, not conserved)
        
        //holy javascript auto type carry
        const reduceByAmount = getReducedByNumbState(left+right+down)

        if (right) {
            changeBlock(arrToPos(arounds[0]),calculateNextWater(waterright))
        }
        if (left) {
            changeBlock(arrToPos(arounds[1]),calculateNextWater(waterleft))
        }
        if (down) {
            changeBlock(arrToPos(arounds[2]),calculateNextWater(waterdown))
        }
        if (left || right || down) {

        //change itself to reduce (no infinite water mc thingy hehe)
        changeBlock(arrToPos(water),reduceByAmount)
        }
    })


}