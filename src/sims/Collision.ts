/*
The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
(C) Burak Kanber 2012
*/

interface Vector2D {
    x: number;
    y: number;
}

class Vector implements Vector2D {
    constructor(public x: number, public y: number) {}

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v: Vector): Vector {
        return new Vector(v.x + this.x, v.y + this.y);
    }

    subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    scale(s: number): Vector {
        return new Vector(this.x * s, this.y * s);
    }

    dot(v: Vector): number {
        return (this.x * v.x + this.y * v.y);
    }

    cross(v: Vector): number {
        return (this.x * v.y - this.y * v.x);
    }

    toString(): string {
        return `[${this.x},${this.y}]`;
    }

    rotate(angle: number, vector: Vector): Vector {
        const x = this.x - vector.x;
        const y = this.y - vector.y;

        const x_prime = vector.x + ((x * Math.cos(angle)) - (y * Math.sin(angle)));
        const y_prime = vector.y + ((x * Math.sin(angle)) + (y * Math.cos(angle)));

        return new Vector(x_prime, y_prime);
    }
}

class Rectangle {
    public m: number;
    public width: number;
    public height: number;
    public active: boolean;
    public topLeft: Vector;
    public topRight: Vector;
    public bottomRight: Vector;
    public bottomLeft: Vector;
    public v: Vector;
    public a: Vector;
    public theta: number;
    public omega: number;
    public alpha: number;
    public J: number;

    constructor(x: number, y: number, w: number, h: number, m: number = 1) {
        this.m = m;
        this.width = w;
        this.height = h;
        this.active = true;

        this.topLeft = new Vector(x, y);
        this.topRight = new Vector(x + w, y);
        this.bottomRight = new Vector(x + w, y + h);
        this.bottomLeft = new Vector(x, y + h);

        this.v = new Vector(0, 0);
        this.a = new Vector(0, 0);
        this.theta = 0;
        this.omega = 0;
        this.alpha = 0;
        this.J = this.m * (this.height * this.height + this.width * this.width) / 12000;
    }

    center(): Vector {
        const diagonal = this.bottomRight.subtract(this.topLeft);
        return this.topLeft.add(diagonal.scale(0.5));
    }

    rotate(angle: number): Rectangle {
        this.theta += angle;
        const center = this.center();

        this.topLeft = this.topLeft.rotate(angle, center);
        this.topRight = this.topRight.rotate(angle, center);
        this.bottomRight = this.bottomRight.rotate(angle, center);
        this.bottomLeft = this.bottomLeft.rotate(angle, center);

        return this;
    }

