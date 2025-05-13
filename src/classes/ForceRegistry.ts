/**
 * Manages the registration and application of forces to rigid bodies
 */
export class ForceRegistry {
    private forceBodyPairs: Map<RigidBody, Force[]>;

    constructor() {
        // TODO: Initialize the registry
        // - Create empty map for force-body pairs
    }

    /**
     * Register a force to act on a body
     * @param body The rigid body
     * @param force The force to apply
     * Pre-condition: body and force are valid
     * Post-condition: force is registered to act on body
     */
    add(body: RigidBody, force: Force): void {
        // TODO: Implement force registration
        // - Check if body exists in map
        // - Add force to body's force list
    }

    /**
     * Remove a force from a body
     * @param body The rigid body
     * @param force The force to remove
     * Pre-condition: body and force are valid
     * Post-condition: force is removed from body's force list
     */
    remove(body: RigidBody, force: Force): void {
        // TODO: Implement force removal
        // - Find force in body's force list
        // - Remove force from list
    }

    /**
     * Update all registered forces
     * @param dt Time step
     * Pre-condition: dt > 0
     * Post-condition: all forces are applied to their respective bodies
     */
    updateForces(dt: number): void {
        // TODO: Implement force updates
        // - Iterate through all force-body pairs
        // - Apply each force to its body
        

    }


}