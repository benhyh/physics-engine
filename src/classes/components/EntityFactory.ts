/**
 * Factory for creating physics entities with common configurations.
 * 
 * Provides convenient methods to create entities with predefined
 * combinations of components, following common physics patterns.
 * 
 * @category Components
 */

import { PhysicsEntity, IShape } from "./PhysicsEntity";
import { RigidBody } from "../RigidBody";
import { Transform } from "./Transform";
import { Material } from "./Material";
import { Vector } from "../Vector";
import { ShapeType, AABB } from "../shapes/base/Shape";

/**
 * Configuration options for entity creation
 */
export interface EntityConfig {
    position?: Vector;
    rotation?: number;
    scale?: Vector;
    material?: Material;
    mass?: number;
    momentOfInertia?: number;
    isStatic?: boolean;
}

export class EntityFactory {
    /**
     * Creates a circle entity
     * @param radius - Circle radius
     * @param config - Optional configuration
     * @returns Circle physics entity
     */
    static createCircle(radius: number, config: EntityConfig = {}): PhysicsEntity {
        const shape = new CircleShapeGeometry(radius);
        return this.createEntity(shape, config);
    }

    /**
     * Creates an AABB entity
     * @param width - AABB width
     * @param height - AABB height
     * @param config - Optional configuration
     * @returns AABB physics entity
     */
    static createAABB(width: number, height: number, config: EntityConfig = {}): PhysicsEntity {
        const shape = new AABBShapeGeometry(width, height);
        return this.createEntity(shape, config);
    }

    /**
     * Creates a rectangle entity
     * @param width - Rectangle width
     * @param height - Rectangle height
     * @param config - Optional configuration
     * @returns Rectangle physics entity
     */
    static createRectangle(width: number, height: number, config: EntityConfig = {}): PhysicsEntity {
        const shape = new RectangleShapeGeometry(width, height);
        return this.createEntity(shape, config);
    }

    /**
     * Creates a polygon entity
     * @param vertices - Polygon vertices
     * @param config - Optional configuration
     * @returns Polygon physics entity
     */
    static createPolygon(vertices: Vector[], config: EntityConfig = {}): PhysicsEntity {
        const shape = new PolygonShapeGeometry(vertices);
        return this.createEntity(shape, config);
    }

    /**
     * Creates a regular polygon entity
     * @param sides - Number of sides
     * @param radius - Radius from center to vertex
     * @param config - Optional configuration
     * @returns Regular polygon physics entity
     */
    static createRegularPolygon(sides: number, radius: number, config: EntityConfig = {}): PhysicsEntity {
        const vertices: Vector[] = [];
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            vertices.push(new Vector(
                radius * Math.cos(angle),
                radius * Math.sin(angle)
            ));
        }
        return this.createPolygon(vertices, config);
    }

    /**
     * Creates a static (immovable) entity
     * @param shape - Shape geometry
     * @param config - Optional configuration
     * @returns Static physics entity
     */
    static createStatic(shape: IShape, config: EntityConfig = {}): PhysicsEntity {
        const staticConfig = { ...config, isStatic: true, mass: 0 };
        return this.createEntity(shape, staticConfig);
    }

    /**
     * Creates a kinematic (velocity-controlled) entity
     * @param shape - Shape geometry
     * @param config - Optional configuration
     * @returns Kinematic physics entity
     */
    static createKinematic(shape: IShape, config: EntityConfig = {}): PhysicsEntity {
        const entity = this.createEntity(shape, config);
        entity.body.inverseMass = 0; // Infinite mass but can move
        return entity;
    }

    /**
     * Internal method to create an entity from shape and config
     * @param shape - Shape geometry
     * @param config - Entity configuration
     * @returns Configured physics entity
     */
    private static createEntity(shape: IShape, config: EntityConfig): PhysicsEntity {
        const {
            position = new Vector(0, 0),
            rotation = 0,
            scale = new Vector(1, 1),
            material = new Material(),
            mass,
            momentOfInertia,
            isStatic = false
        } = config;

        // Calculate mass and inertia if not provided
        const area = shape.getArea();
        const finalMass = isStatic ? 0 : (mass ?? area * material.getDensity());
        const finalInertia = momentOfInertia ?? this.calculateMomentOfInertia(shape, finalMass);

        const body = new RigidBody(finalMass, position, finalInertia);
        const transform = new Transform(position, rotation, scale);

        if (isStatic) {
            body.inverseMass = 0;
            body.inverseInertia = 0;
        }

        return new PhysicsEntity(body, shape, transform, material);
    }

    /**
     * Calculates moment of inertia for a shape
     * @param shape - Shape geometry
     * @param mass - Mass of the object
     * @returns Moment of inertia
     */
    private static calculateMomentOfInertia(shape: IShape, mass: number): number {
        switch (shape.type) {
            case ShapeType.CIRCLE:
                const circleShape = shape as CircleShapeGeometry;
                return 0.5 * mass * circleShape.radius * circleShape.radius;
            
            case ShapeType.AABB:
            case ShapeType.RECTANGLE:
                const bounds = shape.getBounds();
                const width = bounds.maxX - bounds.minX;
                const height = bounds.maxY - bounds.minY;
                return (mass * (width * width + height * height)) / 12;
            
            case ShapeType.POLYGON:
                // Use bounding box approximation for now
                const polyBounds = shape.getBounds();
                const polyWidth = polyBounds.maxX - polyBounds.minX;
                const polyHeight = polyBounds.maxY - polyBounds.minY;
                return (mass * (polyWidth * polyWidth + polyHeight * polyHeight)) / 12;
            
            default:
                return mass; // Default fallback
        }
    }

    /**
     * Predefined entity configurations for common use cases
     */
    static readonly PRESETS = {
        /**
         * Creates a bouncing ball
         */
        BOUNCING_BALL: (radius: number, position?: Vector) => 
            EntityFactory.createCircle(radius, {
                position,
                material: Material.PRESETS.BOUNCY_BALL
            }),

        /**
         * Creates a static ground platform
         */
        GROUND: (width: number, height: number = 50, position?: Vector) =>
            EntityFactory.createStatic(
                new AABBShapeGeometry(width, height),
                { position, material: Material.PRESETS.STONE }
            ),

        /**
         * Creates a wooden box
         */
        WOODEN_BOX: (size: number, position?: Vector) =>
            EntityFactory.createRectangle(size, size, {
                position,
                material: Material.PRESETS.WOOD
            }),

        /**
         * Creates a steel ball
         */
        STEEL_BALL: (radius: number, position?: Vector) =>
            EntityFactory.createCircle(radius, {
                position,
                material: Material.PRESETS.STEEL
            })
    };
}

