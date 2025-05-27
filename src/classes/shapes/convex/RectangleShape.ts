/**
 * Position/width/height
 * Collison methods (AABB-AABB collision)
 * 
 * checkAABBCollision(box1, box2) {
 *  return (box1.minX <= box2.maxX &&
 *          box1.maxX >= box2.minX &&
 *          box1.minY <= box2.maxY &&
 *          box1.maxY >= box2.minY);           
 * }
 */

import { Shape, ShapeType, AABB } from "./base/Shape";
import { Vector } from "../Vector";

export class RectangleShape extends Shape {
    public width: number;
    public height: number;
    public position: Vector;

    constructor(
        width: number =  1,
        height: number = 1,
        position: Vector = new Vector(0, 0),
    ) {
        super(ShapeType.RECTANGLE);
        this.width = width;
        this.height = height;
        this.position = position;
    }

    getPosition(): Vector {
        return this.position;
    }

    setPosition(position: Vector): void {
        this.position = position;
    }

    getWidth(): number {
        return this.width;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    getHeight(): number {
        return this.height;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    contains(): boolean {
        return false;
    }

    intersects(): boolean {
        return false;
    }

    getAABB(): AABB {
        return {
            minX: this.position.x,
            minY: this.position.y,
            maxX: this.position.x + this.width,
            maxY: this.position.y + this.height
        }
    }

    project(axis: Vector): { min: number, max: number } {
        const corners = [
            this.position,
            new Vector(this.position.x + this.width, this.position.y),
            new Vector(this.position.x + this.width, this.position.y + this.height),
            new Vector(this.position.x, this.position.y + this.height)
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

    getCorners(): Vector[] {
        return [
            // Top-left
            new Vector(this.position.x, this.position.y),
            // Top-right
            new Vector(this.position.x + this.width, this.position.y),
            // Bottom-right
            new Vector(this.position.x + this.width, this.position.y + this.height),
            // Bottom-left
            new Vector(this.position.x, this.position.y + this.height)
        ];
    }

    getCollisionAxes(): Vector[] {
        const axes: Vector[] = [];
        const corners = this.getCorners();
        
        for (let i = 0; i < corners.length; i++) {
            const current = corners[i];
            const next = corners[(i + 1) % corners.length];
            
            const edge = next.subtract(current);
            
            const normal = new Vector(-edge.y, edge.x).normalize();
            
            axes.push(normal);
        }
        
        return axes;
    }
}