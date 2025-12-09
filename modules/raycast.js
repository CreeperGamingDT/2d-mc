//Incremental Ray
function castRay(origin, direction, objects, maxIterations = 50, increment = 0.1) {
    let detectedObject = null;
    let iterations = 0;
    const ray = { x: origin.x, y: origin.y };
    let previousRay = { x: origin.x, y: origin.y }; // Store the position from the previous step

    const dirVector = degreesToNormalizedVector(direction);

    while (detectedObject === null && iterations < maxIterations) {
        iterations++;

        // Check if any objects colliding with ray point
        for (const object of objects) { // Use a standard loop or 'for...of' so we can break early
            if (isPointInRect(ray, object)) {
                detectedObject = object;
                // Once detected, we break out of the inner loop immediately
                break;
            }
        }

        if (detectedObject) {
            // If we found an object, the loop will exit in the next iteration
            // We can calculate the side hit now or after the loop finishes.
            break;
        }

        // Only update previousRay if no collision was found yet
        previousRay.x = ray.x;
        previousRay.y = ray.y;

        ray.x += dirVector.x * increment;
        ray.y += dirVector.y * increment;
    }

    if (detectedObject) {
        // *** Logic to determine the hit side goes here ***
        const hitSide = determineHitSide(previousRay, detectedObject);
        // You can return an object containing both
        return { object: detectedObject, side: hitSide };
    }

    return null; // Return null if nothing was hit
}

function degreesToNormalizedVector(degrees) {
    // 1. Convert degrees to radians
    const radians = degrees * (Math.PI / 180);

    // 2. Calculate x and y components
    const x = Math.cos(radians);
    const y = Math.sin(radians);

    return { x: x, y: y }; // Return an object representing the normalized vector
}
/**
 * Determines which side of the rectangle the ray hit first.
 * @param {object} previousPos - The ray's position just before collision.
 * @param {object} rect - The rectangle object (assumed to have x, y, width, height).
 * @returns {string} The side hit ('top', 'bottom', 'left', or 'right').
 */
function determineHitSide(previousPos, rect) {

    const rectLeft = rect.x ;
    const rectRight = rect.x + rect.w;
    const rectBottom = rect.y;
    const rectTop = rect.y + rect.h;


    // Check which boundary the previous position was outside of:

    if (previousPos.x <= rectLeft) {
        return 'left';
    } else if (previousPos.x >= rectRight) {
        return 'right';
    } else if (previousPos.y >= rectTop) {
        return 'top';
    } else if (previousPos.y <= rectBottom) {
        return 'bottom';
    }

    // This case shouldn't happen with correct logic, but good for debugging
    return 'inside (error)';
}

//LEARN TO USE GEOMETRICAL DDA (is that a GD reference)