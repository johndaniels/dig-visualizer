import {rectangle, inBounds, intersects} from './geometry';
import { tsConstructorType } from '@babel/types';

const WIDTH=100;
const HEIGHT=100;

function randomRect(width, height) {
    let rect;
    let tries = 0;
    do {
        // For now we will choose x and y uniformly from within the world,
        // set rotation, and then see if that is in bounds, and repeat
        let rotation = Math.random() * 2 * Math.PI;
        let x = Math.random() * WIDTH;
        let y = Math.random() * HEIGHT;
        rect = rectangle(x, y, width, height, rotation);
        tries += 1;
        if (tries > 10) {
            alert("Cannot generate world. Too many entities or entities are too big");
            throw new Error();
        }
    } while (!inBounds(rect, WIDTH, HEIGHT));
    return rect;
}

function intersectsAny(shape, otherEntities) {
    return otherEntities.some(otherEntity => 
        intersects(shape, otherEntity.shape)
    );
}

function randomDig(previousDigs, width, height) {
    let shape;
    do {
        shape = randomRect(width, height);
    } while (intersectsAny(shape, previousDigs));
    return {
        entityType: "dig",
        shape,
    };
}

function randomBuilding(previousBuildings, width, height) {
    let shape;
    do {
        shape = randomRect(width, height);
    } while (intersectsAny(shape, previousBuildings));
    return {
        entityType: "building",
        shape,
    };
}

class World {
    constructor(buildingInfo, digInfo) {
        let digs = [];
        for (let i=0; i<digInfo.count; i++) {
            digs.push(randomDig(digs, digInfo.width, digInfo.height));
        }

        let buildings = [];
        for (let i=0; i<buildingInfo.count; i++) {
            buildings.push(randomBuilding(buildings, buildingInfo.width, buildingInfo.height));
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

function makeWorld(buildingInfo, digInfo) {
    console.log(buildingInfo, digInfo);
    return new World(buildingInfo, digInfo);
}

export {
    makeWorld,
    HEIGHT,
    WIDTH,
};