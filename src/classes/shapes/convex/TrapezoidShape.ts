import { Shape, ShapeType, AABB } from "./base/Shape";
import { Vector } from "../Vector";
import { CircleShape } from "./convex/CircleShape";

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

    getVertices(): Vector[] {
        const topWidth = this.width;
        const bottomWidth = this.width + (2 * this.slope * this.height);
        
        return [
            // Top corners
            new Vector(this.position.x - topWidth/2, this.position.y - this.height/2),
            new Vector(this.position.x + topWidth/2, this.position.y - this.height/2),
            // Bottom corners
            new Vector(this.position.x + bottomWidth/2, this.position.y + this.height/2),
            new Vector(this.position.x - bottomWidth/2, this.position.y + this.height/2)
        ];
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

    getCollisionAxes(): Vector[] {
        const axes: Vector[] = [];
        const corners = this.getVertices();
        
        for (let i = 0; i < corners.length; i++) {
            const current = corners[i];
            const next = corners[(i + 1) % corners.length];
            
            // Calculate the edge vector by subtracting current from next
            const edge = next.subtract(current);
            
            // Calculate the normal vector by rotating the edge 90 degrees
            // In 2D, rotating (x,y) 90 degrees gives (-y,x)
            const normal = new Vector(-edge.y, edge.x).normalize();
            
            axes.push(normal);
        }
        
        return axes;
    }
}