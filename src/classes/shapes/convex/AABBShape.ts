/**
 * Properties: min/max points
 * Collision methods for AABB-AABB
 */

import { Shape, ShapeType } from "../base/Shape";
import { Vector } from "@/classes/Vector";
import { CircleShape } from "./CircleShape";
import { IShape } from "@/classes/components/PhysicsEntity";

export interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export class AABBShape extends Shape implements IShape {
    public minX: number;
    public minY: number;
    public maxX: number;
    public maxY: number;
    public width: number;   
    public height: number;

    constructor(
        minX: number = 0,
        minY: number = 0,
        maxX: number = 1,
        maxY: number = 1,
        width: number = 1,
        height: number = 1
        ) {        
        super(ShapeType.AABB);        
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.width = width;
        this.height = height;
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

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getVertices(): Vector[] {
        return [
            new Vector(this.minX, this.minY),
            new Vector(this.maxX, this.minY),
            new Vector(this.maxX, this.maxY),
            new Vector(this.minX, this.maxY)
        ];
    }

   
    setVertices(corners: Vector[]): void {
        this.minX = Math.min(...corners.map(corner => corner.x));
        this.minY = Math.min(...corners.map(corner => corner.y));
        this.maxX = Math.max(...corners.map(corner => corner.x));
        this.maxY = Math.max(...corners.map(corner => corner.y));
    }

    getBounds(): AABB {
        return {
            minX: this.minX,
            minY: this.minY,
            maxX: this.maxX,
            maxY: this.maxY
        };
    }
    
    getArea(): number {
        return this.width * this.height;
    }

    getCentroid(): Vector {
        const centerX = (this.minX + this.maxX) / 2;
        const centerY = (this.minY + this.maxY) / 2;

        return new Vector(centerX, centerY);
    }

    project(axis: Vector): { min: number, max: number } {
        const corners = this.getVertices();

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
    containsPoint(point: Vector): boolean {
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
}