const mouse = {
    x:0,
    y:0,
    rightclick:false,
    leftclick:false
}
document.getElementById("gl-canvas").addEventListener('mousemove', function(event) {
    
    mouse.x = (event.clientX-this.offsetLeft)/1
    mouse.y = (this.offsetHeight-(event.clientY-this.offsetTop))/1

    
});