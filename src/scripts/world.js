import {rectangle, inBounds, intersects} from './geometry';
import { tsConstructorType } from '@babel/types';

const WIDTH=100;
const HEIGHT=100;

function randomRect(width, height, lockRotation) {
    let rect;
    let tries = 0;
    do {
        // For now we will choose x and y uniformly from within the world,
        // set rotation, and then see if that is in bounds, and repeat
        let rotation = lockRotation ? 0 : Math.random() * 2 * Math.PI;
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

function randomTestUnit(previousTestUnits, width, height, lockRotation) {
    let shape;
    do {
        shape = randomRect(width, height,lockRotation);
    } while (intersectsAny(shape, previousTestUnits));
    return {
        entityType: "testUnit",
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
    constructor(buildingInfo, testUnitInfo) {
        let testUnits = [];
        for (let i=0; i<testUnitInfo.count; i++) {
            testUnits.push(randomTestUnit(testUnits, testUnitInfo.width, testUnitInfo.height, testUnitInfo.lockRotation));
        }

        let buildings = [];
        for (let i=0; i<buildingInfo.count; i++) {
            buildings.push(randomBuilding(buildings, buildingInfo.width, buildingInfo.height));
        }
        this.testUnits = testUnits;
        this.buildings = buildings;
        this.width = WIDTH;
        this.height = HEIGHT;
    }

    structuresSeen() {
        let total = 0;
        for (let building of this.buildings) {
            if (intersectsAny(building.shape, this.testUnits)) {
                total += 1;
            }
        }
        return total;
    }
}

function makeWorld(buildingInfo, testUnitInfo) {
    console.log(buildingInfo, testUnitInfo);
    return new World(buildingInfo, testUnitInfo);
}

export {
    makeWorld,
    HEIGHT,
    WIDTH,
};