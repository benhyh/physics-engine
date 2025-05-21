/**
 * Represents information about a collision between two rigid bodies.
 * Contains all necessary data for collision response and resolution.
 * 
 * The collision information includes:
 * - The colliding bodies
 * - Collision normal (direction)
 * - Penetration depth
 * - Contact point
 * 
 * @category Core
 */

import { RigidBody } from "../RigidBody";
import { Vector } from "../Vector";

export class CollisionInfo {
    /** The first body involved in the collision */
    public bodyA: RigidBody;
    
    /** The second body involved in the collision */
    public bodyB: RigidBody;
    
    /** Direction of collision (from A to B), normalized */
    public normal: Vector;
    
    /** Penetration depth of the collision */
    public depth: number;
    
    /** Point of contact between the bodies */
    public contactPoint: Vector;

    /**
     * Creates a new collision information instance
     * @param bodyA - First body in collision
     * @param bodyB - Second body in collision
     * @param normal - Collision normal vector
     * @param depth - Penetration depth
     * @param contactPoint - Point of contact
     * 
     * Pre-condition: All parameters must be valid
     * Post-condition: CollisionInfo instance is created with valid data
     */
    constructor(
        bodyA: RigidBody = new RigidBody(),
        bodyB: RigidBody = new RigidBody(),
        normal: Vector = new Vector(0, 0),
        depth: number = 1,
        contactPoint: Vector = new Vector(0, 0),
    ) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.normal = normal;
        this.depth = depth;
        this.contactPoint = contactPoint;
    }

    /**
     * Gets the first body involved in the collision
     * @returns The first rigid body
     */
    getBodyA(): RigidBody {
        return this.bodyA;
    }

    /**
     * Gets the second body involved in the collision
     * @returns The second rigid body
     */
    getBodyB(): RigidBody {
        return this.bodyB;
    }

    /**
     * Gets the collision normal vector
     * @returns The normalized collision direction vector
     */
    getNormal(): Vector {
        return this.normal;
    }

    /**
     * Gets the penetration depth of the collision
     * @returns The depth of penetration
     */
    getDepth(): number {
        return this.depth;
    }

    /**
     * Gets the point of contact between the bodies
     * @returns The contact point vector
     */
    getContactPoint(): Vector {
        return this.contactPoint;
    }
}