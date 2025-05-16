/**
 * Implements Velocity Verlet integration for physics simulation
 * 
 * Velocity Verlet is a second-order method that provides better accuracy and stability
 * than basic Euler integration. It handles position and velocity updates with improved
 * energy conservation for physical simulations.
 * 
 * The method calculates new positions using current velocity and acceleration,
 * then updates velocity using the average of current and new acceleration.
 * 
 * @category Integration
 */

import { Vector } from "../Vector";
import { RigidBody } from "../RigidBody";

/**
 * Represents the complete state of a rigid body at a point in time
 * @interface State
 */
interface State {
    /** Position vector */
    position: Vector;
    /** Velocity vector */
    velocity: Vector;
    /** Acceleration vector */
    acceleration: Vector;
    /** Rotation angle in radians */
    rotation: number;
    /** Angular velocity in radians per second */
    angularVelocity: number;
    /** Angular acceleration in radians per second squared */
    angularAcceleration: number;
}

export class VelocityVerlet {
    /**
     * Integrates a rigid body's motion using Velocity Verlet method
     * 
     * The algorithm follows these steps:
     * 1. x(t + ∆t) = x(t) + v(t)∆t + (1/2)a(t)∆t²
     * 2. Calculate new forces/accelerations at the new position
     * 3. v(t + ∆t) = v(t) + (1/2)(a(t) + a(t + ∆t))∆t
     * 
     * This provides more accurate results than Euler integration, especially
     * for systems with conservative forces.
     * 
     * @param body - The rigid body to integrate
     * @param dt - Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
     * 
     * Pre-condition: body is a valid RigidBody and dt > 0
     * Post-condition: body's position and velocity are updated and accumulators are cleared
     */
    integrate(body: RigidBody, dt: number): void {
        if (dt <= 0) throw new Error("Time step must be greater than zero.");

        const currentAcceleration = body.forceAccumulator.multiply(1 / body.mass);
        const currentAngularAcceleration = body.torqueAccumulator / body.momentOfInertia;

        // x(t + ∆t) = x(t) + v(t)∆t + 1/2a(t)∆t²
        const velocityTerm = body.velocity.multiply(dt);
        const accelerationTerm = currentAcceleration.multiply(0.5 * dt * dt);
        body.position = body.position.add(velocityTerm).add(accelerationTerm);

        body.rotation += body.angularVelocity * dt + 0.5 * currentAngularAcceleration * dt * dt;

        const newAcceleration = body.forceAccumulator.multiply(1 / body.mass);
        const newAngularAcceleration = body.torqueAccumulator / body.momentOfInertia;

        // v(t + ∆t) = v(t) + 1/2(a(t) + a(t + ∆t))∆t
        const avgAcceleration = currentAcceleration.add(newAcceleration).multiply(0.5);
        body.velocity = body.velocity.add(avgAcceleration.multiply(dt));

        const avgAngularAcceleration = (currentAngularAcceleration + newAngularAcceleration) * 0.5;
        body.angularVelocity += avgAngularAcceleration * dt;

        body.velocity = body.velocity.multiply(body.linearDamping);
        body.angularVelocity *= body.angularDamping;
        
        body.clearAccumulators();
    }

    
    /**
     * Integrates a state forward in time using Velocity Verlet
     * 
     * Useful for predicting future states without modifying an actual body.
     * Particularly valuable for collision prediction and detection systems.
     * 
     * @param state - Current state
     * @param dt - Time step in seconds
     * @returns New state after integration
     * @throws {Error} If dt is less than or equal to zero
     * 
     * Pre-condition: state contains valid values and dt > 0
     * Post-condition: returns a new state object with updated values
     */
    integrateState(state: State, dt: number): State {
        if (dt <= 0) throw new Error("Time step must be greater than zero");

        const velocityTerm = state.velocity.multiply(dt);
        const accelerationTerm = state.acceleration.multiply(0.5 * dt * dt);
        const newPosition = state.position.add(velocityTerm).add(accelerationTerm);

        const newRotation = state.rotation *
            state.angularVelocity * dt +
            0.5 * state.angularAcceleration * dt * dt;

        const newVelocity = state.velocity.add(state.acceleration.multiply(dt));

        const newAngularVelocity = state.angularVelocity + state.angularAcceleration * dt;

        return {
            position: newPosition,
            velocity: newVelocity,
            acceleration: state.acceleration,
            rotation: newRotation,
            angularVelocity: newAngularVelocity,
            angularAcceleration: state.angularAcceleration
        };
    } 
}