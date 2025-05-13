import { Force } from "./Force";
import { RigidBody } from "./RigidBody";

/**
 * Manages the registration and application of forces to rigid bodies in the physics simulation.
 * 
 * The ForceRegistry maintains a mapping between rigid bodies and the forces acting upon them.
 * It provides methods to:
 * - Register forces to bodies
 * - Remove forces from bodies
 * - Update all registered forces and integrate body motion
 * 
 * @category Core
 */
export class ForceRegistry {
    /**
     * Map storing the relationship between rigid bodies and their associated forces.
     * Each body can have multiple forces acting upon it.
     */
    private forceBodyPairs: Map<RigidBody, Force[]>;

    /**
     * Creates a new ForceRegistry instance.
     * Initializes an empty map for storing force-body pairs.
     */
    constructor() {
        this.forceBodyPairs = new Map<RigidBody, Force[]>();
    }

    /**
     * Registers a force to act on a specific rigid body.
     * @param body - The rigid body to apply the force to
     * @param force - The force to be applied
     * @throws {Error} If either body or force is null/undefined
     */
    add(body: RigidBody, force: Force): void {
        if (!force || !body) throw new Error("Force/body is undefined/null/invalid.");

        const forces = this.forceBodyPairs.get(body) || [];
        forces.push(force);

        if (!this.forceBodyPairs.has(body)) {
            this.forceBodyPairs.set(body, forces);
        }
    }

    /**
     * Removes a specific force from a rigid body.
     * @param body - The rigid body to remove the force from
     * @param force - The force to be removed
     */
    remove(body: RigidBody, force: Force): void {
        if (!this.forceBodyPairs.has(body)) return;

        const forces = this.forceBodyPairs.get(body)!;
        const updatedForces = forces.filter(f => f !== force);

        this.forceBodyPairs.set(body, updatedForces);
    }

    /**
     * Updates all registered forces and integrates the motion of all bodies.
     * This method:
     * 1. Applies all registered forces to their respective bodies
     * 2. Integrates the motion of each body using the provided time step
     * 
     * @param dt - The time step for integration in seconds
     * @throws {Error} If dt is less than or equal to zero
     */
    updateForces(dt: number): void {
        if (dt <= 0) throw new Error("Invalid time step, must be greater than 0.");

        this.forceBodyPairs.forEach((forces, body) => {
            forces.forEach(force => force.apply(body));
        });

        this.forceBodyPairs.forEach((_, body) => {
            body.integrate(dt);
        });
    }
}