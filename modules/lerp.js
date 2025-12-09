function lerp(pos1,pos2,time) {
    return {
        x:(1-time)*pos1.x+time*pos2.x,
        y:(1-time)*pos1.y+time*pos2.y
    }
}