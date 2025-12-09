function generateWell(x, ty) {
    addStructure(getStructure("well", x, ty))

    const lengthOfTunnel = Math.floor(seedrand.get(x + 20)*10+5)
    console.log("len"+lengthOfTunnel)
    if (seedrand.get(x + 20) >= 0.5) {
    let thisX = x + 2;
    addStructure(getStructure("tunnel:right", thisX, ty - (20 - 2)))
    thisX += tunnelSize
    for (let i = 0; i < lengthOfTunnel; i++) {
    
        if (seedrand.get(thisX) <= 0.4) {
        addStructure(getStructure("tunnel:tinyroom", thisX, ty - (20 - 2)))
        } else {
        addStructure(getStructure("tunnel:right", thisX, ty - (20 - 2)))

        }

        thisX += tunnelSize
        
    }
}
}