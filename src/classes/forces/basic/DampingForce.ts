/**
 * F = -cv where c is the damping coefficeint (in kg/s), v is the velocity vector
 */

import { RigidBody } from "../../RigidBody";
import { Force, ForceType } from "../base/Force";

export class DampingForce extends Force {
    private dampingCoefficient: number;
    
    constructor(dampingCoefficient: number = 1){
        super(ForceType.DAMPING);
        this.dampingCoefficient = dampingCoefficient;
    }

    apply(body: RigidBody): void {
        // TODO:
        // 1. get the current velocity of the body
        // 2. calculates damping force using F = -cv
        // 3. applies this force to the body
        const velocity = body.velocity;
        const force = velocity.multiply(this.dampingCoefficient * -1);
        body.addForce(force);
    }

    
    setDampingCoefficient(dampingCoefficient: number): void {
        this.dampingCoefficient = dampingCoefficient;
    }

    getDampingCoefficient(): number {
        return this.dampingCoefficient;
    }
}
