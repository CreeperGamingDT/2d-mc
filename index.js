window.onerror = (error, file, lineon) => console.error(error + ` (${file}, ${lineon})`);

let shaderProgram;
let gl;
let canvas;
let buffers;
let deltaTime;
const npcInteractDiv = document.getElementById("npcInteract")
const npcDialogueBoxDiv = document.getElementById("npcDialogueBox")
const npcDialogueBox = {
    name:npcDialogueBoxDiv.querySelector(".name"),
    text:npcDialogueBoxDiv.querySelector(".text"),
    profile:npcDialogueBoxDiv.querySelector(".profile"),
}
const npcInteractKey = "e"
let npcDialogueRunningPromise = null

const maxfallSpeed = 5000;
const gravitySpeed = 100


const selectedBlock = {
    x:0,
    y:0,
    type:null,
    progress:-1,//0-3
    side:null
}
let selectedItem = {
    x:0,
    y:0,
    w:0,
    h:0,
    name:"",
    index:-1,
}

const tickTime = 1000/20

const maxPassiveInChunk = 1

const camera = {
    x: 10,
    y: 0,
    viewSize: 20,
    simulateSize:15,
}
const player = {
    x:0,
    y:15,

    w:0.75,
    h:1.70,
    regularH:1.70,
    sneakH:1.4,
    sneaking:false,
    sneakSpeedReduce:0.2,
    sneakSpeedAirReduce:0.8,

    placeReach:3,
    itemPickUpReach:3,

    mining:false,

    heldItem:[
        {},
        {}
    ],
    holdItemOffset:{
        x:0.75,
        fx: -0.4, //flipped
        y:0.5
    },
    

    inventory:[

    ],
    

    vx:0,
    vy:0,
    speed:5,
    maxspeed:5000,

    minjumpspeed:15,
    jumpspeedgravity:45,
    jumpspeedgravitystop:8,
    
    jumpcooldown:10,
    jumpcooldownIndex:0,
    
    head:{
        r:45,
        w:0.75,
        h:0.74,
        type:"player:head"
    },

    type:"player"
}

//!DO NOT EDIT UNLESS YOU CHANGE LOADED CHUNK DATA INT SIZE (not made yet)
const chunksize = 24;

//i dont think you can change this without changing how the blocks work
//just go into gettype.js
const blocksize = 1;

//setTimeout(()=>player.x=950,200)
let enableSpectator = false;

const vsSource = `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    attribute vec4 a_color;

    uniform vec2 u_camera;

    varying vec2 vTexCoord;
    varying vec4 v_color;

    void main() {
        vTexCoord = aTexCoord-u_camera*2.;
        v_color = a_color;


        gl_Position = vec4(aPosition.xy-u_camera.xy*2., aPosition.z, 1.0);
    }
    `
