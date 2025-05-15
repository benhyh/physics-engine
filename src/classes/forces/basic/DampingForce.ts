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
