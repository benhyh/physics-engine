import { RigidBody } from "@/classes/RigidBody";
import { Renderer, RenderOptions } from "./Renderer";
import { Vector } from "@/classes/Vector";
import { EventEmitter } from "../events/EventEmitter";
import { RenderContext } from "./RenderContext";

export class CanvasRenderer extends Renderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(
        eventEmitter: EventEmitter,
        renderContext: RenderContext,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D
    ) {
        super(eventEmitter, renderContext);
        this.canvas = canvas;
        this.context = context;
    }

    protected clear(): void {
        
    }

    protected renderBody(body: RigidBody): void {
        
    }

    public drawCircle(center: Vector, radius: number, options?: RenderOptions): void {
        
    }

    public drawRectangle(center: Vector, width: number, height: number, rotation: number, options?: RenderOptions): void {
        
    }

    public drawLine(start: Vector, end: Vector, options?: RenderOptions): void {
        
    }
    
    public drawText(text: string, position: Vector, options?: RenderOptions & { fontSize?: number; fontFamily?: string; }): void {
        
    }



}