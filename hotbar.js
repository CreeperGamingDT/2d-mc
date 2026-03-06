const HOTBAR_SLOT_COUNT = 3
const hotbarState = {
    hoveredSlot: -1,
    selectedSlot: 0
}
const hotbar = document.getElementById("hotbar")

function renderHotbar(slotCount = HOTBAR_SLOT_COUNT) {
    if (!hotbar) return

    hotbar.innerHTML = ""
    hotbar.style.setProperty("--slot-count", String(slotCount))

    for (let i = 0; i < slotCount; i++) {
        const slot = document.createElement("div")
        slot.className = "hotbar-slot" + (i === 0 ? " is-selected" : "")
        slot.dataset.slotIndex = String(i)

        const index = document.createElement("span")
        index.className = "hotbar-slot__index"
        index.textContent = String(i + 1)

        slot.appendChild(index)
        hotbar.appendChild(slot)
    }
}

renderHotbar()

function getHoveredHotbarSlotIndex() {
    
    const ui = document.getElementById("ui")
    if (!hotbar || !ui) return -1
    if (typeof mouse?.x !== "number" || typeof mouse?.y !== "number") return -1

    const uiRect = ui.getBoundingClientRect()
    const clientX = uiRect.left + mouse.x
    const clientY = uiRect.top + (uiRect.height - mouse.y)

    const slots = hotbar.querySelectorAll(".hotbar-slot")
    for (let i = 0; i < slots.length; i++) {
        const rect = slots[i].getBoundingClientRect()
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
            return i
        }
    }
    return -1
}

function hotbarFrame() {
    if (!hotbar) return

    const hoveredIndex = getHoveredHotbarSlotIndex()
    const slots = hotbar.querySelectorAll(".hotbar-slot")
    const setSelectedSlot = (nextIndex) => {
        if (nextIndex < 0 || nextIndex >= slots.length) return
        
        //check if npc dialogue running
        if (npcDialogueRunningPromise) return

        if (hotbarState.selectedSlot >= 0 && hotbarState.selectedSlot < slots.length) {
            slots[hotbarState.selectedSlot].classList.remove("is-selected")
        }
        slots[nextIndex].classList.add("is-selected")
        hotbarState.selectedSlot = nextIndex
    }

    if (hotbarState.hoveredSlot !== hoveredIndex) {
        if (hotbarState.hoveredSlot >= 0 && hotbarState.hoveredSlot < slots.length) {
            slots[hotbarState.hoveredSlot].classList.remove("is-hovered")
        }
        if (hoveredIndex >= 0 && hoveredIndex < slots.length) {
            slots[hoveredIndex].classList.add("is-hovered")
        }
        hotbarState.hoveredSlot = hoveredIndex
    }

    for (let i = 0; i < slots.length && i < 9; i++) {
        if (key.pressed[String(i + 1)] && hotbarState.selectedSlot !== i) {
            setSelectedSlot(i)
            break
        }
    }

    if (hoveredIndex >= 0 && mouse.any.pressed && mouse.left && hotbarState.selectedSlot !== hoveredIndex) {
        setSelectedSlot(hoveredIndex)
    }
}
