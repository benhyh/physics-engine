/**
 * Properties: min/max points
 * Collision methods for AABB-AABB
 */

import { Shape, ShapeType } from "./base/Shape";
import { Vector } from "@/classes/Vector";
import { CircleShape } from "./CircleShape";
import { PolygonShape } from "./PolygonShape";

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
        ) {        super(ShapeType.AABB);        this.minX = minX;
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

    getCorners(): Vector[] {
        return [
            new Vector(this.minX, this.minY),
            new Vector(this.maxX, this.minY),
            new Vector(this.maxX, this.maxY),
            new Vector(this.minX, this.maxY)
        ];
    }
    
    setCorners(corners: Vector[]): void {
        this.minX = Math.min(...corners.map(corner => corner.x));
        this.minY = Math.min(...corners.map(corner => corner.y));
        this.maxX = Math.max(...corners.map(corner => corner.x));
        this.maxY = Math.max(...corners.map(corner => corner.y));
    }

    project(axis: Vector): { min: number, max: number } {
        const corners = this.getCorners();

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

    /**
     * Implement point containment check for AABB
     * 
     * This method determines if a given point (Vector) lies completely within
     * the bounds of this Axis-Aligned Bounding Box using inclusive boundaries.
     * 
     * @param point - The Vector point to test for containment
     * @returns boolean - true if point is inside this AABB, false otherwise
     */
    contains(point: Vector): boolean {
        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
            return false;
        }

        if (!isFinite(point.x) || !isFinite(point.y)) {
            return false;
        }

        if (this.minX > this.maxX || this.minY > this.maxY) {
            return false; // Invalid AABB cannot contain any point
        }

        return (this.minX <= point.x && point.x <= this.maxX &&
                this.minY <= point.y && point.y <= this.maxY);
    }

    /**
     * AABB vs Circle: Use circle-rectangle collision detection
     * - Find closest point on AABB to circle center
     * - CHeck if distance from circle center to closest point <= circle radius
     * @param circle 
     * @returns 
     */
    intersectsCircle(circle: CircleShape): boolean {
        const coordinates = this.getAABB();
        const center = circle.getCenter();
        const radius = circle.getRadius();

        const closestX = Math.min(coordinates.minX, Math.min(center.x, coordinates.maxX));
        const closestY = Math.min(coordinates.minY, Math.min(center.y, coordinates.maxY));

        const x = center.x - closestX;
        const y = center.y - closestY;
        const distance = Math.sqrt(x*x + y*y);

        return distance <= radius;
    }

    getAABB(): AABB {
        return {
            minX: this.minX,
            minY: this.minY,
            maxX: this.maxX,
            maxY: this.maxY
        };
    }

}