    move(v: Vector): Rectangle {
        this.topLeft = this.topLeft.add(v);
        this.topRight = this.topRight.add(v);
        this.bottomRight = this.bottomRight.add(v);
        this.bottomLeft = this.bottomLeft.add(v);

        return this;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'black';
        ctx.save();
        ctx.translate(this.topLeft.x, this.topLeft.y);
        ctx.rotate(this.theta);
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    vertex(id: number): Vector {
        switch (id) {
            case 0: return this.topLeft;
            case 1: return this.topRight;
            case 2: return this.bottomRight;
            case 3: return this.bottomLeft;
            default: throw new Error('Invalid vertex id');
        }
    }
}

function intersect_safe(a: Vector[], b: Vector[]): Vector[] {
    const result: Vector[] = [];
    const as = a.map(x => x.toString());
    const bs = b.map(x => x.toString());

    for (const i in as) {
        if (bs.indexOf(as[i]) !== -1) {
            result.push(a[i]);
        }
    }

    return result;
}

function satTest(a: Rectangle, b: Rectangle): Vector | false {
    const testVectors = [
        a.topRight.subtract(a.topLeft),
        a.bottomRight.subtract(a.topRight),
        b.topRight.subtract(b.topLeft),
        b.bottomRight.subtract(b.topRight),
    ];
    const ainvolvedVertices: Vector[][] = Array(4).fill([]).map(() => []);
    const binvolvedVertices: Vector[][] = Array(4).fill([]).map(() => []);

    for (let i = 0; i < 4; i++) {
        const myProjections: number[] = [];
        const foreignProjections: number[] = [];

        for (let j = 0; j < 4; j++) {
            myProjections.push(testVectors[i].dot(a.vertex(j)));
            foreignProjections.push(testVectors[i].dot(b.vertex(j)));
        }

        for (let j = 0; j < foreignProjections.length; j++) {
            if (foreignProjections[j] > Math.min(...myProjections) && 
                foreignProjections[j] < Math.max(...myProjections)) {
                binvolvedVertices[i].push(b.vertex(j));
            }
        }

        for (let j = 0; j < myProjections.length; j++) {
            if (myProjections[j] > Math.min(...foreignProjections) && 
                myProjections[j] < Math.max(...foreignProjections)) {
                ainvolvedVertices[i].push(a.vertex(j));
            }
        }
    }

    const finalA = intersect_safe(
        intersect_safe(ainvolvedVertices[0], ainvolvedVertices[1]),
        intersect_safe(ainvolvedVertices[2], ainvolvedVertices[3])
    );
    const finalB = intersect_safe(
        intersect_safe(binvolvedVertices[0], binvolvedVertices[1]),
        intersect_safe(binvolvedVertices[2], binvolvedVertices[3])
    );

    if (finalA.length === 1 && finalB.length === 2) {
        return finalA[0];
    } else if (finalB.length === 1 && finalA.length === 2) {
        return finalB[0];
    } else if (finalA.length === 1 && finalB.length === 1) {
        return finalA[0];
    } else if (finalA.length === 1 && finalB.length === 0) {
        return finalA[0];
    } else if (finalA.length === 0 && finalB.length === 1) {
        return finalB[0];
    } else if (finalA.length === 0 && finalB.length === 0) {
        return false;
    } else {
        console.log("Unknown collision profile");
        console.log(finalA);
        console.log(finalB);
        clearInterval(timer);
        return false;
}

// Canvas setup
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const height = 400;
const width = 400;
const b = -1;
const angularB = -1;
const dt = 0.02;

// Initialize rectangle and spring
const rect = new Rectangle(200, 0, 100, 50);
const wall = new Rectangle(125, 200, 100, 50);
rect.omega = -10;

function loop(): void {
    let f = new Vector(0, 0);
    let torque = 0;

    // Start Velocity Verlet by performing the translation
    const dr = rect.v.scale(dt).add(rect.a.scale(0.5 * dt * dt));
    rect.move(dr.scale(100));

    // Add Gravity
    f = f.add(new Vector(0, rect.m * 9.81));

    // Add damping
    f = f.add(rect.v.scale(b));

    // Handle collision
    const collision = satTest(rect, wall);
    if (collision) {
        let N = rect.center().subtract(collision);
        N = N.scale(1 / N.length());
        const Vr = rect.v;
        const I = N.scale(-1 * (1 + 0.3) * Vr.dot(N));
        rect.v = I;
        rect.omega = -1 * 0.2 * (rect.omega / Math.abs(rect.omega)) * rect.center().subtract(collision).cross(Vr);
    }

    // Finish Velocity Verlet
    const new_a = f.scale(rect.m);
    const dv = rect.a.add(new_a).scale(0.5 * dt);
    rect.v = rect.v.add(dv);

    // Do rotation using Euler
    torque += rect.omega * angularB; // Angular damping
    rect.alpha = torque / rect.J;
    rect.omega += rect.alpha * dt;
    const deltaTheta = rect.omega * dt;
    rect.rotate(deltaTheta);

    draw();
}

function draw(): void {
    ctx.clearRect(0, 0, width, height);
    rect.draw(ctx);
    wall.draw(ctx);
}

const timer = setInterval(loop, dt * 1000);

/**
Our final checkpoint exhibits a rotating box falling and colliding with a fixed box. While the demonstration of the separating axis theorem is complete, the collision response leaves a bit to be desired from more sophisticated techniques.

This implementation of the separating axis theorem test is certainly not definitive, however, and you should craft your own to fit your use-case. This example does not quit early if there’s a test axis with no overlap; quitting early is a great performance optimization. Additionally, this example uses some heuristics to extract the rectangle vertex “most involved with” the collision.

More sophisticated implementations would include rewinding the collision to the moment of impact, and also returning the contact point and normal. Additionally, the collision response here is primitive and not physically accurate; it’s just there to demonstrate that the separating axis theorem works.

*/