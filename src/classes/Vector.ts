/**
 * 1. Vector Addition
 * 2. Vector Substraction
 * 3. Vector Multiplication
 * 4. Dot Product
 * 5. Cross Product 
 * 6. Rotation
 * 
 * A 2D Vector class that implements common vector operations.
 * All operations return new Vector instances to maintain immutability.
 * 
 * @example
 * ```typescript
 * const v1 = new Vector(1, 2);
 * const v2 = new Vector(3, 4);
 * const sum = v1.add(v2); // Vector(4, 6)
 * ```
 * 
 * @category Core
 */

export class Vector {
    /**
     * Creates a new Vector instance
     * @param x - The x component of the vector
     * @param y - The y component of the vector
     * 
     * @example
     * ```typescript
     * const v = new Vector(1, 2);
     * console.log(v.x); // 1
     * console.log(v.y); // 2
     * ```
     */
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}

    /**
     * Calculates the magnitude (length) of the vector
     * @returns The magnitude of the vector
     * @throws Error if vector components are undefined
     * 
     * @example
     * ```typescript
     * const v = new Vector(3, 4);
     * console.log(v.magnitude()); // 5
     * ```
     * 
     * Pre-condition: Vector components must be defined
     * Post-condition: Returns non-negative scalar value
     */
    magnitude(): number {
        if (this.x == undefined || this.y == undefined) throw new Error('Illegal argument exception: Missing one component.');
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /**
     * Adds two vectors together
     * @param other - The vector to add to this vector
     * @returns A new vector representing the sum
     * 
     * @example
     * ```typescript
     * const v1 = new Vector(1, 2);
     * const v2 = new Vector(3, 4);
     * const sum = v1.add(v2); // Vector(4, 6)
     * ```
     * 
     * Pre-condition: other vector must be defined
     * Post-condition: Returns new vector with sum of components
     */
    add(other: Vector): Vector {
        let sumX = 0;
        let sumY = 0;
        sumX = this.x + other.x;
        sumY = this.y + other.y;
        return new Vector(sumX, sumY);
    }

    /**
     * Subtracts a vector from this vector
     * @param other - The vector to subtract from this vector
     * @returns A new vector representing the difference
     * 
     * Pre-condition: other vector must be defined
     * Post-condition: Returns new vector with difference of components
     */
    subtract(other: Vector): Vector {
        let sumX = 0;
        let sumY = 0;
        sumX = this.x - other.x;
        sumY = this.y - other.y;
        return new Vector(sumX, sumY);
    }

    /**
     * Multiplies the vector by a scalar value
     * @param scalar - The scalar value to multiply by
     * @returns A new vector with components multiplied by the scalar
     * 
     * Pre-condition: scalar must be a number
     * Post-condition: Returns new vector with scaled components
     */
    multiply(scalar: number): Vector {
        let productX = 0;
        let productY = 0;
        productX = scalar * this.x;
        productY = scalar * this.y;
        return new Vector(productX, productY);
    }

    /**
     * Calculates the dot product with another vector
     * @param other - The vector to calculate dot product with
     * @returns The dot product (scalar value)
     * 
     * Pre-condition: other vector must be defined
     * Post-condition: Returns scalar value representing dot product
     */
    dot(other: Vector): number {
        let productX = 0;
        let productY = 0;
        productX = this.x * other.x;
        productY = this.y * other.y;
        return productX + productY;
    }

    /**
     * Calculates the cross product with another vector
     * Note: In 2D, this returns a scalar representing the z-component
     * @param other - The vector to calculate cross product with
     * @returns The cross product (scalar value)
     * 
     * Pre-condition: other vector must be defined
     * Post-condition: Returns scalar value representing z-component of cross product
     */
    cross(other: Vector): number {
        let product = 0;
        product = (this.x * other.y) - (this.y * other.x);
        return product;
    }

    /**
     * Rotates the vector around a point by a given angle
     * @param angle - The angle to rotate by (in radians)
     * @param center - The point to rotate around (defaults to origin)
     * @returns A new vector representing the rotated vector
     * 
     * Pre-condition: angle must be in radians
     * Post-condition: Returns new vector rotated by angle around center point
     */
    rotate(angle: number, center: Vector = new Vector(0, 0)): Vector {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Translate point to origin (relative to center)
        const translatedX = this.x - center.x;
        const translatedY = this.y - center.y;
        
        // Apply rotation matrix
        const rotatedX = translatedX * cos - translatedY * sin;
        const rotatedY = translatedX * sin + translatedY * cos;
        
        // Translate back to original position
        const finalX = rotatedX + center.x;
        const finalY = rotatedY + center.y;
        
        return new Vector(finalX, finalY);
    }

    /**     
     * Normalizes the vector (makes it unit length)
     * @returns A new vector with the same direction but unit length
     * 
     * Pre-condition: Vector must not be zero vector
     * Post-condition: Returns new vector with magnitude of 1
     */
    normalize(): Vector {
        const magnitude = this.magnitude();
        if (magnitude == 0) return new Vector(0, 0);
        const normalizedX = this.x / magnitude;
        const normalizedY = this.y / magnitude;
        return new Vector(normalizedX, normalizedY);
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Creates a string representation of the vector
     * @returns A string in the format "(x, y)"
     * 
     * Post-condition: Returns formatted string representation
     */
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}