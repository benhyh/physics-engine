interface PhysicsParams {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  x: number;
  y: number;
  vy: number;
  ay: number;
  m: number;
  r: number;
  dt: number;
  e: number;
  rho: number;
  C_d: number;
  A: number;
}

export class GravitySimulation {
  private params: PhysicsParams;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    this.params = {
      canvas,
      ctx,
      height: 400,
      width: 400,
      x: 200,
      y: 0,
      vy: 0,
      ay: 0,
      m: 0.1,    // Ball mass in kg
      r: 10,     // Ball radius in cm, or pixels
      dt: 0.02,  // Time step
      e: -0.5,   // Coefficient of restitution ("bounciness")
      rho: 1.2,  // Density of air. Try 1000 for water
      C_d: 0.47, // Coefficient of drag for a ball
      A: Math.PI * 10 * 10 / 10000 // Frontal area of the ball
    };

    ctx.fillStyle = 'red';
  }

  private loop = () => {
    let fy = 0;
    
    // Weight force
    fy += this.params.m * 9.81;
    
    // Air resistance force
    fy += -1 * 0.5 * this.params.rho * this.params.C_d * this.params.A * this.params.vy * this.params.vy;
    
    // Verlet integration for the y-direction
    const dy = this.params.vy * this.params.dt + (0.5 * this.params.ay * this.params.dt * this.params.dt);
    this.params.y += dy * 100;
    const new_ay = fy / this.params.m;
    const avg_ay = 0.5 * (new_ay + this.params.ay);
    this.params.vy += avg_ay * this.params.dt;
    
    // Collision detection
    if (this.params.y + this.params.r > this.params.height && this.params.vy > 0) {
      this.params.vy *= this.params.e;
      this.params.y = this.params.height - this.params.r;
    }
    
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private draw = () => {
    const { ctx, width, height, x, y, r } = this.params;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  }

  public start = () => {
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop = () => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
} 