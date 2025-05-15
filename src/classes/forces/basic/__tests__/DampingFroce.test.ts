import { RigidBody } from "../../../RigidBody";
import { DampingForce } from "../DampingForce"
import { Vector } from "../../../Vector";

describe('DampingForce', () => {
    let dampingForce: DampingForce;
    let body: RigidBody;
    
    beforeEach(() => {
        body = new RigidBody(2.0);
        dampingForce = new DampingForce(2.0); 
    });

    test('should create damping force with correct coefficient', () => {
        expect(dampingForce.getDampingCoefficient()).toBe(2.0);
    });

    test('should update damping coefficient', () => {
        dampingForce.setDampingCoefficient(3.0);
        expect(dampingForce.getDampingCoefficient()).toBe(3.0);
    });

    test('should apply zero force when velocity is zero', () => {
        body.velocity = new Vector(0, 0);
        dampingForce.apply(body);
        expect(body.forceAccumulator.x).toBe(0);
        expect(body.forceAccumulator.y).toBe(0);
    });

    test('should apply opposite force to velocity direction', () => {
        body.velocity = new Vector(1, 1);
        dampingForce.apply(body);
        expect(body.forceAccumulator.x).toBeLessThan(0);
        expect(body.forceAccumulator.y).toBeLessThan(0);
    });

    test('should scale force with damping coefficient', () => {
        body.velocity = new Vector(1, 0);
        dampingForce.apply(body);
        const force1 = body.forceAccumulator.x;
        
        body.clearAccumulators();
        dampingForce.setDampingCoefficient(4.0);
        dampingForce.apply(body);
        const force2 = body.forceAccumulator.x;
        
        expect(Math.abs(force2)).toBe(Math.abs(force1) * 2);
    });
});