/**
 * Base class for all shapes / convex polygons.
 * 
 * This abstract class defines the commmon interface and interfaces that all shapes / convex polygons must implement.
 * They will serve as a fundamental aspect of collision-detection and demo. 
 * 
 * 
 * The Shape Class will provide:
 * - Basic properties common to all shapes
 * - Accessor methods for shape properties
 * - Abstract methods for interacting with shapes
 * 
 * methods:
 * contains(point)
 * intersects(shape)
 * getAABB()
 * 
 * include data about position, rotation, etc.
 * 
 * @category Core
 */

import { Vector } from "@/classes/Vector";
import { RigidBody } from "../../RigidBody";


/**
 * Enumeration of difference shape types supported by the engine
 * @enum {number}
 */
export enum ShapeType {
    CIRCLE,
    POLYGON,
    RECTANGLE,
    TRAPEZOID
}

export interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export abstract class Shape {
    protected position: Vector;
    protected type: ShapeType;
    protected rotation: Vector;
    protected parent: RigidBody | null;

    constructor (
        type: ShapeType,
        position: Vector = new Vector(0, 0),
        rotation: Vector = new Vector(0, 0)
    ) {
        this.type = type;
        this.position = position;
        this.rotation = rotation;
        this.parent = null;
    }

    getType(): ShapeType {
        return this.type;
    }

    getPosition(): Vector {
        return this.position;
    }

    getRotation(): Vector {
        return this.rotation;
    }

    setPosition(position: Vector): void {
        this.position = position;
    }

    setParent(body: RigidBody): void {
        this.parent = body;
    }

    getParent(): RigidBody | null {
        return this.parent;
    }

    abstract contains(point: Vector): boolean;

    abstract intersects(shape: Shape): boolean;

    abstract getAABB(): AABB;

    abstract getCollisionAxes(shape: Shape): Vector[];

    abstract project(axis: Vector): { min: number, max: number };
}   