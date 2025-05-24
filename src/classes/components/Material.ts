/**
 * Material component for physical properties.
 * 
 * Defines material characteristics that affect how objects
 * behave during collisions and interactions.
 * 
 * @category Components
 */

export class Material {
    public density: number;
    public friction: number;
    public restitution: number;
    public staticFriction: number;
    public frictionAir: number;

    constructor(
        density: number = 1.0,
        friction: number = 0.1,
        restitution: number = 0.5,
        staticFriction: number = 0.5,
        frictionAir: number = 0.01
    ) {
        this.density = density;
        this.friction = friction;
        this.restitution = restitution;
        this.staticFriction = staticFriction;
        this.frictionAir = frictionAir;
    }

    /**
     * Gets the density of the material
     * @returns Density in kg/m³
     */
    getDensity(): number {
        return this.density;
    }

    /**
     * Sets the density of the material
     * @param density - Density in kg/m³
     */
    setDensity(density: number): void {
        if (density <= 0) {
            throw new Error("Density must be positive");
        }
        this.density = density;
    }

    /**
     * Gets the kinetic friction coefficient
     * @returns Friction coefficient (0-1)
     */
    getFriction(): number {
        return this.friction;
    }

    /**
     * Sets the kinetic friction coefficient
     * @param friction - Friction coefficient (0-1)
     */
    setFriction(friction: number): void {
        if (friction < 0 || friction > 1) {
            throw new Error("Friction must be between 0 and 1");
        }
        this.friction = friction;
    }

    /**
     * Gets the restitution (bounciness) coefficient
     * @returns Restitution coefficient (0-1)
     */
    getRestitution(): number {
        return this.restitution;
    }

    /**
     * Sets the restitution (bounciness) coefficient
     * @param restitution - Restitution coefficient (0-1)
     */
    setRestitution(restitution: number): void {
        if (restitution < 0 || restitution > 1) {
            throw new Error("Restitution must be between 0 and 1");
        }
        this.restitution = restitution;
    }

    /**
     * Gets the static friction coefficient
     * @returns Static friction coefficient
     */
    getStaticFriction(): number {
        return this.staticFriction;
    }

    /**
     * Sets the static friction coefficient
     * @param staticFriction - Static friction coefficient
     */
    setStaticFriction(staticFriction: number): void {
        if (staticFriction < 0) {
            throw new Error("Static friction must be non-negative");
        }
        this.staticFriction = staticFriction;
    }

    /**
     * Gets the air friction coefficient
     * @returns Air friction coefficient
     */
    getFrictionAir(): number {
        return this.frictionAir;
    }

    /**
     * Sets the air friction coefficient
     * @param frictionAir - Air friction coefficient
     */
    setFrictionAir(frictionAir: number): void {
        if (frictionAir < 0) {
            throw new Error("Air friction must be non-negative");
        }
        this.frictionAir = frictionAir;
    }

    /**
     * Creates a copy of this material
     * @returns Cloned material
     */
    clone(): Material {
        return new Material(
            this.density,
            this.friction,
            this.restitution,
            this.staticFriction,
            this.frictionAir
        );
    }

    /**
     * Predefined material types for common use cases
     */
    static readonly PRESETS = {
        RUBBER: new Material(1.5, 0.8, 0.9, 1.0, 0.01),
        STEEL: new Material(7.8, 0.6, 0.2, 0.8, 0.01),
        WOOD: new Material(0.6, 0.4, 0.4, 0.6, 0.01),
        ICE: new Material(0.9, 0.02, 0.1, 0.05, 0.01),
        BOUNCY_BALL: new Material(1.0, 0.3, 0.95, 0.4, 0.01),
        STONE: new Material(2.5, 0.7, 0.1, 0.9, 0.01)
    };
} 