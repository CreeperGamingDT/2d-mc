function rgbToNormalized(r,g,b,a) {
    return [r/255,g/255,b/255,a ?? 1]
}