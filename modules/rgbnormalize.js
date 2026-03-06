function rgbToNormalized(r,g,b,a) {
    return [r/255,g/255,b/255,a ?? 1]
}

function hexToRgbNormalized(hex) {
    hex = String(hex).trim().replace(/^#/, "")

    if (hex.length === 3 || hex.length === 4) {
        hex = hex.split("").map((c) => c + c).join("")
    }

    if (hex.length !== 6 && hex.length !== 8) {
        throw new Error("Invalid hex color")
    }

    const hasAlpha = hex.length === 8
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const a = hasAlpha ? parseInt(hex.slice(6, 8), 16) / 255 : 1

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) {
        throw new Error("Invalid hex color")
    }

    return [r / 255, g / 255, b / 255, a]
}
