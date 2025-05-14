/**Z
 * Testing Requirements:
 * - Test cases should cover:
 *   1. Default gravity constant behavior
 *   2. Custom gravity constant
 *   3. Force calculation accuracy
 *   4. Error cases (invalid inputs)
 *   5. Direction and magnitude calculations
 *   6. Gravity constant updates
 */


import { Vector } from "../../Vector";
import { Force, ForceType } from "../base/Force";
import { RigidBody } from "../../RigidBody";

export class GravityForce extends Force {
    private mass: number;
    private gravityConstant: Vector;

    constructor(
        mass: number = 1,
        gravityConstant: Vector = new Vector(0, 9.81)
    ) {
        if (mass <= 0) {
            throw new Error('Mass must be positive');
        }
        if (!gravityConstant || (gravityConstant.x === 0 && gravityConstant.y === 0)) {
            throw new Error('Invalid gravity constant vector');
        }
        const force = gravityConstant.multiply(mass);
        super(ForceType.GRAVITY, force.magnitude(), force.normalize());
        this.mass = mass;
        this.gravityConstant = gravityConstant;
    }

    apply(body: RigidBody): void {
        const force = this.gravityConstant.multiply(this.mass);
        body.addForce(force);
    }

    getMagnitude(): number {
        const force = this.gravityConstant.multiply(this.mass);
        return force.magnitude();
    }

    getDirection(): Vector {
        const force = this.gravityConstant.multiply(this.mass);
        return force.normalize();
    }
    
    setGravityConstant(newGravityConstant: Vector): void {
        if (!newGravityConstant || (newGravityConstant.x === 0 && newGravityConstant.y === 0)) {
            throw new Error('Invalid gravity constant vector');
        }
        this.gravityConstant = newGravityConstant;
        const force = this.gravityConstant.multiply(this.mass);
        this.magnitude = force.magnitude();
        this.direction = force.normalize();
    }

    getGravityConstant(): Vector {
        return this.gravityConstant;
    }
}