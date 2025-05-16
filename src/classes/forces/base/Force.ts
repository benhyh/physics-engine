/**
 * Base class for all forces in the physics engine.
 * 
 * This abstract class defines the common interface and properties that all forces must implement.
 * Forces are fundamental components that apply acceleration to rigid bodies based on physical laws.
 * 
 * The Force class provides:
 * - Basic properties common to all forces (magnitude, direction, type)
 * - Abstract method for applying the force to a rigid body
 * - Accessor methods for force properties
 * 
 * @category Core
 */

import { RigidBody } from "../../RigidBody";
import { Vector } from "../../Vector";

/**
 * Enumeration of different force types supported by the engine
 * @enum {number}
 */
export enum ForceType {
    /** Gravitational force */
    GRAVITY,
    /** Spring force following Hooke's law */
    SPRING,
    /** Viscous damping force */
    DAMPING,
    /** Friction force between surfaces */
    FRICTION,
    /** Air resistance force */
    AIR_RESISTANCE,
    /** Buoyancy force in fluid */
    BUOYANCY
}

export abstract class Force {
    /** Magnitude of the force (in Newtons) */
    protected magnitude: number;
    
    /** Direction of the force as a unit vector */
    protected direction: Vector;
    
    /** Type classification of the force */
    protected type: ForceType;

    /**
     * Creates a new force with the specified properties
     * @param type - The type of force
     * @param magnitude - The magnitude of the force (in Newtons)
     * @param direction - The direction of the force as a unit vector
     */
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
     * 
     * This abstract method must be implemented by all concrete force classes.
     * The implementation should calculate the appropriate force vector and
     * add it to the body's force accumulator.
     * 
     * @param body - The rigid body to apply the force to
     * 
     * Pre-condition: body is a valid RigidBody
     * Post-condition: force is added to body's force accumulator
     */
    abstract apply(body: RigidBody): void;

    /**
     * Gets the type of this force
     * @returns The force type
     */
    getType(): ForceType {
        return this.type;
    }

    /**
     * Gets the magnitude of this force
     * @returns The magnitude in Newtons
     */
    getMagnitude(): number {
        return this.magnitude;
    }

    /**
     * Gets the direction of this force
     * @returns The direction as a unit vector
     */
    getDirection(): Vector {
        return this.direction;
    }
}