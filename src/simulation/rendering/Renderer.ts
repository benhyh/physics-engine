/**
 * Abstract Renderer base class
 * 
 * Defines the interface that all concrete renderers must implement.
 * Handles the basic rendering lifecycle and integrates with the events system.
 * 
 * @category Rendering
 */

import { EventEmitter } from "@/simulation/events/EventEmitter";
import { RenderContext } from "./RenderContext";
import { Vector } from "@/classes/Vector";
import { RigidBody } from "@/classes/RigidBody";

/**
 * Rendering options that can be passed to drawing methods
 */
export interface RenderOptions {
    strokeColor?: string;
    fillColor?: string;
    lineWidth?: number;
    alpha?: number;
    dashed?: boolean;
    dashPattern?: number[];
}

/**
 * Default rendering styles for different object types
 */
export const DEFAULT_STYLES = {
    BODY: {
        strokeColor: '#ffffff',
        fillColor: '#4a90e2',
        lineWidth: 2,
        alpha: 1.0
    },
    STATIC_BODY: {
        strokeColor: '#ffffff',
        fillColor: '#666666',
        lineWidth: 2,
        alpha: 1.0
    },
    CONSTRAINT: {
        strokeColor: '#ff6b6b',
        fillColor: 'transparent',
        lineWidth: 1,
        alpha: 0.8
    },
    DEBUG: {
        strokeColor: '#ffff00',
        fillColor: 'transparent',
        lineWidth: 1,
        alpha: 0.6,
        dashed: true,
        dashPattern: [5, 5]
    }
} as const;

/**
 * Abstract base class for all renderers
 * 
 * Provides common functionality and defines the interface that concrete
 * renderers must implement. Handles coordinate transformations, event emission,
 * and basic rendering lifecycle.
 */
export abstract class Renderer {
    protected eventEmitter: EventEmitter;
    protected renderContext: RenderContext;
    protected isInitialized: boolean = false;
    
    // Performance tracking
    private frameNumber: number = 0;
    private lastRenderTime: number = 0;
    private entitiesRendered: number = 0;

    constructor(eventEmitter: EventEmitter, renderContext: RenderContext) {
        this.eventEmitter = eventEmitter;
        this.renderContext = renderContext;
    }

    /**
     * Initialize the renderer
     * Concrete implementations should call super.initialize() first
     */
    public initialize(): void {
        this.isInitialized = true;
        this.frameNumber = 0;
        this.lastRenderTime = performance.now();
    }

    /**
     * Clean up resources
     * Concrete implementations should call super.dispose() last
     */
    public dispose(): void {
        this.isInitialized = false;
    }

    /**
     * Main render method - orchestrates the entire rendering process
     * 
     * @param bodies - Array of rigid bodies to render
     * @param deltaTime - Time since last frame in seconds
     */
    public render(bodies: RigidBody[], deltaTime: number): void {
        if (!this.isInitialized) {
            console.warn('Renderer not initialized - skipping render');
            return;
        }

        const renderStartTime = performance.now();
        
        // Clear the canvas/surface
        this.clear();
        
        // Reset entity counter
        this.entitiesRendered = 0;
        
        // Render all bodies
        for (const body of bodies) {
            this.renderBody(body);
            this.entitiesRendered++;
        }
        
        // Render debug information if needed
        this.renderDebugInfo(bodies);
        
        // Update performance metrics and emit event
        this.updatePerformanceMetrics(renderStartTime, deltaTime);
    }

    /**
     * Clear the rendering surface
     * Must be implemented by concrete classes
     */
    protected abstract clear(): void;

    /**
     * Render a single rigid body
     * Must be implemented by concrete classes
     * 
     * @param body - The rigid body to render
     */
    protected abstract renderBody(body: RigidBody): void;

    /**
     * Draw a circle at the specified world position
     * Must be implemented by concrete classes
     * 
     * @param center - World position of circle center
     * @param radius - Radius in world units
     * @param options - Rendering options
     */
    public abstract drawCircle(center: Vector, radius: number, options?: RenderOptions): void;

    /**
     * Draw a rectangle at the specified world position
     * Must be implemented by concrete classes
     * 
     * @param center - World position of rectangle center
     * @param width - Width in world units
     * @param height - Height in world units
     * @param rotation - Rotation in radians
     * @param options - Rendering options
     */
    public abstract drawRectangle(center: Vector, width: number, height: number, rotation: number, options?: RenderOptions): void;

    /**
     * Draw a polygon defined by an array of vertices
     * Must be implemented by concrete classes
     * 
     * @param vertices - Array of world coordinate vertices (should be in correct winding order)
     * @param options - Rendering options
     */
    public abstract drawPolygon(vertices: Vector[], options?: RenderOptions): void;

    /**
     * Draw a line between two world positions
     * Must be implemented by concrete classes
     * 
     * @param start - Start position in world coordinates
     * @param end - End position in world coordinates
     * @param options - Rendering options
     */
    public abstract drawLine(start: Vector, end: Vector, options?: RenderOptions): void;

    /**
     * Draw text at the specified world position
     * Must be implemented by concrete classes
     * 
     * @param text - Text to draw
     * @param position - World position
     * @param options - Rendering options (may include font size, family, etc.)
     */
    public abstract drawText(text: string, position: Vector, options?: RenderOptions & { fontSize?: number; fontFamily?: string }): void;

    /**
     * Render debug information (velocity vectors, bounding boxes, etc.)
     * Default implementation does nothing - can be overridden
     * 
     * @param bodies - Array of bodies for debug rendering
     */
    protected renderDebugInfo(bodies: RigidBody[]): void {
        // Default: no debug rendering
        // Concrete classes can override to add debug visualization
    }

    /**
     * Update performance metrics and emit render frame event
     * 
     * @param renderStartTime - When rendering started (performance.now())
     * @param deltaTime - Frame delta time in seconds
     */
    private updatePerformanceMetrics(renderStartTime: number, deltaTime: number): void {
        const renderEndTime = performance.now();
        const renderTime = renderEndTime - renderStartTime;
        
        this.frameNumber++;
        this.lastRenderTime = renderTime;
        
        // Calculate FPS from delta time
        const fps = deltaTime > 0 ? 1 / deltaTime : 0;
        
        // Emit render frame event
        this.eventEmitter.emit({
            type: 'render:frame',
            timestamp: renderEndTime,
            source: 'Renderer',
            data: {
                frameNumber: this.frameNumber,
                fps: fps,
                renderTime: renderTime,
                entitiesRendered: this.entitiesRendered
            }
        });
    }

    /**
     * Get current performance metrics
     */
    public getPerformanceMetrics() {
        return {
            frameNumber: this.frameNumber,
            lastRenderTime: this.lastRenderTime,
            entitiesRendered: this.entitiesRendered
        };
    }

    /**
     * Get the render context (for coordinate transformations)
     */
    public getRenderContext(): RenderContext {
        return this.renderContext;
    }

    /**
     * Check if renderer is initialized
     */
    public isReady(): boolean {
        return this.isInitialized;
    }
}

// TODO: Add support for render layers/z-ordering
// TODO: Consider adding viewport culling for performance
// TODO: Add support for custom shaders/effects in WebGL renderer
// TODO: Implement render caching for static objects 