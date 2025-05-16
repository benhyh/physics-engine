/**
 * Implements a viscous damping force that opposes motion
 * 
 * This force follows the formula F = -cv where:
 * - c is the damping coefficient (in kg/s)
 * - v is the velocity vector of the rigid body
 * 
 * Damping forces are commonly used to simulate:
 * - Fluid resistance/drag
 * - Internal energy dissipation
 * - Numerical stabilization of simulations
 * 
 * @category Forces
 */

import { RigidBody } from "../../RigidBody";
import { Force, ForceType } from "../base/Force";

export class DampingForce extends Force {
    /** The damping coefficient (in kg/s) */
    private dampingCoefficient: number;
    
    /**
     * Creates a new damping force with the specified coefficient
     * @param dampingCoefficient - The damping coefficient (in kg/s)
     */
    constructor(dampingCoefficient: number = 1){
        super(ForceType.DAMPING);
        this.dampingCoefficient = dampingCoefficient;
    }

    /**
     * Applies the damping force to a rigid body
     * @param body - The rigid body to apply the force to
     * 
     * Pre-condition: body is a valid RigidBody
     * Post-condition: Damping force proportional to negative velocity is added to body's force accumulator
     */
    apply(body: RigidBody): void {
        const velocity = body.velocity;
        const force = velocity.multiply(this.dampingCoefficient * -1);
        body.addForce(force);
    }
    
    /**
     * Sets the damping coefficient
     * @param dampingCoefficient - The new damping coefficient value
     */
    setDampingCoefficient(dampingCoefficient: number): void {
        this.dampingCoefficient = dampingCoefficient;
    }

    /**
     * Gets the current damping coefficient
     * @returns The damping coefficient (in kg/s)
     */
    getDampingCoefficient(): number {
        return this.dampingCoefficient;
    }
}
