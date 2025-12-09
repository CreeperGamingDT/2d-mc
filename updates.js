

function updateCamera() {
    camera.x = player.x-camera.viewSize/2+player.w/2
    camera.y = player.y-camera.viewSize/2+player.h/2

}


function tickupdates() {
    removeExcessChunkData()
    doEntityAIs()
    //waterPhysics()

    if (player.jumpcooldownIndex > 0) {
    player.jumpcooldownIndex -= 1
    }
}
function updates() {
    //updateplayer()
      //updateCamera()
}