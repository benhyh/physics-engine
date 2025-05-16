import { Vector } from "./Vector";

/**
 * Represents a rigid body in the physics simulation.
 * 
 * A rigid body is an idealized solid body that maintains its shape and size during simulation.
 * This class provides the foundation for all physical entities in the simulation, implementing:
 * 
 * - Linear motion (position, velocity, acceleration)
 * - Angular motion (rotation, angular velocity, angular acceleration)
 * - Force and torque accumulation
 * - Integration of motion using Euler's method
 * 
 * The simulation treats rigid bodies as having uniform density and a fixed mass.
 * 
 * @category Core
 */
export class RigidBody {
    /** 
     * Mass of the body in kilograms.
     * Determines how the body responds to forces.
     */
    public mass: number;
    
    /** 
     * Current position vector of the body's center of mass.
     * Represents the location in 2D world space.
     */
    public position: Vector;
    
    /** 
     * Current velocity vector of the body.
     * Represents the rate of change of position.
     */
    public velocity: Vector;
    
    /** 
     * Current acceleration vector of the body.
     * Represents the rate of change of velocity.
     */
    public acceleration: Vector;
    
    /** 
     * Accumulated forces acting on the body.
     * Reset after each integration step.
     */
    public forceAccumulator: Vector;
    
    /** 
     * Accumulated torque acting on the body.
     * Reset after each integration step.
     */
    public torqueAccumulator: number;
    
    /** 
     * Current rotation angle in radians.
     * Positive values represent counter-clockwise rotation.
     */
    public rotation: number;
    
    /** 
     * Current angular velocity in radians per second.
     * Represents the rate of change of rotation.
     */
    public angularVelocity: number;
    
    /** 
     * Current angular acceleration in radians per second squared.
     * Represents the rate of change of angular velocity.
     */
    public angularAcceleration: number;
    
    /** 
     * Moment of inertia of the body.
     * Determines resistance to changes in angular velocity.
     */
    public momentOfInertia: number;
    
    /** 
     * Linear damping coefficient (0-1).
     * Controls velocity reduction over time to simulate drag.
     * Values closer to 1 maintain more velocity.
     */
    public linearDamping: number;
    
    /** 
     * Angular damping coefficient (0-1).
     * Controls angular velocity reduction over time.
     * Values closer to 1 maintain more angular velocity.
     */
    public angularDamping: number;

    /**
     * Creates a new rigid body with the specified properties
     * 
     * @param mass - The mass of the body in kilograms
     * @param position - The initial position vector
     * @param momentOfInertia - The moment of inertia of the body
     * 
     * @example
     * ```typescript
     * // Create a 2kg body at position (100, 200)
     * const body = new RigidBody(2, new Vector(100, 200));
     * ```
     */
    constructor(mass: number = 1, position: Vector = new Vector(0,0), momentOfInertia: number = 1) {
        this.mass = mass;
        this.position = position;
        this.momentOfInertia = momentOfInertia;
        this.velocity = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.forceAccumulator = new Vector(0, 0);
        this.rotation = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.torqueAccumulator = 0;
        this.linearDamping = 0.99;
        this.angularDamping = 0.99;
    }

    /**
     * Adds a force to the force accumulator
     * 
     * Forces are accumulated until the next integration step,
     * at which point they are used to calculate acceleration
     * and then cleared.
     * 
     * @param force - The force vector to add
     * @throws {Error} If force is null or undefined
     * 
     * @example
     * ```typescript
     * // Apply a downward gravity force
     * body.addForce(new Vector(0, 9.81 * body.mass));
     * ```
     */
    addForce(force: Vector): void {
        if (!force) {
            throw new Error("Force cannot be null or undefined");
        }
        this.forceAccumulator = this.forceAccumulator.add(force);
    }

    /**
     * Adds a torque to the torque accumulator
     * 
     * Torque is accumulated until the next integration step,
     * at which point it is used to calculate angular acceleration
     * and then cleared.
     * 
     * @param torque - The torque value to add
     * @throws {Error} If torque is null or undefined
     * 
     * @example
     * ```typescript
     * // Apply a rotational torque
     * body.addTorque(5.0);
     * ```
     */
    addTorque(torque: number): void {
        if (torque == null || torque == undefined) {
            throw new Error("Torque cannot be null or undefined");
        }
        this.torqueAccumulator += torque;
    }

    /**
     * Clears all accumulated forces and torques
     * 
     * This is typically called at the end of each integration step
     * after forces have been used to update the body's state.
     * 
     * @example
     * ```typescript
     * // Reset force and torque accumulators
     * body.clearAccumulators();
     * ```
     */
    clearAccumulators(): void {
        this.forceAccumulator = new Vector(0,0);
        this.torqueAccumulator = 0;
    }

    /**
     * Updates the body's state using Euler integration
     * 
     * This method:
     * 1. Calculates acceleration from accumulated forces
     * 2. Updates velocity based on acceleration
     * 3. Updates position based on velocity
     * 4. Updates angular motion similarly
     * 5. Applies damping to stabilize the simulation
     * 6. Clears accumulators for the next step
     * 
     * @param dt - Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
     * 
     * @example
     * ```typescript
     * // Update physics with a 16ms time step (approx. 60 FPS)
     * body.integrate(0.016);
     * ```
     */
    integrate(dt: number): void {
        if (dt <= 0) {
            throw new Error("Time step must be greater than zero");
        }

        // Calculate accelerations
        const acceleration = this.forceAccumulator.multiply(1/this.mass);
        const angularAcceleration = this.torqueAccumulator / this.momentOfInertia;

        // Update linear motion
        this.velocity = this.velocity.add(acceleration.multiply(dt));
        this.position = this.position.add(this.velocity.multiply(dt));

        // Apply linear damping
        this.velocity = this.velocity.multiply(this.linearDamping);

        // Update angular motion
        this.angularVelocity += angularAcceleration * dt;
        this.rotation += this.angularVelocity * dt;

        // Apply angular damping
        this.angularVelocity *= this.angularDamping;

        // Clear accumulators for next frame
        this.clearAccumulators();
    }
}