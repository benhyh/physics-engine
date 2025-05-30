/**
 * Centralized collision detection system.
 * 
 * This system handles all collision detection between different shape types
 * using a registry of specialized collision algorithms. 
 * 
 * @category Core
 */

import { CollisionInfo } from "./CollisionInfo";
import { Vector } from "../Vector";
import { ShapeType } from "../shapes/base/Shape";
import { RigidBody } from "../RigidBody";
import { AABBAABBAlgorithm, AABBCircleAlgorithm, AABBPolygonAlgorithm } from "./AABB/AABBCollisions";
import { CircleCircleAlgorithm, CircleAABBAlgorithm, CirclePolygonAlgorithm } from "./circle/CircleCollisions";
import { PolygonAABBAlgorithm, PolygonCircleAlgorithm, PolygonPolygonAlgorithm } from "./polygon/PolygonCollisions";
import { RectangleRectangleAlgorithm } from "./rectangle/RectangleCollision";
import { TrapezoidTrapezoidAlgorithm } from "./trapezoid/TrapezoidCollision";

/**
 * Interface for collision detection algorithms
 */
export interface CollisionAlgorithm {
    /**
     * Detects collision between two entities
     * @param entityA - First physics entity
     * @param entityB - Second physics entity
     * @returns CollisionInfo if collision detected, null otherwise
     */
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null;
}

/**
 * Represents a complete physics entity with body, shape, and transform
 */
export interface PhysicsEntity {
    body: RigidBody;
    shape: IShape;
    transform: Transform;
    material: Material;
}

/**
 * Pure geometry interface - no collision logic
 */
export interface IShape {
    readonly type: ShapeType;
    getBounds(): AABB;
    getVertices(): Vector[];
    containsPoint(point: Vector): boolean;
    
    // Geometric operations only
    project(axis: Vector): { min: number, max: number };
    getArea(): number;
    getCentroid(): Vector;
}

/**
 * Spatial transformation data
 */
export interface Transform {
    position: Vector;
    rotation: number;
    scale: Vector;
}

/**
 * Material properties for physics simulation
 */
export interface Material {
    density: number;
    friction: number;
    restitution: number;
}

/**
 * Axis-Aligned Bounding Box
 */
export interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

/**
 * Main collision detection system
 */
export class CollisionSystem {
    private algorithms = new Map<string, CollisionAlgorithm>();
    
    constructor() {
        this.registerDefaultAlgorithms();
    }
    
    /**
     * Registers default collision algorithms for all shape combinations
     */
    private registerDefaultAlgorithms(): void {
        // AABB collision algorithms
        this.algorithms.set('AABB_AABB', new AABBAABBAlgorithm());
        this.algorithms.set('AABB_CIRCLE', new AABBCircleAlgorithm());
        this.algorithms.set('AABB_POLYGON', new AABBPolygonAlgorithm());
        
        // Circle collision algorithms  
        this.algorithms.set('CIRCLE_CIRCLE', new CircleCircleAlgorithm());
        this.algorithms.set('CIRCLE_AABB', new CircleAABBAlgorithm());
        this.algorithms.set('CIRCLE_POLYGON', new CirclePolygonAlgorithm());
        
        // Polygon collision algorithms
        this.algorithms.set('POLYGON_POLYGON', new PolygonPolygonAlgorithm());
        this.algorithms.set('POLYGON_AABB', new PolygonAABBAlgorithm());
        this.algorithms.set('POLYGON_CIRCLE', new PolygonCircleAlgorithm());
        
        // Rectangle and Trapezoid algorithms
        this.algorithms.set('RECTANGLE_RECTANGLE', new RectangleRectangleAlgorithm());
        this.algorithms.set('TRAPEZOID_TRAPEZOID', new TrapezoidTrapezoidAlgorithm());
    }
    
    /**
     * Detects collision between two physics entities
     * @param entityA - First entity
     * @param entityB - Second entity
     * @returns CollisionInfo if collision detected, null otherwise
     */
    detectCollision(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        const key = this.getAlgorithmKey(entityA.shape.type, entityB.shape.type);
        const algorithm = this.algorithms.get(key);
        
        if (!algorithm) {
            console.warn(`No collision algorithm found for ${entityA.shape.type} vs ${entityB.shape.type}`);
            return null;
        }
        
        return algorithm.detect(entityA, entityB);
    }
    
    /**
     * Registers a custom collision algorithm
     * @param shapeTypeA - First shape type
     * @param shapeTypeB - Second shape type  
     * @param algorithm - Collision algorithm implementation
     */
    registerAlgorithm(shapeTypeA: ShapeType, shapeTypeB: ShapeType, algorithm: CollisionAlgorithm): void {
        const key = this.getAlgorithmKey(shapeTypeA, shapeTypeB);
        this.algorithms.set(key, algorithm);
    }
    
    /**
     * Generates a consistent key for algorithm lookup
     * @param typeA - First shape type
     * @param typeB - Second shape type
     * @returns Algorithm lookup key
     */
    private getAlgorithmKey(typeA: ShapeType, typeB: ShapeType): string {
        // Ensure consistent ordering for symmetric algorithms
        const types = [typeA, typeB].sort();
        return `${ShapeType[types[0]]}_${ShapeType[types[1]]}`;
    }
}
