import { Shape, ShapeType, AABB } from "./base/Shape";
import { Vector } from "../Vector";
import { CircleShape } from "./CircleShape";

export class PolygonShape extends Shape {
    private sides: number;
    private radius: number;
    private vertices: Vector[] = [];

    constructor(
        sides: number = 3,
        radius: number = 1,
        position: Vector = new Vector(0, 0)
    ) {
        super(ShapeType.POLYGON, position);
        this.sides = Math.max(3, sides); // Minimum 3 sides
        this.radius = radius;
        this.calculateVertices();
    }

    getSides(): number {
        return this.sides;
    }

    setSides(sides: number): void {
        this.sides = Math.max(3, sides);
        this.calculateVertices();
    }

    getRadius(): number {
        return this.radius;
    }

    setRadius(radius: number): void {
        this.radius = radius;
        this.calculateVertices();
    }

    getVertices(): Vector[] {
        return this.vertices;
    }

    private calculateVertices(): void {
        this.vertices = [];
        for (let i = 0; i < this.sides; i++) {
            const angle = (i * 2 * Math.PI) / this.sides;
            const x = this.position.x + this.radius * Math.cos(angle);
            const y = this.position.y + this.radius * Math.sin(angle);
            this.vertices.push(new Vector(x, y));
        }
    }

    contains(point: Vector): boolean {
        // Placeholder - implement actual logic
        return false;
    }

    intersects(shape: Shape): boolean {
        switch(shape.getType()) {
            case ShapeType.CIRCLE:
                return (shape as CircleShape).intersectsPolygon(this);
            case ShapeType.RECTANGLE:
                // Implement logic
                return false;
            case ShapeType.TRAPEZOID:
                // Implement logic
                return false;
            case ShapeType.POLYGON:
                // Implement logic
                return false;
            default:
                return false;
        }
    }

    getAABB(): AABB {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const vertex of this.vertices) {
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
        }

        return { minX, minY, maxX, maxY };
    }

    getCollisionAxes(shape: Shape): Vector[] {
        // Return perpediculars vectors to each edge
        // To calculate a perpendicular vector, swap the x and y component,
        // then we negate the x components

    
        const axes: Vector[] = []


        return axes;
    }   

    project(axis: Vector): { min: number, max: number } {
        // Takes  each vertex of the polygon
        // Projects it onto the axis using dot product
        // Finds min/max of all projections
        
        let min = Infinity;
        let max = -Infinity;

        for (const vertex of this.vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return { min, max };
    }
}