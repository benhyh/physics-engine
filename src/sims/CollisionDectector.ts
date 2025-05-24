/**
 * Handles collision detection in two phases:
 * 1. Broad Phase: Quick AABB overlap test to filter potential collisions
 * 2. Narrow Phase: Detailed SAT collision detection for actual collisions
 * 
 * The collision detection process:
 * 1. Broad phase uses AABB testing to quickly filter out non-colliding objects
 * 2. Narrow phase uses SAT for precise collision detection
 * 3. Collision information is generated for resolution
 * 
 * @category Core
 */

import { CollisionInfo } from "@/classes/collision/CollisionInfo";
import { SATCollisionDetector } from "@/classes/collision/SATCollisionDetector";
import { RigidBody } from "@/classes/RigidBody";
import { AABB } from "@/classes/shapes/base/Shape";
import { isFinite } from "lodash";

/**
 * Represents a pair of potentially colliding rigid bodies
 */
export interface CollisionPair {
    bodyA: RigidBody;
    bodyB: RigidBody;
    info: CollisionInfo;
}

export class CollisionDectector {
    private satDetector: SATCollisionDetector;
    
    constructor() {
        this.satDetector = new SATCollisionDetector();
    }

    /**
     * Detects all collisions between bodies in the simulation
     * @param bodies - Array of rigid bodies to check for collisions
     * @returns Array of collision information for all detected collisions
     * 
     * Pre-condition: bodies array must not be null/undefined
     * Post-condition: Returns array of valid collision pairs
     * 
     * @throws {Error} If bodies array is null/undefined
     */
    detectCollisions(bodies: RigidBody[]): CollisionInfo[] {
        const potentialCollisions = this.broadPhase(bodies);
        return this.narrowPhase(potentialCollisions);
    }

    /**
     * Performs broad phase collision detection using AABB testing
     * Filters out objects that cannot possibly collide
     * 
     * @param bodies - Array of rigid bodies to check
     * @returns Array of potential collision pairs
     * 
     * Pre-condition: bodies array must not be null/undefined
     * Post-condition: Returns array of bodies that might be colliding
     * 
     * @throws {Error} If bodies array is null/undefined
     */
    private broadPhase(bodies: RigidBody[]): [RigidBody, RigidBody][] {
        const potentialCollisions: [RigidBody, RigidBody][] = [];

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const bodyA = bodies[i];
                const bodyB = bodies[j];

                if (!bodyA.shape || !bodyB.shape) continue;

                try {
                    const aabbA = bodyA.shape.getAABB();
                    const aabbB = bodyB.shape.getAABB();

                    if (!this.isValidAABB(aabbA) || !this.isValidAABB(aabbB)) {
                        console.warn(`Invalid AABB detected for shapes: ${bodyA.shape.getType()}, ${bodyB.shape.getType()}`);
                        continue;
                    }

                    const xOverlap = aabbA.maxX >= aabbB.minX && aabbB.maxX >= aabbA.minX;
                    const yOverlap = aabbA.maxY >= aabbB.minY && aabbB.maxY >= aabbA.minY;

                    if (xOverlap && yOverlap) {
                        potentialCollisions.push([bodyA, bodyB]);
                    }
                } catch (error) {
                    console.error(`Error in broad phase collision detection: ${error}`);
                    continue;
                }
            }
        }

        return potentialCollisions;
    }
    
    /**
     * Performs narrow phase collision detection using SAT
     * Determines exact collision information for potentially colliding objects
     * 
     * @param pairs - Array of potential collision pairs from broad phase
     * @returns Array of detailed collision information
     * 
     * Pre-condition: pairs array must not be null/undefined
     * Post-condition: Returns array of valid collision information
     */
    private narrowPhase(pairs: [RigidBody, RigidBody][]): CollisionInfo[] {
        const collisions : CollisionInfo[] = [];

        for (const [bodyA, bodyB] of pairs) {
            if (!bodyA.shape || !bodyB.shape) continue;
            
            const collision = this.satDetector.detectCollision(bodyA.shape, bodyB.shape);
            if (collision) {
                collision.bodyA = bodyA;
                collision.bodyB = bodyB;
                collisions.push(collision);
            }
        }
        
        return collisions;
    }

    /**
     * Validates that an AABB has valid min/max values
     * @param aabb - The AABB to validate
     * @returns true if the AABB is valid, false otherwise
     * 
     * Pre-condition: aabb must not be null/undefined
     * Post-condition: Returns boolean indicating AABB validity
     */
    private isValidAABB(aabb: AABB): boolean {
        return (
            aabb.minX <= aabb.maxX &&
            aabb.minY <= aabb.maxY &&
            isFinite(aabb.minX) &&
            isFinite(aabb.minY) &&
            isFinite(aabb.maxX) &&
            isFinite(aabb.maxY)
        );
    }

    /**
     * Legacy method - use detectCollisions instead
     * @deprecated Use detectCollisions() instead
     */
    detectCollision(bodies: RigidBody[]): CollisionPair[]  { return []; }
} 
