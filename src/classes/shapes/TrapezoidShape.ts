import { Shape, ShapeType, AABB } from "./base/Shape";
import { Vector } from "../Vector";
import { CircleShape } from "./CircleShape";

export class TrapezoidShape extends Shape {
    private width: number;
    private height: number;
    private slope: number;

    constructor(
        width: number = 1,
        height: number = 1,
        slope: number = 0.5,
        position: Vector = new Vector(0, 0)
    ) {
        super(ShapeType.TRAPEZOID, position);
        this.width = width;
        this.height = height;
        this.slope = slope;
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

    getSlope(): number {
        return this.slope;
    }

    setSlope(slope: number): void {
        this.slope = slope;
    }

    contains(point: Vector): boolean {
        // Placeholder - implement actual logic
        return false;
    }

    intersects(shape: Shape): boolean {
        switch(shape.getType()) {
            case ShapeType.CIRCLE:
                return (shape as CircleShape).intersectsTrapezoid(this);
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
        const topWidth = this.width;
        const bottomWidth = this.width + (2 * this.slope * this.height);
        const maxWidth = Math.max(topWidth, bottomWidth);
        
        return {
            minX: this.position.x - maxWidth / 2,
            minY: this.position.y - this.height / 2,
            maxX: this.position.x + maxWidth / 2,
            maxY: this.position.y + this.height / 2
        };
    }

    project(axis: Vector): { min: number, max: number } {
        // Get the four corners of the trapezoid
        const topWidth = this.width;
        const bottomWidth = this.width + (2 * this.slope * this.height);
        
        const corners = [
            // Top corners
            new Vector(this.position.x - topWidth/2, this.position.y - this.height/2),
            new Vector(this.position.x + topWidth/2, this.position.y - this.height/2),
            // Bottom corners
            new Vector(this.position.x - bottomWidth/2, this.position.y + this.height/2),
            new Vector(this.position.x + bottomWidth/2, this.position.y + this.height/2)
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
}