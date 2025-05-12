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

    rotate(angle: number, vector: Vector): Vector {
        const x = this.x - vector.x;
        const y = this.y - vector.y;

        const x_prime = vector.x + ((x * Math.cos(angle)) - (y * Math.sin(angle)));
        const y_prime = vector.y + ((x * Math.sin(angle)) + (y * Math.cos(angle)));

        return new Vector(x_prime, y_prime);
    }
}

export class Rectangle {
    public m: number;
    public width: number;
    public height: number;
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
}

// Canvas setup
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const height = 400;
const width = 400;
const stiffness = 0.5;
const b = -1;
const angularB = -7;
const dt = 0.02;

// Initialize rectangle and spring
const rect = new Rectangle(200, 0, 100, 50);
rect.v = new Vector(0, 2);
const spring = new Vector(200, 0);

ctx.strokeStyle = 'black';

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
    
    // Add Spring
    const springForce = rect.topLeft.subtract(spring).scale(-1 * stiffness);
    const r = rect.center().subtract(rect.topLeft);
    const rxf = r.cross(springForce);

    torque += -1 * rxf;
    f = f.add(springForce);

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
    ctx.strokeStyle = 'black';
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(rect.topLeft.x, rect.topLeft.y);
    ctx.rotate(rect.theta);
    ctx.strokeRect(0, 0, rect.width, rect.height);
    ctx.restore();
    
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(spring.x, spring.y);
    ctx.lineTo(rect.topLeft.x, rect.topLeft.y);
    ctx.stroke();
    ctx.closePath();
}

setInterval(loop, dt * 1000); 