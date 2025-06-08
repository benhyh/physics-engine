import { RigidBody } from "@/classes/RigidBody";
import { DEFAULT_STYLES, Renderer, RenderOptions } from "./Renderer";
import { Vector } from "@/classes/Vector";
import { EventEmitter } from "../events/EventEmitter";
import { RenderContext } from "./RenderContext";
import { ShapeType } from "@/classes/shapes/base/Shape";
import { CircleShape } from "@/classes/shapes/convex/CircleShape";
import { PolygonShape } from "@/classes/shapes/convex/PolygonShape";
import { RectangleShape } from "@/classes/shapes/convex/RectangleShape";
import { AABBShape } from "@/classes/shapes/convex/AABBShape";
import { TrapezoidShape } from "@/classes/shapes/convex/TrapezoidShape";

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

    /**
     * Clears the canvas and sets the background color to white
     * 
     * Pre-condition: Canvas is initialized
     * Post-condition: Canvas is cleared and background color is set to white
     */
    protected clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Renders a single rigid body based on its shape type
     * 
     * Pre-condition: Body is initialized
     * Post-condition: Body is rendered to the canvas
     */
    protected renderBody(body: RigidBody): void {
        const shape = body.shape;
        const position = body.position;
        const rotation = body.rotation;

        switch (shape.type) {
            case ShapeType.CIRCLE:
                const circleShape = shape as unknown as CircleShape;
                this.drawCircle(position, circleShape.getRadius());
                break;
                
            case ShapeType.POLYGON:
                const polygonShape = shape as unknown as PolygonShape;
                this.drawPolygon(polygonShape.getVertices());
                break;
                
            case ShapeType.RECTANGLE:
                const rectShape = shape as unknown as RectangleShape;
                this.drawRectangle(position, rectShape.getWidth(), rectShape.getHeight(), rotation);
                break;
                
            case ShapeType.AABB:
                const aabbShape = shape as unknown as AABBShape;
                this.drawPolygon(aabbShape.getVertices());
                break;
                
            case ShapeType.TRAPEZOID:
                const trapShape = shape as unknown as TrapezoidShape;
                this.drawPolygon(trapShape.getVertices());
                break;
                
            default:
                console.warn(`Unsupported shape type for rendering: ${shape.type}`);
        }
    }

    /**
     * Draws a circle on the canvas
     * 
     * @param center - The center of the circle
     * @param radius - The radius of the circle
     * @param options - The render options
     * 
     * Pre-condition: Center and radius are initialized
     * Post-condition: Circle is rendered to the canvas
     */
    public drawCircle(center: Vector, radius: number, options?: RenderOptions): void {
        const screenCoordinates = this.renderContext.worldToScreen(center);
        const convertedRadius = radius * this.renderContext.getPixelsPerUnit();

        // render options
        this.context.strokeStyle = options?.strokeColor || DEFAULT_STYLES.BODY.strokeColor;
        this.context.fillStyle = options?.fillColor || DEFAULT_STYLES.BODY.fillColor;
        this.context.lineWidth = options?.lineWidth || DEFAULT_STYLES.BODY.lineWidth;
        this.context.globalAlpha = options?.alpha || DEFAULT_STYLES.BODY.alpha;      

        this.context.save();

        // rendering
        this.context.beginPath();
        this.context.arc(screenCoordinates.x, screenCoordinates.y, convertedRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
        this.context.restore();
    }
    
    /**
     * Draws a rectangle on the canvas
     * 
     * @param center - The center of the rectangle
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @param rotation - The rotation of the rectangle
     * @param options - The render options
     * 
     * Pre-condition: Center, width, height, and rotation are initialized
     * Post-condition: Rectangle is rendered to the canvas
     */
    public drawRectangle(center: Vector, width: number, height: number, rotation: number, options?: RenderOptions): void {

        const screenCoordinates = this.renderContext.worldToScreen(center);
        const convertedWidth = width * this.renderContext.getPixelsPerUnit();
        const convertedHeight = height * this.renderContext.getPixelsPerUnit();

        // render options
        this.context.strokeStyle = options?.strokeColor || DEFAULT_STYLES.BODY.strokeColor;
        this.context.fillStyle = options?.fillColor || DEFAULT_STYLES.BODY.fillColor;
        this.context.lineWidth = options?.lineWidth || DEFAULT_STYLES.BODY.lineWidth;
        this.context.globalAlpha = options?.alpha || DEFAULT_STYLES.BODY.alpha;

        this.context.save();

        // rendering
        this.context.beginPath();
        this.context.translate(screenCoordinates.x, screenCoordinates.y);
        this.context.rotate(rotation);
        this.context.rect(-convertedWidth / 2, -convertedHeight / 2, convertedWidth, convertedHeight);
        this.context.fill();
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Draws a polygon on the canvas
     * 
     * @param vertices - The vertices of the polygon
     * @param options - The render options
     * 
     * Pre-condition: Vertices are initialized
     * Post-condition: Polygon is rendered to the canvas
     */
    public drawPolygon(vertices: Vector[], options?: RenderOptions): void {
        const screenCoordinates = vertices.map(vertex => this.renderContext.worldToScreen(vertex));

        this.context.strokeStyle = options?.strokeColor || DEFAULT_STYLES.BODY.strokeColor;     
        this.context.fillStyle = options?.fillColor || DEFAULT_STYLES.BODY.fillColor;
        this.context.lineWidth = options?.lineWidth || DEFAULT_STYLES.BODY.lineWidth;
        this.context.globalAlpha = options?.alpha || DEFAULT_STYLES.BODY.alpha;

        this.context.save();

        this.context.beginPath();
        this.context.moveTo(screenCoordinates[0].x, screenCoordinates[0].y);
        for (let i = 1; i < screenCoordinates.length; i++) {
            this.context.lineTo(screenCoordinates[i].x, screenCoordinates[i].y);
        }
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Draws a line on the canvas
     * 
     * @param start - The start point of the line
     * @param end - The end point of the line
     * @param options - The render options
     * 
     * Pre-condition: Start and end points are initialized
     */
    public drawLine(start: Vector, end: Vector, options?: RenderOptions): void {
        const screenStart = this.renderContext.worldToScreen(start);
        const screenEnd = this.renderContext.worldToScreen(end);

        this.context.strokeStyle = options?.strokeColor || DEFAULT_STYLES.BODY.strokeColor;
        this.context.lineWidth = options?.lineWidth || DEFAULT_STYLES.BODY.lineWidth;
        this.context.globalAlpha = options?.alpha || DEFAULT_STYLES.BODY.alpha;

        this.context.save();

        // handle dashed lines if requested
        if (options?.dashed) {
            this.context.setLineDash(options.dashPattern || [5, 5]);
        }

        this.context.beginPath();
        this.context.moveTo(screenStart.x, screenStart.y);
        this.context.lineTo(screenEnd.x, screenEnd.y);
        this.context.stroke();
        
        this.context.restore();
    }

    /**
     * Draws text on the canvas
     * 
     * @param text - The text to draw
     * @param position - The position of the text
     * @param options - The render options
     * 
     * Pre-condition: Text, position, and options are initialized
     * Post-condition: Text is rendered to the canvas
     */
    public drawText(text: string, position: Vector, options?: RenderOptions & { fontSize?: number; fontFamily?: string; }): void {
        const screenPosition = this.renderContext.worldToScreen(position);

        // SET font with defaults for undefined values
        const fontSize = options?.fontSize || 16;
        const fontFamily = options?.fontFamily || 'Arial';
        this.context.font = `${fontSize}px ${fontFamily}`;
        
        this.context.fillStyle = options?.fillColor || DEFAULT_STYLES.BODY.fillColor;
        this.context.globalAlpha = options?.alpha || DEFAULT_STYLES.BODY.alpha;

        this.context.save();    

        this.context.fillText(text, screenPosition.x, screenPosition.y);
        
        // optional text stroke
        if (options?.strokeColor) {
            this.context.strokeStyle = options.strokeColor;
            this.context.strokeText(text, screenPosition.x, screenPosition.y);
        }
        
        this.context.restore();
    }

}