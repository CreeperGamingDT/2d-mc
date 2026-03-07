function aabb(b1, b2) {
  // Check if b1's right edge is past b2's left edge
  // and if b1's left edge is before b2's right edge
  return (b1.x < b2.x + b2.w &&
      b1.x + b1.w > b2.x &&
      b1.y < b2.y + b2.h &&
      b1.y + b1.h > b2.y)
}
function isPointInRect(point, rect) {
  const epsilon = Number.EPSILON;

  return aabb(
    {
      x: point.x - epsilon / 2,
      y: point.y - epsilon / 2,
      w: epsilon,
      h: epsilon,
    },
    rect
  );
}
function getCenter(rect) {
  return {x:rect.x-rect.w/2,y:rect.y-rect.h/2}
}
