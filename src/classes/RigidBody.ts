import { Vector } from "./Vector";

/**
 * Represents a rigid body in the physics simulation.
 * A rigid body is an object that maintains its shape and size during simulation.
 * 
 * The class implements basic physics properties and methods for:
 * - Linear motion (position, velocity, acceleration)
 * - Angular motion (rotation, angular velocity, angular acceleration)
 * - Force and torque accumulation
 * - Integration of motion using Euler's method
 * 
 * @category Core
 */
export class RigidBody {
    /** Mass of the body in kilograms */
    public mass: number;
    
    /** Current position vector of the body's center of mass */
    public position: Vector;
    
    /** Current velocity vector of the body */
    public velocity: Vector;
    
    /** Current acceleration vector of the body */
    public acceleration: Vector;
    
    /** Accumulated forces acting on the body */
    public forceAccumulator: Vector;
    
    /** Accumulated torque acting on the body */
    public torqueAccumulator: number;
    
    /** Current rotation angle in radians */
    public rotation: number;
    
    /** Current angular velocity in radians per second */
    public angularVelocity: number;
    
    /** Current angular acceleration in radians per second squared */
    public angularAcceleration: number;
    
    /** Moment of inertia of the body */
    public momentOfInertia: number;
    
    /** Linear damping coefficient (0-1) */
    public linearDamping: number;
    
    /** Angular damping coefficient (0-1) */
    public angularDamping: number;

    /**
     * Creates a new rigid body with the specified properties
     * @param mass - The mass of the body in kilograms
     * @param position - The initial position vector
     * @param momentOfInertia - The moment of inertia of the body
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
     * @param force - The force vector to add
     * @throws {Error} If force is null or undefined
     */
    addForce(force: Vector): void {
        if (!force) {
            throw new Error("Force cannot be null or undefined");
        }
        this.forceAccumulator = this.forceAccumulator.add(force);
    }

    /**
     * Adds a torque to the torque accumulator
     * @param torque - The torque value to add
     * @throws {Error} If torque is null or undefined
     */
    addTorque(torque: number): void {
        if (torque == null || torque == undefined) {
            throw new Error("Torque cannot be null or undefined");
        }
        this.torqueAccumulator += torque;
    }

    /**
     * Clears all accumulated forces and torques
     * Resets both force and torque accumulators to zero
     */
    clearAccumulators(): void {
        this.forceAccumulator = new Vector(0,0);
        this.torqueAccumulator = 0;
    }

    /**
     * Updates the body's state using Euler integration
     * @param dt - Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
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