/**
 * Properties: center position, radius
 * Collison methods for circle-cricle
 */

import { Shape, ShapeType, AABB } from "./base/Shape";
import { Vector } from "../Vector";
import { RectangleShape } from "./RectangleShape";
import { TrapezoidShape } from "./TrapezoidShape";
import { PolygonShape } from "./PolygonShape";

export class CircleShape extends Shape {
    public center: Vector;
    public radius: number;

    constructor(
        radius: number =  1,
        center: Vector = new Vector(0, 0),
    ) {
        super(ShapeType.CIRCLE);
        this.radius = radius;
        this.center = center;
    }

    getCenter(): Vector {
        return this.center;
    }

    setCenter(center: Vector): void {
        this.center = center;
    }

    getRadius(): number {
        return this.radius;
    }

    setRadius(radius: number): void {
        this.radius = radius;
    }

    contains(point: Vector): boolean {
        return false;
    }

    intersects(shape: Shape): boolean {
        switch(shape.getType()) {
            case ShapeType.CIRCLE:
                // Circle-circle collision
                const otherCircle = shape as CircleShape;
                const distance = this.center.subtract(otherCircle.center).magnitude();
                return distance <= this.radius + otherCircle.radius;
            case ShapeType.RECTANGLE:
                return this.intersectsRectangle(shape as RectangleShape)
            case ShapeType.TRAPEZOID:
                return this.intersectsTrapezoid(shape as TrapezoidShape);
            case ShapeType.POLYGON:
                return this.intersectsPolygon(shape as PolygonShape);
            default:
                return false;
        }

    }

    getAABB(): AABB {}

    intersectsRectangle(shape: RectangleShape): boolean {
        return false;
    }

    intersectsTrapezoid(shape: TrapezoidShape): boolean {
        return false;
    }
    
    intersectsPolygon(shape: PolygonShape): boolean {
        return false;
    }
}