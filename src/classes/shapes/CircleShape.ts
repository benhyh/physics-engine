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
     * - If circle is to the right, closest X is the right edge
     * - Otherwise, closest X is the circle's X (inside the rectangle horizontally)
     * 
     * 2. Calculate the distance between circle center and this closest point
     * 
     * 3. Compare with radius - if distance <= radius, they collide.
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

    /**
     * 
     * @param trapezoid
     * @returns boolean
     */
    intersectsTrapezoid(trapezoid: TrapezoidShape): boolean {
        return false;
    }
    
    /**
     * Separating Axis Theorem (SAT) essentially states if you are able to draw a line to seperate
     * two polygons, then they do not collide.
     * 
     * SAT is a method to determine if two convex shapes are intersecting. Non-convex shapes can be broken
     * down into a combination of conex shapes for SAT.
     * 
     * 1st test: a line where the projections (shadows) of the shape does not overlap is called a separation axis.
     *
     * 
     * @param polygon 
     * @returns boolean
     */
    intersectsPolygon(polygon: PolygonShape): boolean {
        return false;
    }

    getCollisionAxes(shape: Shape): Vector[] {
        const axes: Vector[] = [];
        
        switch(shape.getType()) {
            case ShapeType.CIRCLE:
                // For circle-circle, the axis is the vector between centers
                const otherCircle = shape as CircleShape;
                const axis = otherCircle.center.subtract(this.center).normalize();
                axes.push(axis);
                break;
                
            case ShapeType.POLYGON:
                // For circle-polygon, find closest vertex and use that as axis
                const polygon = shape as PolygonShape;
                const vertices = polygon.getVertices();
                let closestVertex = vertices[0];
                let minDist = Infinity;
                
                for (const vertex of vertices) {
                    const dist = vertex.subtract(this.center).magnitude();
                    if (dist < minDist) {
                        minDist = dist;
                        closestVertex = vertex;
                    }
                }
                
                const circleAxis = closestVertex.subtract(this.center).normalize();
                axes.push(circleAxis);
                break;
                
            case ShapeType.RECTANGLE:
            case ShapeType.TRAPEZOID:
                throw new Error("Not implemented");
                // TODO: Rectangle - Use the axis to the closest corner
                // TODO: Trapezoid - Use the axis to the closest vertex
        }
        
        return axes;
    }

    project(axis: Vector): { min: number, max: number } {
        const centerProjection = this.center.dot(axis);

        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius
        }
    }
}