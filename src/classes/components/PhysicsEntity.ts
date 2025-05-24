/**
 * PhysicsEntity - Composition of physics components.
 * 
 * Combines RigidBody (physics), Shape (geometry), Transform (spatial),
 * and Material (properties) into a single entity for physics simulation.
 * 
 * This approach uses composition instead of inheritance to achieve
 * better separation of concerns and flexibility.
 * 
 * @category Components
 */

import { RigidBody } from "../RigidBody";
import { Transform } from "./Transform";
import { Material } from "./Material";
import { Vector } from "../Vector";
import { AABB } from "../shapes/base/Shape";

/**
 * Pure geometry interface - no collision logic
 */
export interface IShape {
    readonly type: import("../shapes/base/Shape").ShapeType;
    getBounds(): AABB;
    getVertices(): Vector[];
    containsPoint(point: Vector): boolean;
    
    // Geometric operations only
    project(axis: Vector): { min: number, max: number };
    getArea(): number;
    getCentroid(): Vector;
}

export class PhysicsEntity {
    public body: RigidBody;
    public shape: IShape;
    public transform: Transform;
    public material: Material;
    public isActive: boolean;
    public id: string;

    constructor(
        body: RigidBody,
        shape: IShape,
        transform: Transform = new Transform(),
        material: Material = new Material(),
        id?: string
    ) {
        this.body = body;
        this.shape = shape;
        this.transform = transform;
        this.material = material;
        this.isActive = true;
        this.id = id || this.generateId();
        
        // Calculate mass from shape area and material density
        this.updateMassFromDensity();
    }

    /**
     * Updates the body's mass based on shape area and material density
     */
    updateMassFromDensity(): void {
        const area = this.shape.getArea();
        const calculatedMass = area * this.material.getDensity();
        this.body.mass = calculatedMass;
        this.body.inverseMass = calculatedMass > 0 ? 1 / calculatedMass : 0;
    }

    /**
     * Gets the world-space axis-aligned bounding box
     * @returns AABB in world coordinates
     */
    getWorldAABB(): AABB {
        const localBounds = this.shape.getBounds();
        const corners = [
            new Vector(localBounds.minX, localBounds.minY),
            new Vector(localBounds.maxX, localBounds.minY),
            new Vector(localBounds.maxX, localBounds.maxY),
            new Vector(localBounds.minX, localBounds.maxY)
        ];

        const worldCorners = corners.map(corner => this.transform.transformPoint(corner));
        
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        for (const corner of worldCorners) {
            minX = Math.min(minX, corner.x);
            minY = Math.min(minY, corner.y);
            maxX = Math.max(maxX, corner.x);
            maxY = Math.max(maxY, corner.y);
        }

        return { minX, minY, maxX, maxY };
    }

    /**
     * Gets the world-space vertices of the shape
     * @returns Array of world-space vertices
     */
    getWorldVertices(): Vector[] {
        const localVertices = this.shape.getVertices();
        return localVertices.map(vertex => this.transform.transformPoint(vertex));
    }

    /**
     * Checks if a world-space point is contained within this entity
     * @param worldPoint - Point in world coordinates
     * @returns True if point is contained
     */
    containsWorldPoint(worldPoint: Vector): boolean {
        const localPoint = this.transform.inverseTransformPoint(worldPoint);
        return this.shape.containsPoint(localPoint);
    }

    /**
     * Applies a force at the center of mass
     * @param force - Force vector to apply
     */
    applyForce(force: Vector): void {
        this.body.addForce(force);
    }

    /**
     * Applies a force at a specific world point, generating torque
     * @param force - Force vector to apply
     * @param worldPoint - World-space point where force is applied
     */
    applyForceAtPoint(force: Vector, worldPoint: Vector): void {
        this.body.addForce(force);
        
        // Calculate torque from offset
        const offset = worldPoint.subtract(this.transform.position);
        const torque = offset.cross(force);
        this.body.addTorque(torque);
    }

    /**
     * Applies an impulse at the center of mass
     * @param impulse - Impulse vector to apply
     */
    applyImpulse(impulse: Vector): void {
        this.body.velocity = this.body.velocity.add(impulse.multiply(this.body.inverseMass));
    }

    /**
     * Applies an impulse at a specific world point
     * @param impulse - Impulse vector to apply
     * @param worldPoint - World-space point where impulse is applied
     */
    applyImpulseAtPoint(impulse: Vector, worldPoint: Vector): void {
        this.body.velocity = this.body.velocity.add(impulse.multiply(this.body.inverseMass));
        
        const offset = worldPoint.subtract(this.transform.position);
        const angularImpulse = offset.cross(impulse);
        this.body.angularVelocity += angularImpulse * this.body.inverseInertia;
    }

    /**
     * Updates the entity's physics integration
     * @param dt - Time step
     */
    integrate(dt: number): void {
        if (!this.isActive) return;
        
        // Sync transform position with body position
        this.transform.position = this.body.position;
        this.transform.rotation = this.body.rotation;
        
        // Integrate physics
        this.body.integrate(dt);
        
        // Update transform from body
        this.transform.position = this.body.position;
        this.transform.rotation = this.body.rotation;
    }

    /**
     * Generates a unique ID for this entity
     * @returns Unique identifier string
     */
    private generateId(): string {
        return `entity_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Creates a deep copy of this entity
     * @returns Cloned physics entity
     */
    clone(): PhysicsEntity {
        // Note: Shape cloning would need to be implemented per shape type
        const clonedEntity = new PhysicsEntity(
            // Would need RigidBody.clone() method
            this.body, // Placeholder - implement body cloning
            this.shape, // Placeholder - implement shape cloning
            this.transform.clone(),
            this.material.clone()
        );
        
        clonedEntity.isActive = this.isActive;
        return clonedEntity;
    }
} 