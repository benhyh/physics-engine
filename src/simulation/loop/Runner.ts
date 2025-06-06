import { EventEmitter } from '../events/EventEmitter';
import { PhysicsWorld } from '../../classes/PhysicsWorld';
import { Timer } from './Timer';
import { Vector } from '../../classes/Vector';

/**
 * Runner - The Main Game Loop Controller 
 * Example usage:
 * ```typescript
 * const physicsWorld = new PhysicsWorld();
 * const eventEmitter = new EventEmitter();
 * const runner = new Runner(physicsWorld, eventEmitter);
 * 
 * runner.start(); // Begin the simulation
 * // ... simulation runs automatically ...
 * runner.stop();  // Stop when done
 * ```
 */

export class Runner {    
    private animationFrameId: number | null = null;
    private isRunning: boolean = false;
    
    // === CORE DEPENDENCIES ===
    private timer: Timer;
    private eventEmitter: EventEmitter;
    private physicsWorld: PhysicsWorld;
    
    // === PERFORMANCE TRACKING ===
    private frameCount: number = 0;
    private lastFPSUpdate: number = 0;
    private currentFPS: number = 0;
    
    constructor(physicsWorld: PhysicsWorld, eventEmitter: EventEmitter) {
        this.physicsWorld = physicsWorld;
        this.eventEmitter = eventEmitter;
        this.timer = new Timer();
    }

    /**
     * Starts the physics simulation loop
     * @throws {void} No errors thrown - method handles duplicate starts gracefully
     *       
     * Pre-condition: EventEmitter and PhysicsWorld must be initialized
     * Post-condition: Simulation is running and tick() will be called each frame
     */
    start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timer.reset();
        this.eventEmitter.emit({
            type: 'simulation:started',
            timestamp: performance.now(),
            data: {
                worldBounds: { width: 800, height: 600 }, // default world bounds
                gravity: new Vector(0, 9.81) // default gravity vector
            }
        });
        this.animationFrameId = requestAnimationFrame(this.tick.bind(this));
    }
    
    /**
     * Stops the physics simulation loop and performs cleanup
     * @throws {void} No errors thrown - method handles stopping when not running gracefully
     * 
     * Pre-condition: None (handles all states gracefully)
     * Post-condition: Simulation is stopped and all counters are reset
     */ 
    stop(): void {
        if (!this.isRunning) return;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.isRunning = false;
        this.eventEmitter.emit({
            type: 'simulation:stopped',
            timestamp: performance.now(),
            data: {
                reason: 'user' as const,
                finalStats: {
                    totalBodies: 0, // TODO: add getter for body count
                    totalCollisions: 0, // TODO: add collision tracking
                    runtime: this.timer.getTotalTime()
                }
            }
        });
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 0;
        }

    /**
     * Main simulation loop - executes once per frame
     * @param timestamp - High-resolution timestamp from requestAnimationFrame
     * @throws {void} Handles physics errors gracefully to maintain loop stability
     * 
     * Pre-condition: Simulation must be running (isRunning = true)
     * Post-condition: Physics state updated, events emitted, next frame scheduled
     */
    private tick(timestamp: number): void {
        const deltaTime = this.timer.getDeltaTime();
        const physicsStart = performance.now();
        this.physicsWorld.step(deltaTime);
        const physicsTime = performance.now() - physicsStart;
        this.updatePerformanceCounters(timestamp);
        this.eventEmitter.emit({
            type: 'physics:step',
            timestamp: performance.now(),
            data: {
                deltaTime: deltaTime,
                stepCount: this.frameCount,
                bodyCount: 0 // TODO: add getter for body count
            }
        });
        this.animationFrameId = requestAnimationFrame(this.tick.bind(this));
        }

    /**
     * Updates performance counters and calculates FPS
     * @param timestamp - Current frame timestamp for FPS calculation
     * @throws {void} No errors thrown
     * Pre-condition: timestamp must be a valid performance.now() value
     * Post-condition: Frame counter updated, FPS calculated if measurement period complete
     */
    private updatePerformanceCounters(timestamp: number): void {
        this.frameCount++;
        if (timestamp - this.lastFPSUpdate >= 1000) {
            const timeElapsed = (timestamp - this.lastFPSUpdate) / 1000;
            this.currentFPS = this.frameCount / timeElapsed;
            this.frameCount = 0; 
            this.lastFPSUpdate = timestamp;
        }
    }

    /**
     * Emits performance metrics event for monitoring and debugging
     * @param physicsTime - Time taken for physics update in milliseconds
     * @throws {void} No errors thrown
     * 
     * Pre-condition: physicsTime must be a valid measurement in milliseconds
     * Post-condition: Performance update event emitted to all listeners
     */
    private emitPerformanceUpdate(physicsTime: number): void {
        this.eventEmitter.emit({
            type: 'performance:update',
            timestamp: performance.now(),
            data: { 
                fps: this.currentFPS, 
                physicsTime: physicsTime,
                renderTime: 0, // TODO: add render time tracking
                collisionChecks: 0 // TODO: add collision check counting
            }
        });
    }

    /**
     * Gets the current frames per second measurement
     * @returns Current FPS value (0 if no measurement taken yet)
     * 
     * Pre-condition: None
     * Post-condition: Returns most recent FPS calculation
     */
    getCurrentFPS(): number {
        return this.currentFPS;
    }

    /**
     * Checks if the simulation is currently running
     * @returns true if simulation is active, false otherwise
     * 
     * Pre-condition: None
     * Post-condition: Returns current running state
     */
    getIsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Sets the simulation running state (internal use)
     * @param isRunning - New running state to set
     * @throws {void} No errors thrown
     * 
     * Pre-condition: isRunning must be a boolean value
     * Post-condition: Internal running state updated
     */
    setIsRunning(isRunning: boolean): void {
        this.isRunning = isRunning;
    }

    /**
     * Gets the current frame count for the measurement period
     * @returns Number of frames since last FPS calculation
     * 
     * Pre-condition: None
     * Post-condition: Returns current frame counter value
     */
    getFrameCount(): number {
        return this.frameCount;
    }
} 