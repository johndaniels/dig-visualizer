

function intersectRects(shape1, shape2) {
    return (shape1.x < shape2.x + shape2.width) &&
        (shape1.y < shape2.y + shape2.width) &&
        (shape2.x < shape1.x + shape1.width) &&
        (shape2.y < shape1.x + shape1.width);
}

import { polygonPolygon } from 'intersects';


function intersects(shape1, shape2) {
    return polygonPolygon(shape1.points.flat(), shape2.points.flat());
}

function pointInBounds(point, width, height) {
    return point[0] >= 0 && 
           point[0] <= width &&
           point[1] >= 0 &&
           point[1] <= width;
}

function inBounds(shape, width, height) {
    return shape.points.every(p => pointInBounds(p, width, height));
}

function rectangle(x1, y1, width, height, rotation=0) {

    let x2 = x1 + width * Math.cos(rotation);
    let y2 = y1 + width * Math.sin(rotation);
    let x3 = x2 - height * Math.sin(rotation);
    let y3 = y2 + height * Math.cos(rotation);
    let x4 = x3 - width * Math.cos(rotation);
    let y4 = y3 - width * Math.sin(rotation);

    return {
        points: [
            [x1, y1],
            [x2, y2],
            [x3, y3],
            [x4, y4],
        ]
    };
}

export {
    intersects,
    rectangle,
    inBounds,
};