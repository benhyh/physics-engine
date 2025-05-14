import { SpringForce } from '../SpringForce';
import { Vector } from '../../../Vector';
import { RigidBody } from '../../../RigidBody';

describe('SpringForce', () => {
    let springForce: SpringForce;
    let firstBody: RigidBody;
    let secondBody: RigidBody;

    beforeEach(() => {
        // Reset test objects before each test
        firstBody = new RigidBody(1.0, new Vector(0, 0));
        secondBody = new RigidBody(1.0, new Vector(10, 0));
        springForce = new SpringForce(
            5.0,  // rest length
            2.0,  // spring constant
            firstBody,
            new Vector(0, 0),  // first attachment point
            secondBody,
            new Vector(0, 0)   // second attachment point
        );
    });

    test('should initialize with correct default values', () => {
        const defaultSpring = new SpringForce();
        expect(defaultSpring.getRestLength()).toBe(0);
        expect(defaultSpring.getSpringConstant()).toBe(1);
    });

    test('should calculate correct spring force for compression', () => {
        // Set up spring compressed to half its rest length
        const compressedSpring = new SpringForce(
            10.0,  // rest length
            2.0,   // spring constant
            firstBody,
            new Vector(0, 0),
            secondBody,
            new Vector(5, 0)   // compressed to 5 units
        );

        compressedSpring.apply(firstBody);
        
        // Force should be positive (pushing bodies apart)
        // F = -k(x - x₀) = -2(5 - 10) = 10N
        expect(firstBody.forceAccumulator.x).toBeCloseTo(10);
    });

    test('should calculate correct spring force for extension', () => {
        // Set up spring extended to twice its rest length
        const extendedSpring = new SpringForce(
            5.0,   // rest length
            2.0,   // spring constant
            firstBody,
            new Vector(0, 0),
            secondBody,
            new Vector(10, 0)  // extended to 10 units
        );

        extendedSpring.apply(firstBody);
        
        // Force should be negative (pulling bodies together)
        // F = -k(x - x₀) = -2(10 - 5) = -10N
        expect(firstBody.forceAccumulator.x).toBeCloseTo(-10);
    });

    test('should apply equal and opposite forces to connected bodies', () => {
        springForce.apply(firstBody);
        springForce.apply(secondBody);

        // Forces should be equal in magnitude but opposite in direction
        expect(firstBody.forceAccumulator.x).toBeCloseTo(-secondBody.forceAccumulator.x);
        expect(firstBody.forceAccumulator.y).toBeCloseTo(-secondBody.forceAccumulator.y);
    });

    test('should generate correct torque for off-center attachments', () => {
        const offsetSpring = new SpringForce(
            5.0,   // rest length
            2.0,   // spring constant
            firstBody,
            new Vector(0, 1),  // offset attachment point
            secondBody,
            new Vector(0, -1)  // offset attachment point
        );

        offsetSpring.apply(firstBody);
        
        // Should have both force and torque
        expect(firstBody.forceAccumulator.magnitude()).toBeGreaterThan(0);
        expect(firstBody.torqueAccumulator).not.toBe(0);
    });

    test('should handle single body with fixed point correctly', () => {
        const fixedPointSpring = new SpringForce(
            5.0,   // rest length
            2.0,   // spring constant
            firstBody,
            new Vector(0, 0)
        );

        fixedPointSpring.apply(firstBody);
        
        // Should still apply forces correctly
        expect(firstBody.forceAccumulator.magnitude()).toBeGreaterThan(0);
    });

    test('should update spring constant correctly', () => {
        springForce.setSpringConstant(4.0);
        expect(springForce.getSpringConstant()).toBe(4.0);
        
        // Force should scale with spring constant
        springForce.apply(firstBody);
        const force1 = firstBody.forceAccumulator.magnitude();
        
        firstBody.clearAccumulators();
        springForce.setSpringConstant(8.0);
        springForce.apply(firstBody);
        const force2 = firstBody.forceAccumulator.magnitude();
        
        // Force should double when spring constant doubles
        expect(force2).toBeCloseTo(2 * force1);
    });
}); 