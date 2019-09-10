import {rectangle, intersects} from "./geometry";

test("geometry", function () {
    expect(rectangle(1,1,5,5, Math.PI / 8).points).toEqual([
        [1, 1],
        [5.619397662556434, 2.913417161825449],
        [3.705980500730985, 7.532814824381883],
        [-0.913417161825449, 5.619397662556434],
    ]);
});

test("intersect", function () {
    expect(intersects(rectangle(1, 1, 5, 5), rectangle(2,2,2,2)))
        .toBeTruthy();

    expect(intersects(rectangle(1, 1, 5, 5), rectangle(2,2,5,1)))
        .toBeTruthy();
    expect(intersects(rectangle(1, 1, 5, 5), rectangle(10,10,5,1)))
        .toBeFalsy();
});