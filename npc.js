const npcs = [
    {
        name: "Tuteral",
        id: 0,
        w: 0.9,
        h: 1.8,
        ...generateNpcLoc(player.x),
        c: hexToRgbNormalized("#1ACC4D"),
        cHex: "#1ACC4D",
        dialogueId: "mineWood"
    }
]
//*TYPE1
//* Dialogue: self explanitory
//* Execute: runs after dialogue finishes (optional)
//* nextId: next dialogue ID after it finishes (optional)
//*TYPE2
//* Condition: splits dialogue into 2 depending on condition
//* Completed: contains TYPE1
//* Incompleted: contains TYPE2

//*ORGANIZATION
//* Left = NPC
//* Right = Respondant
//* Last Dialogue = new Dialogue ID
const npcDialogue = [
    //Tuteral (tutorial get it)
    {
        mineWood: {
            dialogue: [
                "Hello, traveler. Looks like you've finally woken up.", "Where am I?",
                "You are in Shardwind Valley. You used to train everyday here and have chatted with many of the inhabitants.", "Wait, what?",
                "You must not remember much... That is expected though. You're one of the few survivors of the Great Chompnelius the Second.", "What happened to the first?",
                "I don't know. He... ummm... died or something.", "makes sense.",
                "Anyways where was I... Ah right. About you...", "Go on.",
                "Your battle was great. A long, hard, and brave fight. But the Great Chompnelius the Second was no match for you", "So how did everyone die?",
                "They tried to fight him too.", "Ok...",
                "The ground remembers each and every one who has vanished. The wind still carries their last songs through the trees.", "O_o",
                "I will help you reclaim your strength. But before that, I have a few tasks for you to do before you start training.", "Which are?",
                "First, take my axe. Go and chop down that tree for me and bring me back the logs so we can make your first tools. \\run{player.heldItem[0] = {name:\"stone_axe\"}}", "Alright.",
            ],
            execute: ()=>{
                selectionAllowed = ["oak_log:natural"]
                
            },
            nextId: "mineWoodObjective"

        },
        mineWoodObjective: {
            condition: () => player.inventory.includes(""),
            completed: {
                dialogue: [
                    "Wonderful now we can move onto the next step. Go and get me some leaves from that tree you mined. It should fall down and you can pick it up", "",
                ],
                execute: ()=>{}
            },
            incompleted: {
                dialogue: [
                    "What are you waiting for? Go and chop down that tree", "",
                ]
            }
        }
        }
]



function generateNpcLoc(x) {
    const rand = Math.random()

    x = Math.floor(rand * 5) - 10
    return {
        x,
        y: getTerrain(x, 0, true).surface + 1
    }
}
function nearNPCcalculation() {


    npcInteractDiv.style.display = "none"
    npcs.forEach((npc) => {
        //show interact button

        //*SETTING
        const hitboxSizeIncrease = 3

        //if close
        if (aabb({
            x: player.x - hitboxSizeIncrease / 2,
            y: player.y - hitboxSizeIncrease / 2,
            w: player.w + hitboxSizeIncrease,
            h: player.h + hitboxSizeIncrease
        }, npc)) {
            //show
            npcInteractDiv.style.display = "flex"
            const toScreen = convertWorldToScreen({ x: npc.x + 0.2, y: npc.y + npc.h })
            npcInteractDiv.style.left = (toScreen.x) + "px"
            npcInteractDiv.style.top = toScreen.y - npcInteractDiv.offsetHeight + "px"

            //execute dialogue if key pressed
            if (key[npcInteractKey] && !npcDialogueRunningPromise) {
                npcDialogueRunningPromise = showNPCDialogue(npc).finally(() => {
                    npcDialogueRunningPromise = null
                })
            }
        }
    })


}
function typeAnimation(text) {
    return new Promise((resolve) => {

        //make sure its a string
        text = text == null ? "" : String(text)

        //make sure theres a dialogue box (new js tech?)
        const target = npcDialogueBox && npcDialogueBox.text
        if (!target) return text

        //*SETTINGS
        const baseDelay = 31
        const periodPause = 740

        const pauseCharRegex = /[.!?]/

        //setup
        const len = text.length
        let i = 0

        //skip typing animation
        let skipArmed = !key.any.held

        //make sure 2 typeanimations dont run at the same time
        if (typeAnimation._timer) clearTimeout(typeAnimation._timer)

        //reset contents
        target.innerHTML = ""


        //run the thing
        function tick() {
            if (!skipArmed && !key.any.held) skipArmed = true
            if (skipArmed && key.any.held) {
                target.innerHTML = text
                typeAnimation._timer = 0
                resolve()
                return
            }

            //if passed the length (typing animation end)
            if (i >= len) {
                typeAnimation._timer = 0
                resolve()
                return
            }

            //*WRITE 
            target.innerHTML += text[i]


            //Skips consecutive pause chars (..., !!, ?!, etc.)
            if (pauseCharRegex.test(text[i])) {
                while (i + 1 < len && pauseCharRegex.test(text[i + 1])) {
                    i++
                    target.innerHTML += text[i]
                }
            }

            //O.o
            i++

            //slow
            //text.split("")[i] === periodChar

            //gets delay and adds if theres ending punctuation
            const delay = pauseCharRegex.test(text[i - 1]) ? baseDelay + periodPause : baseDelay

            //does delay
            typeAnimation._timer = setTimeout(tick, delay)
        }

        //*INIT
        typeAnimation._timer = setTimeout(tick, baseDelay)

        //do animation
        return text
	});
}

