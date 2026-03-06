const key = Object.create(null)
key.pressed = Object.create(null)
key.released = Object.create(null)
key.any = { held: false, pressed: false, released: false }

const mouse = Object.create(null)
mouse.left = false
mouse[0] = false
mouse.right = false
mouse[2]= false
mouse.middle = false
mouse[1] = false
mouse.any = { held: false, pressed: false, released: false }

window.addEventListener("keydown", (event) => {
    const k = event.key.toLowerCase()
    if (!key[k]) {
        key.pressed[k] = true
        key.any.pressed = true
    }
    key[k] = true
    key.any.held = true
})

window.addEventListener("keyup", (event) => {
    const k = event.key.toLowerCase()
    if (key[k]) {
        key.released[k] = true
        key.any.released = true
    }
    key[k] = false
    key.any.held = false
    for (const k in key) {
        if (k === "any" || k === "pressed" || k === "released") continue
        if (key[k]) {
            key.any.held = true
            break
        }
    }
})

//mouse
function getMouseButtonName(button) {
    if (button === 0) return "left"
    if (button === 1) return "middle"
    if (button === 2) return "right"
    return null
}

window.addEventListener("mousedown", (event) => {
    const button = getMouseButtonName(event.button)
    if (!button) return

    if (!mouse[event.button]) mouse.any.pressed = true
    mouse[button] = true
    mouse[event.button] = true
    mouse.any.held = true
})

window.addEventListener("mouseup", (event) => {
    const button = getMouseButtonName(event.button)
    if (!button) return

    if (mouse[event.button]) mouse.any.released = true
    mouse[button] = false
    mouse[event.button] = false
    mouse.any.held = mouse.left || mouse.middle || mouse.right
})

window.addEventListener("contextmenu", (event) => event.preventDefault())

// call once per game tick/frame after you've read inputs
function clearKeyFrameState() {
    key.any.pressed = false
    key.any.released = false
    mouse.any.pressed = false
    mouse.any.released = false
    for (const k in key.pressed) delete key.pressed[k]
    for (const k in key.released) delete key.released[k]
}
