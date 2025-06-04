import { EventEmitter } from '../events/EventEmitter';
import { PhysicsWorld } from '../../classes/PhysicsWorld';
import { Timer } from './Timer';

/**
 * Runner - The Main Game Loop Controller
 * 
 * This class is responsible for:
 * 1. Starting/stopping the simulation loop
 * 2. Maintaining consistent frame timing
 * 3. Orchestrating physics updates and rendering
 * 4. Managing performance monitoring
 * 
 * Think of this as the "heartbeat" of your physics simulation.
 */
export class Runner {
    private animationFrameId: number | null = null;
    private isRunning: boolean = false;
    private timer: Timer;
    private eventEmitter: EventEmitter;
    private physicsWorld: PhysicsWorld;
    
    // Performance tracking
    private frameCount: number = 0;
    private lastFPSUpdate: number = 0;
    private currentFPS: number = 0;
    
    constructor(physicsWorld: PhysicsWorld, eventEmitter: EventEmitter) {
        this.physicsWorld = physicsWorld;
        this.eventEmitter = eventEmitter;
        this.timer = new Timer();
    }

    /**
     * TODO: Implement the start method
     * 
     * This method should:
     * 1. Check if already running (prevent double-start)
     * 2. Set isRunning to true
     * 3. Reset the timer
     * 4. Emit a 'simulation:started' event with world info
     * 5. Start the main loop by calling requestAnimationFrame(this.tick.bind(this))
     * 6. Store the animation frame ID for later cancellation
     * 
     * Hint: Use performance.now() for timestamps
     * Hint: Remember to bind 'this' context when passing methods to requestAnimationFrame
     */
    start(): void {
        // TODO: Implement start logic here
        throw new Error("TODO: Implement Runner.start()");
    }

    /**
     * TODO: Implement the stop method
     * 
     * This method should:
     * 1. Check if currently running
     * 2. Cancel the animation frame if it exists
     * 3. Set isRunning to false
     * 4. Emit a 'simulation:stopped' event with final statistics
     * 5. Reset internal counters
     * 
     * Hint: Use cancelAnimationFrame() to stop the loop
     */
    stop(): void {
        // TODO: Implement stop logic here
        throw new Error("TODO: Implement Runner.stop()");
    }

    /**
     * TODO: Implement the main tick method
     * 
     * This is the heart of your game loop. Each frame it should:
     * 1. Calculate delta time since last frame using the timer
     * 2. Update physics world with the delta time
     * 3. Update performance counters (FPS calculation)
     * 4. Emit performance events periodically (every second)
     * 5. Emit a physics step event with timing info
     * 6. Schedule the next frame with requestAnimationFrame
     * 
     * Performance considerations:
     * - Limit delta time to prevent spiral of death (max 16ms or 1/60th second)
     * - Only calculate FPS every second, not every frame
     * - Use high-resolution timestamps for accuracy
     * 
     * Hint: The method signature should be tick(timestamp: number): void
     * Hint: Always schedule the next frame at the end, even if errors occur
     */
    private tick(timestamp: number): void {
        // TODO: Implement the main game loop tick here
        throw new Error("TODO: Implement Runner.tick()");
    }

    /**
     * TODO: Implement FPS calculation
     * 
     * This method should:
     * 1. Increment frame counter
     * 2. Check if a second has passed since last FPS update
     * 3. Calculate FPS = frames / time elapsed
     * 4. Reset counters for next measurement period
     * 5. Store the calculated FPS
     * 
     * Call this method every frame from tick()
     */
    private updatePerformanceCounters(timestamp: number): void {
        // TODO: Implement FPS calculation and performance tracking
        throw new Error("TODO: Implement Runner.updatePerformanceCounters()");
    }

    /**
     * TODO: Implement performance event emission
     * 
     * This method should:
     * 1. Emit a 'performance:update' event
     * 2. Include current FPS, physics timing, and other metrics
     * 3. Only call this periodically (not every frame)
     * 
     * The event data should match the PerformanceUpdateEvent type
     */
    private emitPerformanceUpdate(physicsTime: number): void {
        // TODO: Implement performance event emission
        throw new Error("TODO: Implement Runner.emitPerformanceUpdate()");
    }

    // Getter methods for external access
    getCurrentFPS(): number {
        return this.currentFPS;
    }

    getIsRunning(): boolean {
        return this.isRunning;
    }

    getFrameCount(): number {
        return this.frameCount;
    }
} 