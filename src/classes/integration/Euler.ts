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

export class Euler {
    /**
     * Basic Euler integration - explicit first order
     * x(t + dt) = x(t) + v(t) * dt
     * v(t + dt) = v(t) + a(t) * dt
     * 
     * @param body The rigid body to integrate
     * @param dt Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
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
     * Useful for predicting future states without modifying the actual body
     * 
     * @param state Current state
     * @param dt Time step
     * @returns New state after integration
     * @throws {Error} If dt is less than or equal to zero
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
     * Updates velocity first, then uses new velocity for position
     * v(t + dt) = v(t) + a(t) * dt
     * x(t + dt) = x(t) + v(t + dt) * dt
     * 
     * @param body The rigid body to integrate
     * @param dt Time step in seconds
     * @throws {Error} If dt is less than or equal to zero
     */
    semiImplicitIntegrate(body: RigidBody, dt: number): void {
        if (dt <= 0) throw new Error("Time stpe must be greater than zero.");

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