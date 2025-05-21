/**
 * Implements the Separating Axis Theorem (SAT) for collision detection.
 * 
 * SAT is a method to determine if two convex shapes are intersecting.
 * The theorem states that if you can find a line (axis) where the projections
 * of two shapes don't overlap, then the shapes are not colliding.
 * 
 * The detection process:
 * 1. Get all potential separating axes from both shapes
 * 2. Project both shapes onto each axis
 * 3. Check for overlap in the projections
 * 4. If any axis shows no overlap, shapes are not colliding
 * 5. If all axes show overlap, shapes are colliding
 * 
 * @category Core
 */

import { Shape, ShapeType } from "../shapes/base/Shape";
import { CollisionInfo } from "./CollisionInfo";
import { Vector } from "../Vector";
import { CircleShape } from "../shapes/CircleShape";
import { PolygonShape } from "../shapes/PolygonShape";
import { RectangleShape } from "../shapes/RectangleShape";
import { TrapezoidShape } from "../shapes/TrapezoidShape";

export class SATCollisionDetector {
    /**
     * Detects collision between two shapes using SAT
     * @param shapeA - First shape to check
     * @param shapeB - Second shape to check
     * @returns CollisionInfo if shapes are colliding, null otherwise
     * 
     * Pre-condition: Both shapes must be valid
     * Post-condition: Returns valid collision info or null
     */
    detectCollision(shapeA: Shape, shapeB: Shape): CollisionInfo | null {
        const axes = this.getShapesAxes(shapeA, shapeB);

        let minOverlap = Infinity;
        let minOverlapAxis: Vector | null = null;

        for (const axis of axes) {
            const projections = this.projectShapes(axis, shapeA, shapeB);
            const overlap = this.checkOverlap(projections.a, projections.b);

            if (overlap === null) return null;

            if (overlap < minOverlap) {
                minOverlap = overlap;
                minOverlapAxis = axis;
            }
        }

        const contactPoint = this.findContactPoint(shapeA, shapeB, minOverlapAxis!);

        const bodyA = shapeA.getParent();
        const bodyB = shapeB.getParent();
        
        if (!bodyA || !bodyB) {
            return null;
        }
        
        return new CollisionInfo(
            bodyA,
            bodyB,
            minOverlapAxis!,
            minOverlap,
            contactPoint
        );
    }
  
    /**
     * Gets all potential separating axes from both shapes
     * @param shapeA - First shape
     * @param shapeB - Second shape
     * @returns Array of potential separating axes
     * 
     * Pre-condition: Both shapes must be valid
     * Post-condition: Returns array of normalized axis vectors
     */
    private getShapesAxes(shapeA: Shape, shapeB: Shape): Vector[] {
        const axes: Vector[] = [];
      
        // Get axes from both shapes
        switch(shapeA.getType()) {
            case ShapeType.CIRCLE:
                axes.push(...(shapeA as CircleShape).getCollisionAxes(shapeB));
                break;
            case ShapeType.POLYGON:
                axes.push(...(shapeA as PolygonShape).getCollisionAxes());
                break;
            case ShapeType.RECTANGLE:
                axes.push(...(shapeA as RectangleShape).getCollisionAxes());
                break;
            case ShapeType.TRAPEZOID:
                axes.push(...(shapeA as TrapezoidShape).getCollisionAxes());
                break;
        }
      
        switch(shapeB.getType()) {
            case ShapeType.CIRCLE:
                axes.push(...(shapeB as CircleShape).getCollisionAxes(shapeA));
                break;
            case ShapeType.POLYGON:
                axes.push(...(shapeB as PolygonShape).getCollisionAxes());
                break;
            case ShapeType.RECTANGLE:
                axes.push(...(shapeB as RectangleShape).getCollisionAxes());
                break;
            case ShapeType.TRAPEZOID:
                axes.push(...(shapeB as TrapezoidShape).getCollisionAxes());
                break;
        }
      
        return axes;
    }
    
    /**
     * Projects both shapes onto a given axis
     * @param axis - The axis to project onto
     * @param shapeA - First shape
     * @param shapeB - Second shape
     * @returns Projection ranges for both shapes
     * 
     * Pre-condition: Axis must be normalized
     * Post-condition: Returns valid projection ranges
     */
    private projectShapes(axis: Vector, shapeA: Shape, shapeB: Shape): { 
        a: {min: number, max: number}, 
        b: {min: number, max: number} 
    } {
        return {
            a: shapeA.project(axis),
            b: shapeB.project(axis)
        };
    }

    /**
     * Checks for overlap between two projection ranges
     * @param projectionA - First shape's projection range
     * @param projectionB - Second shape's projection range
     * @returns Overlap amount if projections overlap, null otherwise
     * 
     * Pre-condition: Projection ranges must be valid
     * Post-condition: Returns positive number or null
     */
    private checkOverlap(
        projectionA: {min: number, max: number}, 
        projectionB: {min: number, max: number}
    ): number | null {
        if (projectionA.max < projectionB.min || projectionB.max < projectionA.min) {
            return null;
        }

        return Math.min(
            projectionA.max - projectionB.min,
            projectionB.max - projectionA.min
        );
    }
    
    /**
     * Finds the contact point between two colliding shapes
     * @param shapeA - First shape
     * @param shapeB - Second shape
     * @param axis - The axis of minimum penetration
     * @returns The contact point vector
     * 
     * Pre-condition: Shapes must be colliding
     * Post-condition: Returns valid contact point
     * 
     * TODO: Implement proper contact point calculation
     */
    private findContactPoint(shapeA: Shape, shapeB: Shape, axis: Vector): Vector {
        return new Vector(0, 0);
    }
}