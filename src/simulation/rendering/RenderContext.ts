import { Vector } from '../../classes/Vector';

/**
 * RenderContext - The Coordinate System Translator
 * 
 * Example usage:
 * ```typescript
 * const context = new RenderContext();
 * context.setDimensions(800, 600);
 * 
 * // Physics has a ball at world position (2, 1) 
 * const worldPos = new Vector(2, 1);
 * const cameraPos = new Vector(0, 0);
 * const zoom = 1.0;
 * 
 * // Convert to screen for drawing
 * const screenPos = context.worldToScreen(worldPos, cameraPos, zoom);
 * // Now we can draw the ball at screenPos.x, screenPos.y pixels
 * ```
 */
export class RenderContext {    
    /**
     * width: Canvas width in pixels
     * 
     * Example: 800 means canvas is 800 pixels wide
     */
    private width: number = 0;
    
    /**
     * height: Canvas height in pixels
     * 
     * Example: 600 means canvas is 600 pixels tall
     */
    private height: number = 0;
        
    /**
     * pixelsPerUnit: How many pixels = 1 world unit
     * 
     * Examples:
     * - 50: Each meter in physics = 50 pixels on screen
     * - 100: Each meter in physics = 100 pixels (more zoomed in)
     * - 25: Each meter in physics = 25 pixels (more zoomed out)
     * 
     */
    private pixelsPerUnit: number = 50;
    
    
    /**
     * debugMode: Whether to show coordinate system helpers
     * 
     * when true, renderer might draw:
     * - grid lines
     * - coordinate axes
     * - position labels
     */
    private debugMode: boolean = false;

    constructor() {
        this.setDimensions(800, 600);
        this.setDebugMode(false);
        this.setPixelsPerUnit(50);
    }

    /**
     * @param width - Canvas width in pixels
     * @param height - Canvas height in pixels
     * @throws {Error} If dimensions are invalid
     * 
     * Pre-condition: width and height must be positive numbers
     * Post-condition: Canvas dimensions are stored for coordinate calculations
     */
    setDimensions(width: number, height: number): void {
        if (width <= 0 || height <= 0) throw new Error("Dimensions must be positive");
        this.width = width;
        this.height = height;
    }

    /**
     * Example:
     * - World position: (2, 1) meters
     * - Camera at: (0, 0) 
     * - Zoom: 1.0, Scale: 50 pixels/meter
     * - Screen: 800x600 pixels
     * 
     * Calculation:
     * - offsetX = (2 - 0) * 1 * 50 = 100 pixels
     * - offsetY = (1 - 0) * 1 * 50 = 50 pixels  
     * - screenX = 100 + 800/2 = 500 pixels (right of center)
     * - screenY = -50 + 600/2 = 250 pixels (above center)
     * 
     * @param worldPos - Position in world coordinates (meters)
     * @param cameraPos - Camera position in world coordinates
     * @param zoom - Camera zoom factor (1.0 = normal, 2.0 = 2x zoomed in)
     * @returns Position in screen coordinates (pixels)
     * 
     * Pre-condition: All parameters must be valid Vector objects
     * Post-condition: Returns valid screen coordinates for drawing
     */
    worldToScreen(worldPos: Vector, cameraPos: Vector, zoom: number): Vector {
        const offsetX = (worldPos.x - cameraPos.x) * zoom * this.pixelsPerUnit;
        const offsetY = (worldPos.y - cameraPos.y) * zoom * this.pixelsPerUnit;
        const screenX = offsetX + this.width / 2;
        const screenY = -offsetY + this.height / 2;
        return new Vector(screenX, screenY);
    }

    /**
     * Example (inverse of worldToScreen):
     * - Screen click: (500, 250) pixels
     * - Camera at: (0, 0)
     * - Zoom: 1.0, Scale: 50 pixels/meter
     * - Screen: 800x600 pixels
     * 
     * Calculation:
     * - offsetX = 500 - 800/2 = 100 pixels
     * - offsetY = -(250 - 600/2) = -(-50) = 50 pixels
     * - worldX = 100 / (1 * 50) + 0 = 2 meters
     * - worldY = 50 / (1 * 50) + 0 = 1 meter
     * - Result: (2, 1) 
     * 
     * @param screenPos - Position in screen coordinates (pixels)
     * @param cameraPos - Camera position in world coordinates  
     * @param zoom - Camera zoom factor
     * @returns Position in world coordinates (meters)
     * 
     * Pre-condition: screenPos must be valid screen coordinates
     * Post-condition: Returns valid world coordinates for physics
     */
    screenToWorld(screenPos: Vector, cameraPos: Vector, zoom: number): Vector {
        const offsetX = screenPos.x - this.width / 2;
        const offsetY = -(screenPos.y - this.height / 2);
        const worldX = offsetX / (zoom * this.pixelsPerUnit) + cameraPos.x;
        const worldY = offsetY / (zoom * this.pixelsPerUnit) + cameraPos.y;
        return new Vector(worldX, worldY);
    }

    /**
     * @returns Current pixels per world unit
     * 
     * Pre-condition: None
     * Post-condition: Returns current scale factor
     */
    getPixelsPerUnit(): number {
        return this.pixelsPerUnit;
    }

    /**
     * @param pixelsPerUnit - New scale factor (must be positive)
     * @throws {Error} If scale factor is invalid
     * 
     * Pre-condition: pixelsPerUnit must be positive
     * Post-condition: Scale factor is updated for future conversions
     */
    setPixelsPerUnit(pixelsPerUnit: number): void {
        if (pixelsPerUnit <= 0) throw new Error('Pixels per unit must be positive.');
        this.pixelsPerUnit = pixelsPerUnit;
    }
    
    /**
     * Gets current canvas width in pixels
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Gets current canvas height in pixels  
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Calculates width/height ratio (useful for camera bounds)
     */
    getAspectRatio(): number {
        return this.height > 0 ? this.width / this.height : 1;
    }

    /**
     * Checks if debug mode is enabled
     */
    isDebugMode(): boolean {
        return this.debugMode;
    }

    /**
     * Enables/disables debug visualizations
     */
    setDebugMode(enabled: boolean): void {
        this.debugMode = enabled;
    }
} 