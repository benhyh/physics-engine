/**
 * Event type definitions for the physics simulation
 * 
 * This file defines all possible events that can be emitted during simulation.
 * Each event has a specific structure with type safety.
 * 
 * @category Events
 */

import { Vector } from "@/classes/Vector";
import { RigidBody } from "@/classes/RigidBody";
import { CollisionPair } from "@/sims/CollisionDectector";

export interface BaseEvent {
    type: string;
    timestamp: number;
    source?: string; 
}

export interface SimulationStartedEvent extends BaseEvent {
    type: 'simulation:started';
    data: {
        worldBounds: { width: number; height: number };
        gravity: Vector;
    };
}

export interface SimulationStoppedEvent extends BaseEvent {
    type: 'simulation:stopped';
    data: {
        reason: 'user' | 'error' | 'complete';
        finalStats: {
            totalBodies: number;
            totalCollisions: number;
            runtime: number;
        };
    };
}

export interface PhysicsStepEvent extends BaseEvent {
    type: 'physics:step';
    data: {
        deltaTime: number;
        stepCount: number;
        bodyCount: number;
    };
}

// Collision events
export interface CollisionDetectedEvent extends BaseEvent {
    type: 'collision:detected';
    data: {
        pairs: CollisionPair[];
        totalCollisions: number;
    };
}

export interface CollisionStartEvent extends BaseEvent {
    type: 'collision:start';
    data: {
        bodyA: RigidBody;
        bodyB: RigidBody;
        contactPoint: Vector;
        normal: Vector;
        depth: number;
    };
}

export interface CollisionEndEvent extends BaseEvent {
    type: 'collision:end';
    data: {
        bodyA: RigidBody;
        bodyB: RigidBody;
        duration: number; // How long the collision lasted
    };
}

// Body lifecycle events
export interface BodyAddedEvent extends BaseEvent {
    type: 'body:added';
    data: {
        body: RigidBody;
        totalBodies: number;
    };
}

export interface BodyRemovedEvent extends BaseEvent {
    type: 'body:removed';
    data: {
        bodyId: string;
        totalBodies: number;
    };
}

// Input events
export interface MouseDownEvent extends BaseEvent {
    type: 'input:mousedown';
    data: {
        screenPosition: Vector;
        worldPosition: Vector;
        button: number;
        targetBody?: RigidBody;
    };
}

export interface MouseMoveEvent extends BaseEvent {
    type: 'input:mousemove';
    data: {
        screenPosition: Vector;
        worldPosition: Vector;
        deltaPosition: Vector;
    };
}

export interface MouseUpEvent extends BaseEvent {
    type: 'input:mouseup';
    data: {
        screenPosition: Vector;
        worldPosition: Vector;
        button: number;
    };
}

// Rendering events
export interface RenderFrameEvent extends BaseEvent {
    type: 'render:frame';
    data: {
        frameNumber: number;
        fps: number;
        renderTime: number;
        entitiesRendered: number;
    };
}

export interface CameraChangedEvent extends BaseEvent {
    type: 'camera:changed';
    data: {
        position: Vector;
        zoom: number;
        bounds: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
    };
}

// Performance events
export interface PerformanceUpdateEvent extends BaseEvent {
    type: 'performance:update';
    data: {
        fps: number;
        physicsTime: number;
        renderTime: number;
        memoryUsage?: number;
        collisionChecks: number;
    };
}

// Union type of all possible events
export type SimulationEvent = 
    | SimulationStartedEvent
    | SimulationStoppedEvent
    | PhysicsStepEvent
    | CollisionDetectedEvent
    | CollisionStartEvent
    | CollisionEndEvent
    | BodyAddedEvent
    | BodyRemovedEvent
    | MouseDownEvent
    | MouseMoveEvent
    | MouseUpEvent
    | RenderFrameEvent
    | CameraChangedEvent
    | PerformanceUpdateEvent;

// Event listener function type
export type EventListener<T extends SimulationEvent = SimulationEvent> = (event: T) => void;

// TODO: Consider adding event priorities for ordered execution
// TODO: Add event cancellation mechanism for preventable events
// TODO: Consider adding event batching for performance-critical events 