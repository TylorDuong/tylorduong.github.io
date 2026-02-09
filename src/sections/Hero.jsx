import { Button } from "@/components/Button";
import {ArrowRight} from "lucide-react";

export const Hero = () =>{
    return <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
            <img 
            src="/hero-bg.jpg" 
            alt="Hero image" 
            className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background">
            </div>
        </div>
        {/* Green Donts Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-60"
                style={{
                    backgroundColor: "var(--color-ambience)",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `slow-drift ${15 + Math.random() * 20}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s`
                }}
                />
            ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                    <div className="animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse "/>
                                Studying Computer Science at Arizona State University                        
                            </span>
                    </div>
                {/* Headline*/}
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                        Full-Stack <span className="text-primary glow-text">Developer</span>
                        <br />
                        focused on
                        <br />
                        <span className="font-serif italic font-normal text-white">performance and design</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                        Hi, I'm Tylor Duong -- a passionate full-stack developer with a knack for crafting high-performance web applications. 
                        With a strong foundation in both front-end and back-end technologies, I specialize in creating seamless user experiences while optimizing for speed and efficiency. 
                        Whether it's building responsive interfaces or designing robust server-side solutions, I thrive on delivering code that not only works but excels in performance. 
                        Let's connect and build something amazing together!
                    </p>
                </div>

                {/* Call to Action CTAs*/}
                <div>
                    <Button size="lg">Contact Me <ArrowRight className="w-5 h-5" /></Button>
                    <button>
                        
                    </button>
                </div>
                </div>
                {/* Right Column - Profile */}
            </div>
        </div>
    </section>;
};