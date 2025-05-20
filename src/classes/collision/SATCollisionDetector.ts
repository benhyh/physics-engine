import { Shape, ShapeType } from "../shapes/base/Shape";
import { CollisionInfo } from "./CollisionInfo";
import { Vector } from "../Vector";
import { CircleShape } from "../shapes/CircleShape";
import { PolygonShape } from "../shapes/PolygonShape";
import { RectangleShape } from "../shapes/RectangleShape";
import { TrapezoidShape } from "../shapes/TrapezoidShape";

export class SATCollisionDetector {
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
  
    // Helper methods
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
    
    private projectShapes(axis: Vector, shapeA: Shape, shapeB: Shape): { 
        a: {min: number, max: number}, 
        b: {min: number, max: number} 
    } {
        return {
            a: shapeA.project(axis),
            b: shapeB.project(axis)
        };
    }

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
    
    private findContactPoint(shapeA: Shape, shapeB: Shape, axis: Vector): Vector {
        return new Vector(0, 0);
    }
}