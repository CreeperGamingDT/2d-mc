function aabb(b1, b2) {
  // Check if b1's right edge is past b2's left edge
  // and if b1's left edge is before b2's right edge
  if (b1.x < b2.x + b2.w &&
      b1.x + b1.w > b2.x &&
      b1.y < b2.y + b2.h &&
      b1.y + b1.h > b2.y) {
    // Collision detected
    return true;
  }
  // No collision
  return false;
}
function isPointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}