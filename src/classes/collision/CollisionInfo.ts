import { RigidBody } from "../RigidBody";
import { Vector } from "../Vector";

export class CollisionInfo {
    public bodyA: RigidBody;
    public bodyB: RigidBody;
    public normal: Vector;         // Direction of collision (from A to B)
    public depth: number;          // Penetration depth
    public contactPoint: Vector;   // Point of contact


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

    getBodyA(): RigidBody {
        return this.bodyA;
    }

    getBodyB(): RigidBody {
        return this.bodyB;
    }

    getNormal(): Vector {
        return this.normal;
    }

    getDepth(): number {
        return this.depth;
    }

    getContactPoint(): Vector {
        return this.contactPoint;
    }
}