// Collision algorithm implementations (to be implemented)

import { PhysicsEntity } from "@/classes/components/PhysicsEntity";
import { AABB, CollisionAlgorithm } from "../CollisionSystem";
import { CollisionInfo } from "../CollisionInfo";
import { Vector } from "@/classes/Vector";
import { Shape, ShapeType } from "@/classes/shapes/base/Shape";

export class AABBAABBAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        try {
            const aabbA = entityA.getWorldAABB();
            const aabbB = entityB.getWorldAABB();
    
            if (!this.aabbOverlap(aabbA, aabbB)) {
                return null;
            } 

            const overlapX = Math.min(aabbA.maxX, aabbB.maxX) - Math.max(aabbA.minX, aabbB.minX);
            const overlapY = Math.min(aabbA.maxY, aabbB.maxY) - Math.max(aabbA.minY, aabbB.minY);

            let normal: Vector;
            let depth: number;

            // Collision occur along the axis with minimum penetration (SAT) principle
            if(overlapX  < overlapY) {
                // horizontal collision (collision normal is horizontal)
                depth = overlapX;

                const centerAX = (aabbA.minX + aabbA.maxX) / 2;
                const centerBX = (aabbB.minX + aabbB.maxX) / 2;

                normal = new Vector(centerAX < centerBX ? 1 : -1, 0);
            } else {
                // vertical collision (collision normal is vertical)
                depth = overlapY;

                const centerAY = (aabbA.minY + aabbA.maxY) / 2;
                const centerBY = (aabbB.minY + aabbB.maxY) / 2;
                
                normal = new Vector(0, centerAY < centerBY ? 1 : -1);
            }

            const overlapMinX = Math.max(aabbA.minX, aabbB.minX);
            const overlapMinY = Math.max(aabbA.minY, aabbB.minY);
            const overlapMaxX = Math.min(aabbA.maxX, aabbB.maxX);
            const overlapMaxY = Math.min(aabbA.maxY, aabbB.maxY);
            
            const contactPoint = new Vector(
                (overlapMinX + overlapMaxX) / 2,
                (overlapMinY + overlapMaxY) / 2
            );
            
            return new CollisionInfo(
                entityA.body,
                entityB.body,
                normal,
                depth,
                contactPoint
            );
                    
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Check if two AABBs are colliding
     * @param aabb1 
     * @param aabb2 
     * @returns True if overlapping, false other wise
     */
    aabbOverlap(aabb1: AABB, aabb2: AABB): boolean {        
        return aabb1.maxX >= aabb2.minX && aabb1.minX <= aabb2.maxX &&
               aabb1.maxY >= aabb2.minY && aabb1.minY <= aabb2.maxY;
    }
}

export class AABBCircleAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        let aabbEntity: PhysicsEntity;
        let circleEntity: PhysicsEntity;

        try {
            if (entityA.shape.type === ShapeType.AABB && entityB.shape.type === ShapeType.CIRCLE) {
                aabbEntity = entityA;
                circleEntity = entityB;
            } else if (entityA.shape.type === ShapeType.CIRCLE && entityB.shape.type === ShapeType.AABB) {
                aabbEntity = entityB;
                circleEntity = entityA;
            } else {
                return null;
            }

            const aabbBounds = aabbEntity.getWorldAABB();
            const circleCenter = circleEntity.shape.getCentroid();
            const circleBounds = circleEntity.shape.getBounds();
            const circleRadius = (circleBounds.maxX - circleBounds.minX) / 2;
            const worldCircleCenter = circleEntity.transform.transformPoint(circleCenter);

            const closestX = Math.max(aabbBounds.minX, Math.min(worldCircleCenter.x, aabbBounds.maxX));
            const closestY = Math.max(aabbBounds.minY, Math.min(worldCircleCenter.y, aabbBounds.maxY));
            const closestPoint = new Vector(closestX, closestY);

            const distance = worldCircleCenter.subtract(closestPoint);
            const distanceMagnitude = distance.magnitude();

            if (distanceMagnitude > circleRadius) {
                return null;
            }

            let normal: Vector;
            if (distanceMagnitude === 0) {
                const distToLeft = worldCircleCenter.x - aabbBounds.minX;
                const distToRight = aabbBounds.maxX - worldCircleCenter.x;
                const distToTop = worldCircleCenter.y - aabbBounds.minY;
                const distToBottom = aabbBounds.maxY - worldCircleCenter.y;
                
                const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

                if (minDist === distToLeft) {
                    normal = new Vector(-1, 0);
                } else if (minDist === distToRight) {
                    normal = new Vector(1, 0);
                } else if (minDist === distToTop) {
                    normal = new Vector(0, -1);
                } else {
                    normal = new Vector(0, 1);
                }
            } else {
                normal = distance.normalize();
            }

            if (aabbEntity === entityB) {
                normal = normal.multiply(-1);
            }

            const depth = circleRadius - distanceMagnitude;

            return new CollisionInfo(
                entityA.body,
                entityB.body,
                normal,
                depth,
                closestPoint
            );
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

export class AABBPolygonAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement AABB vs Polygon collision using SAT
        // Test all edge normals of both shapes as potential seperating axes
        // If any axis seperates the shapes, they don't interesect


        return null;
    }
}