import { PhysicsEntity } from "@/classes/components/PhysicsEntity";
import { CollisionAlgorithm } from "../CollisionSystem";
import { CollisionInfo } from "../CollisionInfo";

export class TrapezoidTrapezoidAlgorithm implements CollisionAlgorithm {
    detect(entityA: PhysicsEntity, entityB: PhysicsEntity): CollisionInfo | null {
        // TODO: Implement Trapezoid vs Trapezoid collision
        return null;
    }
} 