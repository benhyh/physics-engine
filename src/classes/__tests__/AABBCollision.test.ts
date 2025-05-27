import { Vector } from "../Vector";
import { RigidBody } from "../RigidBody";
import { Transform } from "../components/Transform";
import { Material } from "../components/Material";
import { CircleShape } from "../shapes/convex/CircleShape";
import { AABBShape } from "../shapes/convex/AABBShape";
import { PolygonShape } from "../shapes/convex/PolygonShape";
import { PhysicsEntity } from "../components/PhysicsEntity";
import { AABBAABBAlgorithm, AABBCircleAlgorithm, AABBPolygonAlgorithm } from "../collisions/AABB/AABBCollisions";

// Test utilities
function createAABBEntity(minX: number, minY: number, maxX: number, maxY: number, position: Vector = new Vector(0, 0)): PhysicsEntity {
    const body = new RigidBody(1, position);
    const shape = new AABBShape(minX, minY, maxX, maxY);
    const transform = new Transform();
    transform.position = position;
    const material = new Material();
    return new PhysicsEntity(body, shape, transform, material);
}

function createCircleEntity(radius: number, center: Vector = new Vector(0, 0), position: Vector = new Vector(0, 0)): PhysicsEntity {
    const body = new RigidBody(1, position);
    const shape = new CircleShape(radius, center);
    const transform = new Transform();
    transform.position = position;
    const material = new Material();
    return new PhysicsEntity(body, shape, transform, material);
}

function createPolygonEntity(sides: number, radius: number, position: Vector = new Vector(0, 0)): PhysicsEntity {
    const body = new RigidBody(1, position);
    const shape = new PolygonShape(sides, radius, position);
    const transform = new Transform();
    transform.position = position;
    const material = new Material();
    return new PhysicsEntity(body, shape as any, transform, material); // Type cast for now
}

describe('AABB-AABB Collision Algorithm', () => {
    let algorithm: AABBAABBAlgorithm;
    
    beforeEach(() => {
        algorithm = new AABBAABBAlgorithm();
    });

    test('should detect no collision when AABBs are separated', () => {
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(3, 3));
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).toBeNull();
    });

    test('should detect collision when AABBs overlap', () => {
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(1, 0)); // Overlapping by 1 unit
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
        expect(collision!.normal).toBeInstanceOf(Vector);
        expect(collision!.contactPoint).toBeInstanceOf(Vector);
    });

    test('should detect collision when AABBs touch at edge', () => {
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(2, 0)); // Touching at edge
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
    });

    test('should detect collision when one AABB is inside another', () => {
        const aabb1 = createAABBEntity(-2, -2, 2, 2, new Vector(0, 0)); // Large AABB
        const aabb2 = createAABBEntity(-0.5, -0.5, 0.5, 0.5, new Vector(0, 0)); // Small AABB inside
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should return correct collision normal direction', () => {
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(1.5, 0)); // Horizontal overlap
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
        expect(collision!.normal.x).not.toBe(0); // Should be horizontal collision
        expect(collision!.normal.y).toBe(0);
    });

    test('should handle zero-size AABB', () => {
        const aabb1 = createAABBEntity(0, 0, 0, 0, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
    });
});

describe('AABB-Circle Collision Algorithm', () => {
    let algorithm: AABBCircleAlgorithm;
    
    beforeEach(() => {
        algorithm = new AABBCircleAlgorithm();
    });

    test('should detect no collision when shapes are separated', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.5, new Vector(0, 0), new Vector(3, 0));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).toBeNull();
    });

    test('should detect collision when circle overlaps AABB edge', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.8, new Vector(0, 0), new Vector(1.5, 0));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
        expect(collision!.normal).toBeInstanceOf(Vector);
    });

    test('should detect collision when circle overlaps AABB corner', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.8, new Vector(0, 0), new Vector(1.2, 1.2));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should detect collision when circle is inside AABB', () => {
        const aabb = createAABBEntity(-2, -2, 2, 2, new Vector(0, 0));
        const circle = createCircleEntity(0.5, new Vector(0, 0), new Vector(0, 0));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should work with reversed entity order (Circle-AABB)', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.8, new Vector(0, 0), new Vector(1.5, 0));
        
        const collision = algorithm.detect(circle, aabb);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should return null for invalid shape combinations', () => {
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(0, 0, 2, 2, new Vector(1, 1));
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).toBeNull();
    });

    test('should handle very small circles', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.01, new Vector(0, 0), new Vector(0.5, 0));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).not.toBeNull();
    });
});

