/**
 * Implements Euler integration methods for rigid body physics
 * 
 * Euler integration is a simple first-order numerical method for solving ordinary
 * differential equations with a given initial value. This class provides both:
 * - Basic explicit Euler integration
 * - Semi-implicit Euler integration (more stable)
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

export class Euler {
    /**
     * Basic Euler integration - explicit first order
     * 
     * Implements the equations:
     * x(t + dt) = x(t) + v(t) * dt
     * v(t + dt) = v(t) + a(t) * dt
     * 
     * This method is simple but can be unstable for large time steps.
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

        // F = ma
        // F / m = a
        // F * (1/m) = a
        const acceleration = body.forceAccumulator.multiply(1 / body.mass);

        const angularAcceleration = body.torqueAccumulator / body.momentOfInertia;

        body.velocity = body.velocity.add(acceleration.multiply(dt));
        body.position = body.position.add(body.velocity.multiply(dt));

        body.velocity = body.velocity.multiply(body.linearDamping);
        
        body.angularVelocity += angularAcceleration * dt;
        body.rotation += body.angularVelocity * dt;

        body.angularVelocity += body.angularVelocity;
        
        body.clearAccumulators();
    }

    /**
     * Integrates a state forward in time using basic Euler integration
     * 
     * Useful for predicting future states without modifying an actual body.
     * This is often used in collision prediction systems.
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
        if (dt <= 0) {
            throw new Error("Time step must be greater than zero");
        }

        return {
            position: state.position.add(state.velocity.multiply(dt)),
            velocity: state.velocity.add(state.acceleration.multiply(dt)),
            acceleration: state.acceleration,
            rotation: state.rotation + state.angularVelocity * dt,
            angularVelocity: state.angularVelocity + state.angularAcceleration * dt,
            angularAcceleration: state.angularAcceleration
        };
    }

    /**
     * Semi-implicit Euler integration - more stable than basic Euler
     * 
     * Updates velocity first, then uses the new velocity for position update:
     * v(t + dt) = v(t) + a(t) * dt
     * x(t + dt) = x(t) + v(t + dt) * dt
     * 
     * This method offers better numerical stability than basic Euler integration.
     * 
     * @param body - The rigid body to integrate
     * @param dt - Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
     * 
     * Pre-condition: body is a valid RigidBody and dt > 0
     * Post-condition: body's position and velocity are updated and accumulators are cleared
     */
    semiImplicitIntegrate(body: RigidBody, dt: number): void {
        if (dt <= 0) throw new Error("Time step must be greater than zero.");

        const acceleration = body.forceAccumulator.multiply(1 / body.mass);
        const angularAcceleration = body.torqueAccumulator / body.momentOfInertia;
        
        body.velocity = body.velocity.add(acceleration.multiply(dt));
        body.angularVelocity += angularAcceleration * dt;

        body.velocity = body.velocity.multiply(body.linearDamping);
        body.angularVelocity *= body.angularDamping;

        body.position = body.position.add(body.velocity.multiply(dt));
        body.rotation += body.angularVelocity * dt;

        body.clearAccumulators();
    }
}