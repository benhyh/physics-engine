/**
 * Implement Hooke's Law F = -kx
 * Make it configurable with:
 * 1. Spring constant
 * 2. Rest length 
 * 3. Handle torque generation based on attachement point
 * 
 * TODO:
 * 1. Add attachment points
 * 2. Add a second body or anchor point
 * 3. Calculate the actual distance vector between attachment points
 * 4. Apply forces at the attachment points (which creates torque)
 */

import { Force, ForceType } from "../base/Force";
import { Vector } from "../../Vector";
import { RigidBody } from "../../RigidBody";

export class SpringForce extends Force {
    private springConstant: number;
    private restLength: number;

    constructor(
        restLength: number = 0,
        springConstant: number = 1,
        initialDisplacement: number = 0
    ) {
        const displacement = initialDisplacement - restLength;
        const forceMagnitude = Math.abs(springConstant * displacement);
        const forceDirection = displacement > 0 ? new Vector(-1, 0) : new Vector(1, 0);
        
        super(ForceType.SPRING, forceMagnitude, forceDirection);
        this.restLength = restLength;
        this.springConstant = springConstant;
    }

    apply(body: RigidBody): void {
        const currentLength = body.position.x; 
        const displacement = currentLength - this.restLength;
        
        const forceMagnitude = this.springConstant * displacement;
        
        const springForce = new Vector(-forceMagnitude, 0);
        
        body.addForce(springForce);
    }

    getMagnitude(): number {
        return this.magnitude;
    }

    getDirection(): Vector {
        return this.direction;
    }

    setSpringConstant(newSpringConstant: number): void {
        if (!newSpringConstant) {
            throw new Error('Invalid spring constant.')
        }
        this.springConstant = newSpringConstant;
        const force = -(this.springConstant) * this.restLength;
        const newSpringForce = new Vector(force, 0);
        this.magnitude = newSpringForce.magnitude()
        this.direction = newSpringForce.normalize();
    }

    getSpringConstant(): number {
        return this.springConstant;
    } 
}