describe('AABB-Polygon Collision Algorithm', () => {
    let algorithm: AABBPolygonAlgorithm;
    
    beforeEach(() => {
        algorithm = new AABBPolygonAlgorithm();
    });

    test('should detect no collision when shapes are separated', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const triangle = createPolygonEntity(3, 1, new Vector(4, 0));
        
        const collision = algorithm.detect(aabb, triangle);
        
        expect(collision).toBeNull();
    });

    test('should detect collision when AABB overlaps triangle', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const triangle = createPolygonEntity(3, 1.5, new Vector(1, 0));
        
        const collision = algorithm.detect(aabb, triangle);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
        expect(collision!.normal).toBeInstanceOf(Vector);
    });

    test('should detect collision with square polygon (similar to AABB-AABB)', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const square = createPolygonEntity(4, 1.2, new Vector(0.8, 0));
        
        const collision = algorithm.detect(aabb, square);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should detect collision with pentagon', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const pentagon = createPolygonEntity(5, 1.5, new Vector(1, 0));
        
        const collision = algorithm.detect(aabb, pentagon);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should work with reversed entity order (Polygon-AABB)', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const triangle = createPolygonEntity(3, 1.5, new Vector(1, 0));
        
        const collision = algorithm.detect(triangle, aabb);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
    });

    test('should return null for invalid shape combinations', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const circle = createCircleEntity(0.5, new Vector(0, 0), new Vector(0, 0));
        
        const collision = algorithm.detect(aabb, circle);
        
        expect(collision).toBeNull();
    });

    test('should handle complex polygons (hexagon)', () => {
        const aabb = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const hexagon = createPolygonEntity(6, 1.2, new Vector(0.5, 0));
        
        const collision = algorithm.detect(aabb, hexagon);
        
        expect(collision).not.toBeNull();
    });
});

describe('Edge Cases and Integration Tests', () => {
    test('should handle very small overlaps correctly', () => {
        const algorithm = new AABBAABBAlgorithm();
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(1.999, 0)); // Very small overlap
        
        const collision = algorithm.detect(aabb1, aabb2);
        
        expect(collision).not.toBeNull();
        expect(collision!.depth).toBeGreaterThan(0);
        expect(collision!.depth).toBeLessThan(0.1);
    });

    test('should maintain collision info consistency across algorithms', () => {
        const aabbAlgorithm = new AABBAABBAlgorithm();
        const circleAlgorithm = new AABBCircleAlgorithm();
        
        const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
        const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(1, 0));
        const circle = createCircleEntity(0.8, new Vector(0, 0), new Vector(1.5, 0));
        
        const aabbCollision = aabbAlgorithm.detect(aabb1, aabb2);
        const circleCollision = circleAlgorithm.detect(aabb1, circle);
        
        expect(aabbCollision).not.toBeNull();
        expect(circleCollision).not.toBeNull();
        
        // Both should have valid collision info structure
        expect(aabbCollision!.bodyA).toBe(aabb1.body);
        expect(aabbCollision!.bodyB).toBe(aabb2.body);
        expect(circleCollision!.bodyA).toBe(aabb1.body);
        expect(circleCollision!.bodyB).toBe(circle.body);
    });

    test('should handle error cases gracefully', () => {
        const algorithm = new AABBAABBAlgorithm();
        
        // This should not throw an error, just return null
        expect(() => {
            const aabb1 = createAABBEntity(-1, -1, 1, 1, new Vector(0, 0));
            const aabb2 = createAABBEntity(-1, -1, 1, 1, new Vector(3, 3));
            algorithm.detect(aabb1, aabb2);
        }).not.toThrow();
    });
});
