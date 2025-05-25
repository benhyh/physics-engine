import { PhysicsEntity } from "@/classes/components/PhysicsEntity";
import { CollisionAlgorithm } from "../CollisionSystem";
import { CollisionInfo } from "../CollisionInfo";

export class PolygonPolygonAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Polygon vs Polygon collision using SAT
        return null;
    }
}

export class PolygonAABBAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Polygon vs AABB collision (reverse of AABB vs Polygon)
        return null;
    }
}

export class PolygonCircleAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Polygon vs Circle collision (reverse of Circle vs Polygon)
        return null;
    }
}
