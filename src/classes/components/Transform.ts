/**
 * Transform component for spatial properties.
 * 
 * Handles position, rotation, and scale independently from
 * physics calculations and geometric definitions.
 * 
 * @category Components
 */

import { Vector } from "../Vector";

export class Transform {
    public position: Vector;
    public rotation: number;
    public scale: Vector;

    constructor(
        position: Vector = new Vector(0, 0),
        rotation: number = 0,
        scale: Vector = new Vector(1, 1)
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    /**
     * Gets the transformation matrix for this transform
     * @returns 2D transformation matrix
     */
    getMatrix(): number[] {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        
        return [
            this.scale.x * cos, -this.scale.y * sin, this.position.x,
            this.scale.x * sin,  this.scale.y * cos, this.position.y,
            0,                   0,                   1
        ];
    }

    /**
     * Transforms a local point to world space
     * @param localPoint - Point in local coordinates
     * @returns Point in world coordinates
     */
    transformPoint(localPoint: Vector): Vector {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        
        const scaledX = localPoint.x * this.scale.x;
        const scaledY = localPoint.y * this.scale.y;
        
        const worldX = scaledX * cos - scaledY * sin + this.position.x;
        const worldY = scaledX * sin + scaledY * cos + this.position.y;
        
        return new Vector(worldX, worldY);
    }

    /**
     * Transforms a world point to local space
     * @param worldPoint - Point in world coordinates
     * @returns Point in local coordinates
     */
    inverseTransformPoint(worldPoint: Vector): Vector {
        const relativeX = worldPoint.x - this.position.x;
        const relativeY = worldPoint.y - this.position.y;
        
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        
        const rotatedX = relativeX * cos - relativeY * sin;
        const rotatedY = relativeX * sin + relativeY * cos;
        
        return new Vector(rotatedX / this.scale.x, rotatedY / this.scale.y);
    }

    /**
     * Creates a copy of this transform
     * @returns Cloned transform
     */
    clone(): Transform {
        return new Transform(
            new Vector(this.position.x, this.position.y),
            this.rotation,
            new Vector(this.scale.x, this.scale.y)
        );
    }
} 