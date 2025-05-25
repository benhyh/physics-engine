import { PhysicsEntity } from "@/classes/components/PhysicsEntity";
import { CollisionAlgorithm } from "../CollisionSystem";
import { CollisionInfo } from "../CollisionInfo";

export class RectangleRectangleAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Rectangle vs Rectangle collision
        return null;
    }
}

