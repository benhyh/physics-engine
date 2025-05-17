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

import { Shape, ShapeType } from "./base/Shape";
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

    getHeight(height: number): void {
        this.height = height;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    contains(): boolean {}

    intersects(): boolean {}

    getAABB(): AABB {}

}