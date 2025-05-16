/**
 * Implementation of Hooke's Law F = -kx which models a spring force
 * 
 * This class simulates spring behavior between rigid bodies or between a rigid body 
 * and a fixed point. It handles:
 * 1. Spring constant (k) - stiffness of the spring
 * 2. Rest length - natural length of the spring when no forces are applied 
 * 3. Torque generation based on attachment points
 * 
 * @category Forces
 */

import { Force, ForceType } from "../base/Force";
import { Vector } from "../../Vector";
import { RigidBody } from "../../RigidBody";

/**
 * Represents an attachment point for a spring
 * @interface Attachment
 */
interface Attachment {
    /** The rigid body the spring is attached to */
    body: RigidBody;
    /** The local point of attachment relative to the body's center */
    localPoint: Vector;  
}

export class SpringForce extends Force {
    private springConstant: number;
    private restLength: number;
    private firstAttachment: Attachment;
    private secondAttachment?: Attachment;
    
    /**
     * Creates a new spring force
     * @param restLength - Natural length of the spring when no forces are applied
     * @param springConstant - Stiffness of the spring (k in Hooke's Law)
     * @param firstBody - First rigid body to attach the spring to
     * @param firstLocalPoint - Attachment point on the first body (in local coordinates)
     * @param secondBody - Optional second rigid body to attach the spring to
     * @param secondLocalPoint - Attachment point on the second body (in local coordinates)
     */
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
     * @param attachment - The attachment to transform to world coordinates
     * @returns The attachment point in world coordinates
     * @private
     */
    private getWorldAttachmentPoint(attachment: Attachment): Vector {
        // Transform local point to world coordinates considering body rotation
        return attachment.localPoint.rotate(attachment.body.rotation).add(attachment.body.position);
    }

    /**
     * Applies the spring force to a rigid body
     * @param body - The rigid body to apply the force to
     * 
     * Pre-condition: body is a valid RigidBody and matches one of the attachments
     * Post-condition: Force and torque are added to the body's accumulators
     */
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

    /**
     * Gets the current magnitude of the spring force
     * @returns The magnitude of the spring force
     */
    getMagnitude(): number {
        return this.magnitude;
    }

    /**
     * Gets the current direction of the spring force
     * @returns The direction of the spring force as a unit vector
     */
    getDirection(): Vector {
        return this.direction;
    }

    /**
     * Sets the spring constant (stiffness)
     * @param newSpringConstant - The new spring constant value
     * @throws {Error} If spring constant is invalid
     */
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

    /**
     * Gets the current spring constant
     * @returns The spring constant (k)
     */
    getSpringConstant(): number {
        return this.springConstant;
    }

    /**
     * Gets the first attachment of the spring
     * @returns The first attachment information
     */
    getFirstAttachment(): Attachment {
        return this.firstAttachment;
    }

    /**
     * Sets the first attachment point
     * @param body - The rigid body to attach to
     * @param localPoint - The attachment point in body-local coordinates
     */
    setFirstAttachment(body: RigidBody, localPoint: Vector): void {
        this.firstAttachment = {
            body,
            localPoint
        };
    }

    /**
     * Gets the second attachment of the spring if it exists
     * @returns The second attachment information or undefined if connected to a fixed point
     */
    getSecondAttachment(): Attachment | undefined {
        return this.secondAttachment;
    }

    /**
     * Sets the second attachment point
     * @param body - The rigid body to attach to
     * @param localPoint - The attachment point in body-local coordinates
     */
    setSecondAttachment(body: RigidBody, localPoint: Vector): void {
        this.secondAttachment = {
            body,
            localPoint
        };
    }

    /**
     * Gets the rest length of the spring
     * @returns The natural length of the spring when no forces are applied
     */
    getRestLength(): number {
        return this.restLength;
    }
    
    /**
     * Gets the current vector distance between the spring's attachment points
     * @returns A vector from the first attachment to the second attachment
     */
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