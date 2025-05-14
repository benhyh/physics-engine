import { GravityForce } from '../GravityForce';
import { Vector } from '../../../Vector';
import { RigidBody } from '../../../RigidBody';

describe('GravityForce', () => {
    let gravityForce: GravityForce;
    let body: RigidBody;

    beforeEach(() => {
        // Reset test objects before each test
        body = new RigidBody(2.0); // 2kg mass
        gravityForce = new GravityForce(2.0, new Vector(0, 9.81)); // Standard gravity
    });

    test('should initialize with correct default values', () => {
        const defaultForce = new GravityForce();
        expect(defaultForce.getGravityConstant().y).toBeCloseTo(9.81);
        expect(defaultForce.getMagnitude()).toBeCloseTo(9.81); // For 1kg mass
    });

    test('should throw error for invalid mass', () => {
        expect(() => new GravityForce(-1)).toThrow('Mass must be positive');
        expect(() => new GravityForce(0)).toThrow('Mass must be positive');
    });

    test('should throw error for invalid gravity constant', () => {
        expect(() => new GravityForce(1, new Vector(0, 0))).toThrow('Invalid gravity constant vector');
    });

    test('should correctly calculate force magnitude', () => {
        const expectedMagnitude = 2.0 * 9.81; // F = mg
        expect(gravityForce.getMagnitude()).toBeCloseTo(expectedMagnitude);
    });

    test('should apply correct force to rigid body', () => {
        const initialForce = body.forceAccumulator;
        gravityForce.apply(body);
        const appliedForce = body.forceAccumulator;
        
        // Check force magnitude
        expect(appliedForce.y).toBeCloseTo(2.0 * 9.81);
        
        // Check force direction
        expect(appliedForce.x).toBe(0);
        expect(appliedForce.y).toBeGreaterThan(0);
    });

    test('should update gravity constant correctly', () => {
        const newGravity = new Vector(0, 5.0);
        gravityForce.setGravityConstant(newGravity);
        
        expect(gravityForce.getGravityConstant().y).toBe(5.0);
        expect(gravityForce.getMagnitude()).toBeCloseTo(10.0); // 2kg * 5.0 m/s²
    });

    test('should maintain consistent force over multiple applications', () => {
        const expectedForce = new Vector(0, 2.0 * 9.81);
        
        // Apply force multiple times
        for(let i = 0; i < 3; i++) {
            body.clearAccumulators();
            gravityForce.apply(body);
            expect(body.forceAccumulator.y).toBeCloseTo(expectedForce.y);
        }
    });
}); 