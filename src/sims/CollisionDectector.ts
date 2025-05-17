/**
 * COLLISOIN DETECTION
 * 1/ Split the world up into sections via a grid or a quadtree
 * 2/ If two objects are in the same section of the gid, use a very simple collision routine to see if we should investigate further.
 * We typically use AABB testing for this.
 * 3/ If you think objects are colliding, use a more thorough algorithm to get the final confirmation.
 * 4/ If they are colliding, extract information about the collision and figure how to make the objects react.
 * 
 * 
 * 1. Start w/ direct collision detection. Skip spatial partitioning initially and implement basic shape-to-shape collision detection (circle-circle, AABB-AABB). 
 * This builds foundational understanding without optimization complexity. 
 * 
 * 2. Add collision response - Once detection works, implement basic collision response. This creates a functional system before optimization.
 * 
 * 3. Introduce broad-phase - Only after basic collisions work, implement AABB tests as a broad-phase filter.
 * 
 * 4. Add spatial partioning - Add quadtrees or grids when you need to handle manhy objects.    
 */


export class CollisionDectector {

}