const fsSource = `
    precision mediump float;

    varying vec2 vTexCoord;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
function initProgram() {
    const program = shaderProgram


    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);


    // Link aPosition attribute
    linkAttributes()
}
function linkAttributes() {
    //total numbers
    const stride = 9 * Float32Array.BYTES_PER_ELEMENT; // 9 floats * 4 bytes/float = 36 bytes total

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
    gl.vertexAttribPointer(
        positionAttributeLocation,
        3,          // size (vec3)
        gl.FLOAT,   // type
        false,      // normalize
        stride,     // stride (bytes per vertex)
        0           // offset (start at 0 bytes)
    );
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Link aTexCoord attribute
    const texCoordAttributeLocation = gl.getAttribLocation(shaderProgram, 'aTexCoord');
    gl.vertexAttribPointer(
        texCoordAttributeLocation,
        2,          // size (vec2)
        gl.FLOAT,   // type
        false,      // normalize
        stride,     // stride
        3 * Float32Array.BYTES_PER_ELEMENT // offset (start after the 3 position floats)
    );
    gl.enableVertexAttribArray(texCoordAttributeLocation);

     const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_color');
    gl.vertexAttribPointer(
        colorAttributeLocation,
        4,          // size (vec4)
        gl.FLOAT,   // type
        false,      // normalize
        stride,     // stride
        5 * Float32Array.BYTES_PER_ELEMENT // offset (start after the 2 uv position floats)
    );
    gl.enableVertexAttribArray(colorAttributeLocation);
}
function initGl() {
    canvas = document.getElementById('gl-canvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    shaderProgram = initShaderProgram(vsSource, fsSource);
    buffers = {
        squares: gl.createBuffer(),
        sky: gl.createBuffer(),
    };
}
function initShaderProgram(vsSource, fsSource) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}
function rotatePoint(pointX, pointY, originX, originY, angleRadians) {
    // Convert angle from degrees to radians
   
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    // Translate point to origin
    const tempX = pointX - originX;
    const tempY = pointY - originY;

    // Apply rotation
    const rotatedX = tempX * cos - tempY * sin;
    const rotatedY = tempX * sin + tempY * cos;

    // Translate point back to original position
    const finalX = rotatedX + originX;
    const finalY = rotatedY + originY;

    return { x: finalX, y: finalY };
}
function convertRectToTexCoord(rect) {
    const digitalSize = camera.viewSize

    //digital



    //convert

    //                            //prevent dividing by 0
    const x = (rect.x) / (rect.x==0?1:digitalSize) * 2 - 1
    const y = (rect.y) / (rect.y==0?1:digitalSize) * 2 - 1
    const w = (rect.w / digitalSize) * 2
    const h = (rect.h / digitalSize) * 2
    //normalized color
    let c = rect.c;

    if (!rect.c) {
    c = convertTypeToColor(rect.type)
    }
    if (selectedBlock.progress !== -1) {
        if (rect.x === selectedBlock.x && rect.y === selectedBlock.y) {
            c = convertProgressToColor(c,selectedBlock.progress)
        }
    }

    const rDegrees = rect.r
    
    //p4   p3
    //
    //p1   p2
    let p1 = {x,y}
    let p2 = {x:x+w,y}
    let p3 = {x:x+w,y:y+h}
    let p4 = {x,y:y+h}

    //center
    const cx = x+w/2
    const cy = y+h/2

    if (rDegrees !== 0 && rDegrees !== undefined) {
        const r = rDegrees * Math.PI / 180.0;

        p1 = rotatePoint(p1.x,p1.y,cx,cy,r)
        p2 = rotatePoint(p2.x,p2.y,cx,cy,r)
        p3 = rotatePoint(p3.x,p3.y,cx,cy,r)
        p4 = rotatePoint(p4.x,p4.y,cx,cy,r)

        
    }
    rect.z = rect.z ?? 0
    

    const verticesTexCoords = [
        p3.x, p3.y, rect.z,    1, 1, ...c, // Top Right
        p4.x, p4.y, rect.z,    0, 1, ...c,// Top Left
        p1.x, p1.y, rect.z,    0, 0, ...c,// Bottom Left
       
        p1.x, p1.y, rect.z,    0, 0, ...c,// Bottom Left
        p2.x, p2.y, rect.z,    1, 0, ...c, // Bottom Right
        p3.x, p3.y, rect.z,    1, 1, ...c, // Top Right
         


    ];    
 //   console.log(verticesTexCoords)

    return verticesTexCoords
}

function bufferSquares(squares) {
    const combinedData = [];

    squares.forEach(square => {
        if (square.border && square.border.size > 0) {
            const borderSquare = {
                x: square.x - square.border.size,
                y: square.y - square.border.size,
                w: square.w + square.border.size * 2,
                h: square.h + square.border.size * 2,
                c: square.border.color ?? [1,1,1,1], // white
            };
            combinedData.push(...convertRectToTexCoord(borderSquare));
        }
        
        //verticesTextCorrd
        combinedData.push(...convertRectToTexCoord(square));
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squares);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(combinedData), gl.DYNAMIC_DRAW);

    return combinedData.length / 9;
}

function bufferSky() {
    const c2 = [0.67,1,1,1]
    const c =[0,0.8,1,1]
    const dS = camera.viewSize
    const camx = -camera.x/dS*2
    const camy = -camera.y/dS*2

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sky)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([
        1-camx, 1-camy, 0,    1, 1, ...c, // Top Right
        -1-camx, 1-camy, 0,      0, 1, ...c,// Top Left
        -1-camx, -1-camy, 0,          0, 0, ...c2,// Bottom Left
               
        -1-camx, -1-camy, 0,          0, 0, ...c2,// Bottom Left
        1-camx, -1-camy, 0,      1, 0, ...c2, // Bottom Right
        1-camx, 1-camy, 0,  1, 1, ...c, // Top Right
    ]),gl.STATIC_DRAW)
}
function drawSky() {
    bufferSky()
    drawToCanvas(6)
}
function drawSquares(squares) {
    const vertexCount = bufferSquares(squares)
    drawToCanvas(vertexCount)
}

function drawToCanvas(vertices) {
    linkAttributes()
    gl.drawArrays(gl.TRIANGLES, 0, vertices);
}


function drawing() {
    gl.clearColor(1,1,1, 1);
    gl.clearDepth(1.0);
    const u_cameraUniformLocation = gl.getUniformLocation(shaderProgram, 'u_camera');
    gl.uniform2fv(u_cameraUniformLocation, new Float32Array([camera.x/camera.viewSize,camera.y/camera.viewSize]))

    //let it sky
    drawSky()

    const nearChunks = getNearChunks(player,chunksize/2)
    ////console.log(nearChunks)

    //generate chunks
    let generatedChunks = []

    

    //get chunks
    nearChunks.forEach((pos)=>generatedChunks.push(generateChunk(pos)))

    //draw chunk back
    generatedChunks.forEach(x=>drawSquares(x.back))

    //draw npcs
    drawSquares(npcs)

    //draw player and head
    drawSquares([{...player,h:player.h-player.head.h},{
        ...player.head,
        
        x:player.x+(player.w-player.head.w)/2,
        y:player.y+player.h-player.head.h
    }])

    drawSquares(renderItems()) 

    drawSquares(renderEntities())
    
    //draw chunks/blocks
    generatedChunks.forEach(x=>drawSquares(x.front))

   
    

    
    
    // bufferSquare2()
    // drawToCanvas()    
}

let lastTimestamp = 0;
function loop(timestamp) {
    if (lastTimestamp === 0) lastTimestamp = timestamp;
    // Delta time in milliseconds
    const deltaTimeMs = timestamp - lastTimestamp;
    // It's often better for physics calculations to use seconds
    const deltaTimeSec = deltaTimeMs / 1000; 
    deltaTime = Math.min(1/30,deltaTimeSec)

     lastTimestamp = timestamp

    updates()

    drawing()
   
    requestAnimationFrame(loop)

    clearKeyFrameState()
}
function tickloop() {
    tickupdates()

    //20 times a second
    setTimeout(tickloop,tickTime)
}
function main() {
  
    initGl()
    initProgram()

    requestAnimationFrame(loop)
    tickloop()
    
}
window.onload = main
