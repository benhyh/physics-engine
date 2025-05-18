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

    getAABB(): AABB {
        return {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        }
    }

    /**
     * Standard rectangle-AABB collision 
     * 
     * 1. Find the closest point on the rectnagle to the circle.
     * - If the circle is to the left of rectnagle, closest X is left edge
     * - If circle is 
     * 
     * @param rectangle 
     * @returns goolean
     */
    intersectsRectangle(rectangle: RectangleShape): boolean {
        const circlePosition = this.center;
        let testX = circlePosition.x;
        let testY = circlePosition.y;

        const rectanglePosition = rectangle.getPosition();
        const rectangleWidth = rectangle.getWidth();
        const rectangleHeight = rectangle.getHeight();
        const rectangleX = rectanglePosition.x;
        const rectangleY = rectanglePosition.y;

        if (testX < rectangleX) testX = rectangleX;
        else if (testX > (rectangleX + rectangleWidth)) testX = rectangleX + rectangleWidth;

        if (testY < rectangleY) testY = rectangleY;
        else if (testY > (rectangleY + rectangleHeight)) testY = rectangleY + rectangleHeight;

        const distX = circlePosition.x - testX;
        const distY = circlePosition.y - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        if (distance <= this.radius) {
            return true;
        }

        return false;
    }

    intersectsTrapezoid(trapezoid: TrapezoidShape): boolean {
        return false;
    }
    
    intersectsPolygon(polygon: PolygonShape): boolean {
        return false;
    }
}