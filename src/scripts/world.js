import {rectangle, inBounds, intersects} from './geometry';
import { tsConstructorType } from '@babel/types';

const WIDTH=100;
const HEIGHT=100;

function randomRect(width, height) {
    let rect;
    do {
        // For now we will choose x and y uniformly from within the world,
        // set rotation, and then see if that is in bounds, and repeat
        let rotation = Math.random() * 2 * Math.PI;
        let x = Math.random() * WIDTH;
        let y = Math.random() * HEIGHT;
        rect = rectangle(x, y, width, height, rotation);
    } while (!inBounds(rect, WIDTH, HEIGHT));
    return rect;
}

function intersectsAny(shape, otherEntities) {
    return otherEntities.some(otherEntity => 
        intersects(shape, otherEntity.shape)
    );
}

function randomDig(previousDigs) {
    let shape;
    do {
        shape = randomRect(4, 4);
    } while (intersectsAny(shape, previousDigs));
    return {
        entityType: "dig",
        shape,
    };
}

function randomBuilding(previousBuildings) {
    let shape;
    do {
        shape = randomRect(4, 3);
    } while (intersectsAny(shape, previousBuildings));
    return {
        entityType: "building",
        shape,
    };
}

class World {
    constructor(buildingCount, digCount) {
        let digs = [];
        for (let i=0; i<digCount; i++) {
            digs.push(randomDig(digs));
        }

        let buildings = [];
        for (let i=0; i<buildingCount; i++) {
            buildings.push(randomBuilding(buildings));
        }
        this.digs = digs;
        this.buildings = buildings;
        this.width = WIDTH;
        this.height = HEIGHT;
    }

    structuresSeen() {
        let total = 0;
        for (let building of this.buildings) {
            if (intersectsAny(building.shape, this.digs)) {
                total += 1;
            }
        }
        return total;
    }
}

function makeWorld(buildingCount, digCount) {
    return new World(buildingCount, digCount);
}

export {
    makeWorld,
    HEIGHT,
    WIDTH,
};