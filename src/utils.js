// utils.js

/**
 * Convert degrees to radians.
 * @param {number} degrees
 * @returns {number}
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees.
 * @param {number} radians
 * @returns {number}
 */
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Calculate the distance between two points in 2D space.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in 2D space.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Normalize a vector.
 * @param {number} x
 * @param {number} y
 * @returns {{x: number, y: number}}
 */
function normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
}

/**
 * Rotate a point around another point.
 * @param {number} px
 * @param {number} py
 * @param {number} ox
 * @param {number} oy
 * @param {number} angle (in radians)
 * @returns {{x: number, y: number}}
 */
function rotatePoint(px, py, ox, oy, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = cos * (px - ox) - sin * (py - oy) + ox;
    const ny = sin * (px - ox) + cos * (py - oy) + oy;
    return { x: nx, y: ny };
}

export {
    degreesToRadians,
    radiansToDegrees,
    calculateDistance,
    calculateAngle,
    normalizeVector,
    rotatePoint
};