function calculateDialogueTexts(npc) {
    const npcDialogueById = npcDialogue[npc.id]
    const dialogueNode = npcDialogueById && npcDialogueById[npc.dialogueId]

    function resolveDialogue(node) {
        if (!node) return { dialogue: [], execute: ()=>{}, nextId: null }

        // TYPE2: conditional branch (can recurse into TYPE2 again)
        if (typeof node === "object" && "condition" in node) {
            const passed = typeof node.condition === "function" ? !!node.condition() : !!node.condition
            return resolveDialogue(passed ? node.completed : node.incompleted)
        }

        // TYPE1: dialogue payload
        return {
            dialogue: Array.isArray(node.dialogue) ? node.dialogue : [],
            execute: typeof node.execute === "function" ? node.execute : null,
            nextId: typeof node.nextId === "string" ? node.nextId : null
        }
    }

    return resolveDialogue(dialogueNode)
}

function runInlineDialogueCommands(text) {
    text = text == null ? "" : String(text)
    const runStart = "\\run{"
    let output = ""
    let cursor = 0

    while (cursor < text.length) {
        const start = text.indexOf(runStart, cursor)
        if (start === -1) {
            output += text.slice(cursor)
            break
        }

        output += text.slice(cursor, start)

        let i = start + runStart.length
        let depth = 1
        let quote = ""
        let escaped = false

        while (i < text.length && depth > 0) {
            const ch = text[i]

            if (quote) {
                if (escaped) {
                    escaped = false
                } else if (ch === "\\") {
                    escaped = true
                } else if (ch === quote) {
                    quote = ""
                }
                i++
                continue
            }

            if (ch === "'" || ch === "\"" || ch === "`") {
                quote = ch
                i++
                continue
            }

            if (ch === "{") depth++
            else if (ch === "}") depth--

            i++
        }

        // If braces are unbalanced, keep the remaining text as-is.
        if (depth !== 0) {
            output += text.slice(start)
            break
        }

        const command = text.slice(start + runStart.length, i - 1).trim()
        if (command) {
            try {
                // Intentional: evaluate in global scope so dialogue can call game globals.
                ;(0, eval)(command)
            } catch (err) {
                console.error(`Dialogue inline run failed: ${command}`, err)
            }
        }

        cursor = i
    }

    return output
}

async function showNPCDialogue(npc) {

    const { dialogue: dialogueTexts, execute, nextId } = calculateDialogueTexts(npc)

    //remove interact button
    npcInteractDiv.style.display = "none"
    //enable dialogue box
    npcDialogueBoxDiv.style.display = "flex"
    //lil fade in
    npcDialogueBoxDiv.style.opacity = 1
    //lil hotbar fade out
    hotbar.style.opacity = 0.2

    //profile
    npcDialogueBox.profile.style.backgroundColor = npc.cHex
    npcDialogueBox.name.innerHTML = npc.name

    for (let i = 0; i < dialogueTexts.length; i += 2) {
        npcDialogueBoxDiv.classList.remove("ready")

        const lineText = runInlineDialogueCommands(dialogueTexts[i])
        await typeAnimation(lineText)
        //show response text
        npcDialogueBoxDiv.dataset.readyText = dialogueTexts[i + 1] || `Press any key to continue`

        await waitUntil(() => !key.any.held)
        npcDialogueBoxDiv.classList.add("ready")
        await waitUntil(() => key.any.held)
    }

    //on dialogue finish
    npcDialogueBoxDiv.style.display = "none"
    npcDialogueBoxDiv.style.opacity = 0
    //lil hotbar fade in
    hotbar.style.opacity = 1
    //prevent restarting until pressed again
     key[npcInteractKey] = false

     //next dialogue stuff
    if (execute) execute()
    if (nextId) npc.dialogueId = nextId


   

}
