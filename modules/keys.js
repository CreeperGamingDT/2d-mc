const key = {}
window.addEventListener('keydown', (event)=>{
    key[event.key.toLowerCase()] = true
})

window.addEventListener('keyup', (event)=>{
    key[event.key.toLowerCase()] = false
})
