import { Shape } from "../shapes/base/Shape";
import { CollisionInfo } from "./CollisionInfo";

export class SATCollisionDetector {
    // Main method
    detectCollision(shapeA: Shape, shapeB: Shape): CollisionInfo | null {
      // Get axes to test
      // Project shapes onto each axis
      // Check for overlap on all axes
      // If no overlap on any axis, no collision
      // Find minimum penetration axis
      // Return collision information
    }
  
    // Helper methods
    private getShapesAxes(shapeA: Shape, shapeB: Shape): Vector[]
    private projectShapes(axis: Vector, shapeA: Shape, shapeB: Shape): { a: {min: number, max: number}, b: {min: number, max: number} }
    private checkOverlap(projectionA: {min: number, max: number}, projectionB: {min: number, max: number}): number | null
    private findContactPoint(shapeA: Shape, shapeB: Shape, axis: Vector): Vector
}