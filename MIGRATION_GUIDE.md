# Architecture Migration Guide

## Overview

We've refactored the physics engine to use a **component-based architecture** that separates concerns and eliminates code duplication. This guide shows how to migrate from the old pattern to the new one.

## 🚫 Old Architecture Problems

```typescript
// ❌ OLD WAY - Mixed responsibilities
class CircleShape extends Shape {
    // Geometry properties mixed with collision logic
    intersects(other: Shape): boolean {
        // Collision logic scattered across shape classes
    }
}

// ❌ Physics and geometry tightly coupled
const rigidBody = new RigidBody(mass, position);
rigidBody.shape = new CircleShape(radius); // Tight coupling
```

**Problems:**
- Collision logic duplicated across every shape class
- Physics and geometry tightly coupled
- Hard to add new collision algorithms
- Circular dependencies between shape classes
- Violation of Single Responsibility Principle

## ✅ New Component-Based Architecture

### 1. **Centralized Collision System**

```typescript
// ✅ NEW WAY - Centralized collision detection
import { CollisionSystem } from './classes/collision/CollisionSystem';

const collisionSystem = new CollisionSystem();
const collision = collisionSystem.detectCollision(entityA, entityB);
```

### 2. **Pure Geometry Shapes**

```typescript
// ✅ Shapes are now pure geometry - no collision logic
import { IShape } from './classes/components/PhysicsEntity';

class CircleShapeGeometry implements IShape {
    getBounds(): AABB { /* pure geometry */ }
    getVertices(): Vector[] { /* pure geometry */ }
    containsPoint(point: Vector): boolean { /* pure geometry */ }
    // NO collision methods!
}
```

### 3. **Component Composition**

```typescript
// ✅ Clean separation of concerns
import { PhysicsEntity } from './classes/components/PhysicsEntity';
import { Transform } from './classes/components/Transform';
import { Material } from './classes/components/Material';
import { RigidBody } from './classes/RigidBody';

const entity = new PhysicsEntity(
    new RigidBody(mass),           // Physics properties
    new CircleShapeGeometry(radius), // Pure geometry
    new Transform(position, rotation), // Spatial properties
    Material.PRESETS.RUBBER        // Material properties
);
```

### 4. **Easy Entity Creation**

```typescript
// ✅ Factory pattern for common configurations
import { EntityFactory } from './classes/components/EntityFactory';

// Simple creation
const ball = EntityFactory.createCircle(10, { 
    position: new Vector(100, 100),
    material: Material.PRESETS.BOUNCY_BALL 
});

// Predefined entities
const ground = EntityFactory.PRESETS.GROUND(800, 50);
const box = EntityFactory.PRESETS.WOODEN_BOX(50);
```

## 📋 Migration Steps

### Step 1: Replace Shape Creation

```typescript
// ❌ OLD
const shape = new CircleShape(radius, center);
const body = new RigidBody(mass, position);
body.shape = shape;

// ✅ NEW
const entity = EntityFactory.createCircle(radius, {
    position: center,
    mass: mass
});
```

### Step 2: Replace Collision Detection

```typescript
// ❌ OLD - Scattered across shapes
if (shapeA.intersects(shapeB)) {
    // Handle collision
}

// ✅ NEW - Centralized system
const collision = collisionSystem.detectCollision(entityA, entityB);
if (collision) {
    // Handle collision with detailed info
    console.log('Collision depth:', collision.getDepth());
    console.log('Contact point:', collision.getContactPoint());
}
```

### Step 3: Update Physics World

```typescript
// ❌ OLD - Mixed body types
class PhysicsWorld {
    private bodies: RigidBody[] = [];
    
    step(dt: number) {
        // Mixed collision logic
    }
}

// ✅ NEW - Clean entity management
class PhysicsWorld {
    private entities: PhysicsEntity[] = [];
    private collisionSystem = new CollisionSystem();
    
    step(dt: number) {
        // Clean separation
        const collisions = this.entities
            .flatMap(entityA => 
                this.entities.map(entityB => 
                    this.collisionSystem.detectCollision(entityA, entityB)
                ).filter(Boolean)
            );
        
        this.resolveCollisions(collisions);
        this.entities.forEach(entity => entity.integrate(dt));
    }
}
```

## 🎯 Benefits of New Architecture

### 1. **No Code Duplication**
- Collision logic in one place
- Easy to maintain and debug
- Consistent behavior across all shapes

### 2. **Clean Separation of Concerns**
```typescript
RigidBody    → Physics properties (mass, velocity, forces)
IShape       → Pure geometry (vertices, bounds, area)
Transform    → Spatial properties (position, rotation, scale)
Material     → Physical properties (friction, restitution)
PhysicsEntity → Composition of all components
```

### 3. **Easy Extension**
```typescript
// Add new collision algorithm
collisionSystem.registerAlgorithm(
    ShapeType.CIRCLE, 
    ShapeType.CUSTOM_SHAPE,
    new CustomCollisionAlgorithm()
);

// Add new shape type
class StarShapeGeometry implements IShape {
    // Only implement geometry methods
}
```

### 4. **Better Testing**
```typescript
// Test geometry separately
const shape = new CircleShapeGeometry(10);
expect(shape.getArea()).toBe(Math.PI * 100);

// Test collision algorithm separately
const algorithm = new CircleCircleAlgorithm();
const collision = algorithm.detect(entityA, entityB);

// Test physics separately
const body = new RigidBody(mass);
body.addForce(force);
body.integrate(dt);
```

## 🛠 Implementation Status

### ✅ Completed
- [x] Centralized CollisionSystem architecture
- [x] Component classes (Transform, Material, PhysicsEntity)
- [x] EntityFactory with presets
- [x] Migration guide

### 🚧 In Progress
- [ ] Implement collision algorithms in CollisionSystem
- [ ] Convert existing shapes to implement IShape interface
- [ ] Update PhysicsWorld to use new architecture
- [ ] Add comprehensive tests

### 📋 Future Steps
1. Implement specific collision algorithms
2. Migrate existing shape classes
3. Update demos to use new system
4. Add performance optimizations
5. Create comprehensive documentation

## 🎮 Example Usage

```typescript
import { EntityFactory, PhysicsWorld, CollisionSystem } from './physics-engine';

// Create world
const world = new PhysicsWorld();
const collisionSystem = new CollisionSystem();

// Create entities
const ball = EntityFactory.PRESETS.BOUNCING_BALL(20, new Vector(100, 0));
const ground = EntityFactory.PRESETS.GROUND(800, 50, new Vector(0, 300));

// Add to world
world.addEntity(ball);
world.addEntity(ground);

// Run simulation
function gameLoop() {
    world.step(1/60); // 60 FPS
    render(world.getEntities());
    requestAnimationFrame(gameLoop);
}
```

This new architecture provides a solid foundation for building complex physics simulations while maintaining clean, testable, and extensible code. 