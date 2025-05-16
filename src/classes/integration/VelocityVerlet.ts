import { Vector } from "../Vector";
import { RigidBody } from "../RigidBody";

interface State {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    rotation: number;
    angularVelocity: number;
    angularAcceleration: number;
}

export class VelocityVerlet {
    /**
     * Verlet Integration
     * x(t + ∆t) = 2x(t) - x(t - ∆t) + a(t)∆t^2
     * 
     * (t + ∆t) represents the next position
     * x(t) represents current position
     * (t - ∆t) represents previous position
     * a(t) represents current acceleration
     * ∆t = time between updates i.e ∆t
     * 
     * @param body
     * @param dt Time step in seconds
     * @throws {Error} if dt is less than or equal to zero
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
     * Useful for predicting future states without modifying the actual body
     * 
     * @param state Current state
     * @param dt Time step
     * @returns New state after integration
     * @throws {Error} If dt is less than or equal to zero
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