// Temporary geometry classes (to be replaced with actual shape implementations)
class CircleShapeGeometry implements IShape {
    readonly type = ShapeType.CIRCLE;
    
    constructor(public radius: number) {}
    
    getBounds(): AABB {
        return {
            minX: -this.radius,
            minY: -this.radius,
            maxX: this.radius,
            maxY: this.radius
        };
    }
    
    getVertices(): Vector[] {
        // Approximate circle with octagon for now
        const vertices: Vector[] = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * 2 * Math.PI) / 8;
            vertices.push(new Vector(
                this.radius * Math.cos(angle),
                this.radius * Math.sin(angle)
            ));
        }
        return vertices;
    }
    
    containsPoint(point: Vector): boolean {
        return point.magnitude() <= this.radius;
    }
    
    project(axis: Vector): { min: number, max: number } {
        const center = new Vector(0, 0);
        const centerProjection = center.dot(axis);
        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius
        };
    }
    
    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
    
    getCentroid(): Vector {
        return new Vector(0, 0);
    }
}

class AABBShapeGeometry implements IShape {
    readonly type = ShapeType.AABB;
    
    constructor(public width: number, public height: number) {}
    
    getBounds(): AABB {
        return {
            minX: -this.width / 2,
            minY: -this.height / 2,
            maxX: this.width / 2,
            maxY: this.height / 2
        };
    }
    
    getVertices(): Vector[] {
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        return [
            new Vector(-halfW, -halfH),
            new Vector(halfW, -halfH),
            new Vector(halfW, halfH),
            new Vector(-halfW, halfH)
        ];
    }
    
    containsPoint(point: Vector): boolean {
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        return point.x >= -halfW && point.x <= halfW &&
               point.y >= -halfH && point.y <= halfH;
    }
    
    project(axis: Vector): { min: number, max: number } {
        const vertices = this.getVertices();
        let min = Infinity, max = -Infinity;
        
        for (const vertex of vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        
        return { min, max };
    }
    
    getArea(): number {
        return this.width * this.height;
    }
    
    getCentroid(): Vector {
        return new Vector(0, 0);
    }
}

class RectangleShapeGeometry implements IShape {
    readonly type = ShapeType.RECTANGLE;
    
    constructor(public width: number, public height: number) {}
    
    getBounds(): AABB {
        return {
            minX: 0,
            minY: 0,
            maxX: this.width,
            maxY: this.height
        };
    }
    
    getVertices(): Vector[] {
        return [
            new Vector(0, 0),
            new Vector(this.width, 0),
            new Vector(this.width, this.height),
            new Vector(0, this.height)
        ];
    }
    
    containsPoint(point: Vector): boolean {
        return point.x >= 0 && point.x <= this.width &&
               point.y >= 0 && point.y <= this.height;
    }
    
    project(axis: Vector): { min: number, max: number } {
        const vertices = this.getVertices();
        let min = Infinity, max = -Infinity;
        
        for (const vertex of vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        
        return { min, max };
    }
    
    getArea(): number {
        return this.width * this.height;
    }
    
    getCentroid(): Vector {
        return new Vector(this.width / 2, this.height / 2);
    }
}

class PolygonShapeGeometry implements IShape {
    readonly type = ShapeType.POLYGON;
    
    constructor(public vertices: Vector[]) {}
    
    getBounds(): AABB {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        for (const vertex of this.vertices) {
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
        }
        
        return { minX, minY, maxX, maxY };
    }
    
    getVertices(): Vector[] {
        return [...this.vertices];
    }
    
    containsPoint(point: Vector): boolean {
        // Ray casting algorithm for point-in-polygon
        let inside = false;
        const n = this.vertices.length;
        
        for (let i = 0, j = n - 1; i < n; j = i++) {
            if (((this.vertices[i].y > point.y) !== (this.vertices[j].y > point.y)) &&
                (point.x < (this.vertices[j].x - this.vertices[i].x) * 
                 (point.y - this.vertices[i].y) / (this.vertices[j].y - this.vertices[i].y) + this.vertices[i].x)) {
                inside = !inside;
            }
        }
        
        return inside;
    }
    
    project(axis: Vector): { min: number, max: number } {
        let min = Infinity, max = -Infinity;
        
        for (const vertex of this.vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        
        return { min, max };
    }
    
    getArea(): number {
        // Shoelace formula
        let area = 0;
        const n = this.vertices.length;
        
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += this.vertices[i].x * this.vertices[j].y;
            area -= this.vertices[j].x * this.vertices[i].y;
        }
        
        return Math.abs(area) / 2;
    }
    
    getCentroid(): Vector {
        let cx = 0, cy = 0;
        const n = this.vertices.length;
        
        for (const vertex of this.vertices) {
            cx += vertex.x;
            cy += vertex.y;
        }
        
        return new Vector(cx / n, cy / n);
    }
} 