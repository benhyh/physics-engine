import { Shape, ShapeType, AABB } from "../base/Shape";
import { Vector } from "../../Vector";
import { CircleShape } from "./CircleShape";
import { IShape } from "../../components/PhysicsEntity";

export class PolygonShape extends Shape implements IShape {
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

    getBounds(): AABB {
        return this.getAABB();
    }

    containsPoint(point: Vector): boolean {
        // Ray casting algorithm for point-in-polygon test
        let inside = false;
        const vertices = this.vertices;
        
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y;
            const xj = vertices[j].x, yj = vertices[j].y;
            
            if (((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        
        return inside;
    }

    getArea(): number {
        // Shoelace formula for polygon area
        let area = 0;
        const vertices = this.vertices;
        
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            area += vertices[i].x * vertices[j].y;
            area -= vertices[j].x * vertices[i].y;
        }
        
        return Math.abs(area) / 2;
    }

    getCentroid(): Vector {
        // Calculate centroid of polygon
        let cx = 0, cy = 0;
        let area = 0;
        const vertices = this.vertices;
        
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            const cross = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
            area += cross;
            cx += (vertices[i].x + vertices[j].x) * cross;
            cy += (vertices[i].y + vertices[j].y) * cross;
        }
        
        area /= 2;
        cx /= (6 * area);
        cy /= (6 * area);
        
        return new Vector(cx, cy);
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
        return this.containsPoint(point);
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

    getCollisionAxes(): Vector[] {
        const axes: Vector[] = [];
        
        // For each edge, calculate its normal vector
        for (let i = 0; i < this.vertices.length; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];
            
            // Get edge vector
            const edge = next.subtract(current);
            
            // Calculate normal (perpendicular) vector
            // For a 2D vector (x,y), the normal is (-y,x)
            const normal = new Vector(-edge.y, edge.x).normalize();
            
            axes.push(normal);
        }
      
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