/**
 * Implement Hooke's Law F = -kx
 * Make it configurable with:
 * 1. Spring constant
 * 2. Rest length 
 * 3. Handle torque generation based on attachement point
 */

import { Force, ForceType } from "../base/Force";
import { Vector } from "../../Vector";
import { RigidBody } from "../../RigidBody";

interface Attachment {
    body: RigidBody;
    localPoint: Vector;  
}

export class SpringForce extends Force {
    private springConstant: number;
    private restLength: number;
    private firstAttachment: Attachment;
    private secondAttachment?: Attachment;
    
    constructor(
        restLength: number = 0,
        springConstant: number = 1,
        firstBody: RigidBody = new RigidBody(),
        firstLocalPoint: Vector = new Vector(0, 0),
        secondBody?: RigidBody,
        secondLocalPoint: Vector = new Vector(0, 0)
    ) {
        super(ForceType.SPRING, 0, new Vector(0, 0));
        
        this.restLength = restLength;
        this.springConstant = springConstant;
        this.firstAttachment = {
            body: firstBody,
            localPoint: firstLocalPoint
        };
        
        if (secondBody) {
            this.secondAttachment = {
                body: secondBody,
                localPoint: secondLocalPoint
            };
        }
    }

    /**
     * Gets the world position of an attachment point
     */
    private getWorldAttachmentPoint(attachment: Attachment): Vector {
        // Transform local point to world coordinates considering body rotation
        return attachment.localPoint.rotate(attachment.body.rotation).add(attachment.body.position);
    }

    apply(body: RigidBody): void {
        // Get world positions of attachment points
        const firstWorldPoint = this.getWorldAttachmentPoint(this.firstAttachment);
        let secondWorldPoint: Vector;
        
        if (this.secondAttachment) {
            secondWorldPoint = this.getWorldAttachmentPoint(this.secondAttachment);
        } else {
            secondWorldPoint = firstWorldPoint.add(new Vector(this.restLength, 0));
        }

        const displacement = secondWorldPoint.subtract(firstWorldPoint);
        const currentLength = displacement.magnitude();
        const stretch = currentLength - this.restLength;
        
        const forceMagnitude = this.springConstant * stretch;
        
        const forceDirection = displacement.normalize();
        
        const springForce = forceDirection.multiply(forceMagnitude);

        if (body === this.firstAttachment.body) {
            const r1 = firstWorldPoint.subtract(body.position);
            const torque1 = r1.cross(springForce);
            
            body.addForce(springForce);
            body.addTorque(torque1);
        }
        
        if (this.secondAttachment && body === this.secondAttachment.body) {
            const oppositeForce = springForce.multiply(-1);
            const r2 = secondWorldPoint.subtract(body.position);
            const torque2 = r2.cross(oppositeForce);
            
            body.addForce(oppositeForce);
            body.addTorque(torque2);
        }
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

    getFirstAttachment(): Attachment {
        return this.firstAttachment;
    }

    setFirstAttachment(body: RigidBody, localPoint: Vector): void {
        this.firstAttachment = {
            body,
            localPoint
        };
    }

    getSecondAttachment(): Attachment | undefined {
        return this.secondAttachment;
    }

    setSecondAttachment(body: RigidBody, localPoint: Vector): void {
        this.secondAttachment = {
            body,
            localPoint
        };
    }

    getRestLength(): number {
        return this.restLength;
    }
    
    getDistance(): Vector {
        const firstWorldPoint = this.getWorldAttachmentPoint(this.firstAttachment);
        
        if (this.secondAttachment) {
            const secondWorldPoint = this.getWorldAttachmentPoint(this.secondAttachment);
            return secondWorldPoint.subtract(firstWorldPoint);
        } else {
            const fixedPoint = firstWorldPoint.add(new Vector(this.restLength, 0));
            return fixedPoint.subtract(firstWorldPoint);
        }
    }
}