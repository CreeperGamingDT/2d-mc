function generatePebble(x, ty) {
    const random = seedrand.get(x-1)
    let pebbleNumb = Math.floor(random * 5)+1

    return [
        x,
        ty,
        "pebble:"+pebbleNumb
    ]
}