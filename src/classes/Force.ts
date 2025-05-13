/**
 * Base class for all forces in the physics engine.
 * Each force type must implement the apply method.
 */
export abstract class Force {
    protected magnitude: number;
    protected direction: Vector;
    protected type: ForceType;

    constructor(type: ForceType) {
        // TODO: Initialize force properties
        // - Set force type
        // - Initialize magnitude and direction
    }

    /**
     * Apply the force to a rigid body
     * @param body The rigid body to apply the force to
     * Pre-condition: body is a valid RigidBody
     * Post-condition: force is added to body's force accumulator
     */
    abstract apply(body: RigidBody): void;
}