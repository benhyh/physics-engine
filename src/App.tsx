import { ArrowRight, Github } from "lucide-react"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./components/ui/carousel"

function App() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Title Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">2D engine for the web</h1>
        <div className="flex items-center justify-center gap-3 text-lg">
          <a
            href="https://github.com/liabru/matter-js"
            className="flex items-center hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="mr-1 h-5 w-5" />
            github
          </a>
          <span className="text-gray-400">•</span>
          <a href="/docs" className="hover:underline">
            docs
          </a>
          <span className="text-gray-400">•</span>
          <a href="/demo" className="flex items-center hover:underline">
            see demo <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Simulation Carousel */}
      <section className="mb-16">
        <div className="border rounded-xl p-6 max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="bg-sky-200 rounded-lg p-8 aspect-video flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl font-bold mb-4">Simulation {index + 1}</h3>
                    <p className="text-lg max-w-md">
                      {index === 0 && "Rigid body physics with precise collision detection"}
                      {index === 1 && "Constraints, joints and composite bodies"}
                      {index === 2 && "Gravity, friction and custom force applications"}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Rigid Bodies with multiple shapes",
            "Compound Bodies and constraints",
            "Realistic physics simulation",
            "Collision detection and response",
            "Springs and constraints",
            "Gravity and custom forces",
            "Friction and restitution",
            "Events and callbacks",
            "Lightweight and optimized",
          ].map((feature, index) => (
            <div key={index} className="flex items-start">
              <span className="mr-2 text-lg">•</span>
              <span className="text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <Button size="lg" asChild>
          <a href="/demo">
            Try the demo <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>
    </main>
  )
}

export default App
