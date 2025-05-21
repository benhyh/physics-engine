/**
 * Properties: min/max points
 * Collision methods for AABB-AABB
 */

import { Shape, ShapeType } from "./base/Shape";
import { Vector } from "@/classes/Vector";

export interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

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

    project(axis: Vector): { min: number, max: number } {
        const corners = [
            new Vector(this.minX, this.minY),
            new Vector(this.maxX, this.minY),
            new Vector(this.maxX, this.maxY),
            new Vector(this.minX, this.maxY)
        ];

        let min = Infinity;
        let max = -Infinity;

        for (const corner of corners) {
            const projection = corner.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return { min, max };
    }

    getCollisionAxes(shape: Shape): Vector[] {
        return [
            new Vector(1, 0),  // x-axis
            new Vector(0, 1)   // y-axis
        ];
    }

    contains(): boolean {}

    intersects(): boolean {}

    getAABB(): AABB {
        return {
            minX: this.minX,
            minY: this.minY,
            maxX: this.maxX,
            maxY: this.maxY
        };
    }

}