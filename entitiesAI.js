
//! MAKE IT STOP OUT OF SIM DISTANCE
const AIs = {
  "walkrandom": function (name) {
    //orginally was pig AI but too lazy to make for each passive mob
    const pigs = entities[name]
    const pigHitbox = entitiesHitbox[name]
    const speed = 0.1

    lastentities[name] = structuredClone(pigs);

    pigs.forEach((pig) => {

      //dont run if outside sim distance

      //hehe math
      if (Math.abs(pig.x - player.x) > camera.simulateSize || Math.abs(pig.y - player.y) > camera.simulateSize) return;

      if (pig.feelLikeMoving) {

        pig.x -= speed * (pig.f * 2 - 1)
      }

      //obeying gravity (why do u make me do this isaac)
      const thisblock = getBlock(pig.x, pig.y)
      const thisblockWidth = getBlock(pig.x + pigHitbox.w, pig.y)
      const blockbelow = getBlock(pig.x, pig.y - 0.5)
      const blockbelowWidth = getBlock(pig.x + pigHitbox.w, pig.y - 0.5)
      if (thisblock.length > 0) {
        if (hasCollision(convertNumberToType(thisblock[0][2]))) {
          pig.y += 1
        }
      } else {
        if (thisblockWidth.length > 0) {
          if (hasCollision(convertNumberToType(thisblockWidth[0][2]))) {
            pig.y += 1
          }
        }
      }

      if (blockbelow.length === 0 && blockbelowWidth.length === 0) {
        pig.y -= 1
      } else if (blockbelow.length === 0 || blockbelowWidth.length === 0) {
        //do nothing
      }
      else if (!hasCollision(convertNumberToType(blockbelow[0][2])) && !hasCollision(convertNumberToType(blockbelowWidth[0][2]))) {
        pig.y -= 1
      }

      const random = Math.random()
      if (random >= 0.85) {
        if (random >= 0.9) {
          if (Math.random() > 0.5) {
            pig.f = true;
            pig.feelLikeMoving = true;
          } else {
            pig.f = false;
            pig.feelLikeMoving = true;
          }
        } else if (pig.feelLikeMoving) {
            pig.feelLikeMoving = false;
          }
      }
    })

  }
}
function doEntityAIs() {
  lastentitiesDate = Date.now();
  AIs.walkrandom("pig")
  AIs.walkrandom("cow")
}