import { useEffect, useRef } from 'react'
import './App.css'
import { GravitySimulation } from './sims/Gravity.ts'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const simulation = new GravitySimulation(canvasRef.current);
    simulation.start();

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="app-container">
      <canvas 
        ref={canvasRef}
        height={400} 
        width={400}
      />
    </div>
  )
}

export default App
