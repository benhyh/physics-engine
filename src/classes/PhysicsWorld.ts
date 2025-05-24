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
import { Vector } from "./Vector";


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

        this.resolveCollisions(collisionPairs);

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
     */
    private resolveCollisions(collisions: CollisionPair[]): void {
        if (collisions == null) return;

        for (const pair of collisions) {
            const { bodyA, bodyB, info } = pair;
    
            // --- Step 1: Pre-calculations ---
            // Relative velocity at contact point (including rotation)
            const rv = this.getRelativeVelocity(bodyA, bodyB, info.contactPoint);
    
            // Skip if objects are separating (dot product > 0)
            if (rv.dot(info.normal) > 0) continue;
    
            // Combined restitution (use min/max depending on desired behavior)
            const cor = Math.min(bodyA.restitution, bodyB.restitution);
    
            // --- Step 2: Calculate impulse ---
            const normal = info.normal;
            const rA = info.contactPoint.subtract(bodyA.position);
            const rB = info.contactPoint.subtract(bodyB.position);
    
            // Impulse denominator (inverse masses + rotational effects)
            const invMassSum = bodyA.inverseMass + bodyB.inverseMass;
            const rotationalEffects = 
                bodyA.inverseInertia * rA.cross(normal) ** 2 +
                bodyB.inverseInertia * rB.cross(normal) ** 2;
            const impulseDenominator = invMassSum + rotationalEffects;
    
            // Impulse magnitude (j)
            const j = -(1 + cor) * rv.dot(normal) / impulseDenominator;
            const impulse = normal.multiply(j);
    
            // --- Step 3: Apply impulse ---
            // Linear velocity change
            bodyA.velocity = bodyA.velocity.subtract(impulse.multiply(bodyA.inverseMass));
            bodyB.velocity = bodyB.velocity.add(impulse.multiply(bodyB.inverseMass));
    
            // Angular velocity change (torque from cross product)
            bodyA.angularVelocity -= bodyA.inverseInertia * rA.cross(impulse);
            bodyB.angularVelocity += bodyB.inverseInertia * rB.cross(impulse);
    
            // --- Step 4: Special cases ---
            // Position correction (optional: prevents sinking)
            if (info.depth > 0.01) {
                const percent = 0.8; // Correction percentage
                const slop = 0.01;   // Penetration allowance
                const correction = normal.multiply(
                    Math.max(info.depth - slop, 0) / invMassSum * percent
                );
                bodyA.position = bodyA.position.subtract(correction.multiply(bodyA.inverseMass));
                bodyB.position = bodyB.position.add(correction.multiply(bodyB.inverseMass));
            }
    
            // --- Step 5: Friction ---
            const tangent = rv.subtract(normal.multiply(rv.dot(normal))).normalize();
            if (tangent.lengthSquared() > 0.001) {
                // Friction impulse magnitude (simplified Coulomb friction)
                const jt = -rv.dot(tangent) / impulseDenominator;
                const frictionCoeff = 0.2; // Adjust based on materials
                const jtClamped = Math.min(Math.abs(jt), j * frictionCoeff) * Math.sign(jt);
    
                // Apply friction impulse
                const frictionImpulse = tangent.multiply(jtClamped);
                bodyA.velocity = bodyA.velocity.subtract(frictionImpulse.multiply(bodyA.inverseMass));
                bodyB.velocity = bodyB.velocity.add(frictionImpulse.multiply(bodyB.inverseMass));
            }
        }
    }

    private getRelativeVelocity(bodyA: RigidBody, bodyB: RigidBody, contactPoint: Vector): Vector {
        const velA = bodyA.velocity.add(
            new Vector(-bodyA.angularVelocity * (contactPoint.y - bodyA.position.y),
                     bodyA.angularVelocity * (contactPoint.x - bodyA.position.x))
        );
        const velB = bodyB.velocity.add(
            new Vector(-bodyB.angularVelocity * (contactPoint.y - bodyB.position.y),
                     bodyB.angularVelocity * (contactPoint.x - bodyB.position.x))
        );
        return velB.subtract(velA);
    }
}