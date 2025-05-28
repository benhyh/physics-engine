/**
 * Core event emitter implementing the Observer pattern
 * 
 * This class provides the foundation for event-driven communication
 * between different components of the physics simulation.
 * 
 * @category Events
 */

import { SimulationEvent, EventListener } from './EventTypes';

export class EventEmitter {
    private listeners: Map<string, EventListener[]> = new Map();
    private oneTimeListeners: Map<string, EventListener[]> = new Map();
    private debugMode: boolean = false;

    /**
     * Enable or disable debug mode for event logging
     */
    setDebugMode(enabled: boolean): void {
        this.debugMode = enabled;
        if (enabled) {
            console.log('EventEmitter: Debug mode enabled');
        }
    }

    /**
     * Add an event listener for a specific event type
     * @param eventType - The type of event to listen for
     * @param listener - The callback function to execute
     */
    on<T extends SimulationEvent>(
        eventType: T['type'], 
        listener: EventListener<T>
    ): void {
        const existingEvent = this.listeners.get(eventType);

        if (existingEvent) {
            existingEvent.push(listener as EventListener);
        } else {
            this.listeners.set(eventType, [listener as EventListener]);
        }

        if (this.debugMode) {
            console.log(`EventEmitter: Registered listener for '${eventType}'`);
        }
    }

    /**
     * Emit an event to all registered listeners
     * @param event - The event object to emit
     */
    emit<T extends SimulationEvent>(event: T): void {
        const listenersForThisEvent = this.listeners.get(event.type);

        if (!listenersForThisEvent) {
            return;
        }

        for (const listener of listenersForThisEvent) {
            listener(event);
        }
    }

    /**
     * Remove a specific event listener
     * @param eventType - The type of event to stop listening for
     * @param listener - The specific listener function to remove
     */
    off<T extends SimulationEvent>(
        eventType: T['type'], 
        listener: EventListener<T>
    ): void {
        const existingEvent = this.listeners.get(eventType);

        if (existingEvent) {
            const index = existingEvent.indexOf(listener as EventListener);
            if (index !== -1) { 
                existingEvent.splice(index, 1);  
            }
        }
    }

    /**
     * Get the number of listeners for a specific event type
     */
    listenerCount(eventType: string): number {
        const regularCount = this.listeners.get(eventType)?.length || 0;
        const oneTimeCount = this.oneTimeListeners.get(eventType)?.length || 0;
        return regularCount + oneTimeCount;
    }
} 