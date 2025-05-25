import { PhysicsEntity } from "@/classes/components/PhysicsEntity";
import { CollisionAlgorithm } from "../CollisionSystem";
import { CollisionInfo } from "../CollisionInfo";

export class CircleCircleAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Circle vs Circle collision
        return null;
    }
}

export class CircleAABBAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Circle vs AABB collision (reverse of AABB vs Circle)
        return null;
    }
}

export class CirclePolygonAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Circle vs Polygon collision
        return null;
    }
}