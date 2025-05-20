import { CollisionDectector, CollisionPair } from "@/sims/CollisionDectector";
import { ForceRegistry } from "./ForceRegistry";
import { RigidBody } from "./RigidBody"

export class PhysicsWorld {
    private bodies: RigidBody[] = [];
    private forceRegistry: ForceRegistry;
    private collisionDectector: CollisionDectector;

    constructor() {
        this.forceRegistry = new ForceRegistry();
        this.collisionDectector = new CollisionDectector();
    }

    addBody(body: RigidBody): void {}
    removeBody(body: RigidBody): void {}

    step(dt: number): void {
        this.forceRegistry.updateForces(dt);

        const collisionPairs = this.collisionDectector.detectCollision(this.bodies);

        this.resolveCollisions(collisionPairs, dt);

        for (const body of this.bodies) {
            body.integrate(dt);
        }
    }
    
    private resolveCollisions(collisionPairs: CollisionPair[], dt: number): void {}
}