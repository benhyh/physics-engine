/**
 * Main physics simulation world that manages:
 * - Rigid bodies
 * - Forces
 * - Collision detection and resolution
 * - Physics step integration
 * 
 * The physics world is responsible for:
 * 1. Managing all physical entities in the simulation
 * 2. Applying forces and updating body states
 * 3. Detecting and resolving collisions
 * 4. Maintaining simulation stability
 * 
 * @category Core
 */

import { CollisionDectector, CollisionPair } from "@/sims/CollisionDectector";
import { ForceRegistry } from "./ForceRegistry";
import { RigidBody } from "./RigidBody"

export class PhysicsWorld {
    private bodies: RigidBody[] = [];
    private forceRegistry: ForceRegistry;
    private collisionDectector: CollisionDectector;

    /**
     * Creates a new physics world instance
     * Initializes force registry and collision detector
     */
    constructor() {
        this.forceRegistry = new ForceRegistry();
        this.collisionDectector = new CollisionDectector();
    }

    /**
     * Adds a rigid body to the simulation
     * @param body - The rigid body to add
     * @throws {Error} If body is null/undefined
     * 
     * Pre-condition: body must be a valid RigidBody instance
     * Post-condition: body is added to simulation and tracked
     */
    addBody(body: RigidBody): void {
        if (!body) throw new Error("Body cannot be null/undefined");
        this.bodies.push(body);
    }

    /**
     * Removes a rigid body from the simulation
     * @param body - The rigid body to remove
     * 
     * Pre-condition: body must exist in simulation
     * Post-condition: body is removed from simulation
     */
    removeBody(body: RigidBody): void {
        const index = this.bodies.indexOf(body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
        }
    }

    /**
     * Advances the physics simulation by one time step
     * @param dt - Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
     * 
     * The step process:
     * 1. Update forces and apply them to bodies
     * 2. Detect collisions between bodies
     * 3. Resolve collisions
     * 4. Integrate body motion
     * 
     * Pre-condition: dt must be positive
     * Post-condition: Simulation state is updated
     */
    step(dt: number): void {
        if (dt <= 0) throw new Error("Time step must be positive");

        this.forceRegistry.updateForces(dt);

        const collisionPairs = this.collisionDectector.detectCollision(this.bodies);

        this.resolveCollisions(collisionPairs, dt);

        for (const body of this.bodies) {
            body.integrate(dt);
        }
    }
    
    /**
     * Resolves collisions between bodies
     * @param collisionPairs - Array of collision pairs to resolve
     * @param dt - Time step in seconds
     * 
     * Pre-condition: collisionPairs must be valid
     * Post-condition: Collisions are resolved and bodies are updated
     * 
     * TODO: Implement collision resolution
     * - Calculate collision response
     * - Apply impulses
     * - Handle friction and restitution
     */
    private resolveCollisions(collisionPairs: CollisionPair[], dt: number): void {
        // TODO: Implement collision resolution
    }
}