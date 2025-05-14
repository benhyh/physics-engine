/**
 * Base class for all forces in the physics engine.
 * Each force type must implement the apply method.
 */

import { RigidBody } from "../../RigidBody";
import { Vector } from "../../Vector";

export enum ForceType {
    GRAVITY,
    SPRING,
    DAMPING,
    FRICTION,
    AIR_RESISTANCE,
    BUOYANCY
}

export abstract class Force {
    protected magnitude: number;
    protected direction: Vector;
    protected type: ForceType;

    constructor(
        type: ForceType,
        magnitude: number = 0,
        direction: Vector = new Vector(0,0)
    ) {
        // TODO: Initialize force properties
        // - Set force type
        // - Initialize magnitude and direction
        this.type = type;
        this.magnitude = magnitude;
        this.direction = direction;
    }
    /**
     * Apply the force to a rigid body
     * @param body The rigid body to apply the force to
     * Pre-condition: body is a valid RigidBody
     * Post-condition: force is added to body's force accumulator
     */
    abstract apply(body: RigidBody): void;

    getType(): ForceType {
        return this.type;
    }

    getMagnitude(): number {
        return this.magnitude;
    }

    getDirection(): Vector {
        return this.direction;
    }
}