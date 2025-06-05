/**
 * Timer - High-Resolution Timing Utility
 *   
 * Key concepts:
 * - Delta Time: Time elapsed since last frame (crucial for frame-rate independent physics)
 * - High Resolution: Uses performance.now() for sub-millisecond precision
 * - Time Clamping: Prevents huge time steps that can break physics
 * 
 * Example usage in Runner:
 * ```typescript
 * const timer = new Timer();
 * timer.reset(); // Start the stopwatch
 * 
 * // In game loop:
 * const deltaTime = timer.getDeltaTime(); // Get time since last frame
 * physicsWorld.step(deltaTime); // Update physics with consistent timing
 * ```
 */
export class Timer {    
    
    /**
     * lastTime: The timestamp of the previous frame
     */
    private lastTime: number = 0;
    
    /**
     * startTime: When the timer was first started/reset
     */
    private startTime: number = 0;
    
    /**
     * totalTime: Accumulated time since start (in milliseconds)
     */
    private totalTime: number = 0;

    /**
     * MAX_DELTA_TIME: Maximum allowed time step (16.67ms = 60 FPS)
     */
    private readonly MAX_DELTA_TIME = 1000 / 60; 

    constructor() {
        this.reset();
    }

    reset(): void {
        const now = performance.now();
        this.startTime = now;
        this.lastTime = now;
        this.totalTime = 0;
    }

    getDeltaTime(): number {
        const now = performance.now();
        const rawDelta = now - this.lastTime;
        const clampedDelta = Math.min(rawDelta, this.MAX_DELTA_TIME);
        this.lastTime = now;
        this.totalTime += clampedDelta;
        return clampedDelta / 1000;
    }

    getTotalTime(): number {
        return this.totalTime / 1000;
    }

    getCurrentTime(): number {
        return performance.now();
    }

    calculateFPS(deltaTimeInSeconds: number): number {
        if (deltaTimeInSeconds <= 0) return 60;
        return 1 / deltaTimeInSeconds;
    }

    
    getMaxDeltaTime(): number {
        return this.MAX_DELTA_TIME;
    }

    getLastTime(): number {
        return this.lastTime;
    }

    getStartTime(): number {
        return this.startTime;
    }
}

