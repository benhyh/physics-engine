/**
 * Properties: min/max points
 * Collision methods for AABB-AABB
 */

import { Shape, ShapeType } from "./base/Shape";

export class AABBShape extends Shape {
    public minX: number;
    public minY: number;
    public maxX: number;
    public maxY: number;

    constructor(
        minX: number = 0,
        minY: number = 0,
        maxX: number = 1,
        maxY: number = 1
    ) {
        super(ShapeType.POLYGON);
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    getMinX(): number {
        return this.minX;
    }

    setMinX(minX: number): void {
        this.minX = minX;
    }

    getMinY(): number {
        return this.minY;
    }

    setMinY(minY: number): void {
        this.minY = minY;
    }

    getMaxX(): number {
        return this.maxX;
    }

    setMaxX(maxX: number): void {
        this.maxX = maxX;
    }

    getMaxY(): number {
        return this.maxY;
    }

    setMaxY(maxY: number): void {
        this.maxY = maxY;
    }

    contains(): boolean {}

    intersects(): boolean {}

    getAABB(): AABB {}

}