import { Button } from "@/components/Button";
import { ArrowRight, Download, ChevronDown } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import skills from "@/data/skills";
import socialLinks from "@/data/socialLinks";
import hero from "@/data/hero";

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
                                {hero.badge}                        
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
                        {hero.summary}
                    </p>
                </div>

                {/* Call to Action CTAs*/}
                <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
                    <Button size="lg" href="#contact">Contact Me <ArrowRight className="w-5 h-5" /></Button>
                    <AnimatedBorderButton href="https://drive.google.com/file/d/1mPAFaC18GQo6RkEi8rYPYC5cGysHmfSd/view?usp=sharing" target="_blank">
                        <Download className="w-5 h-5" />
                        Download CV
                    </AnimatedBorderButton>
                </div>
                {/* Social Links */}
                <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
                    <span className="text-sm text-muted-foreground">
                        Connect with me: 
                    </span>
                    {socialLinks.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                                                    className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </div>
                {/* Right Column - Profile */}
                <div className="relative animate-fade-in animation-delay-300">
                    {/* Profile Image */}
                    <div className="relative max-w-md mx-auto">
                        <div
                        className="absolute inset-0 
                        rounded-3xl bg-gradient-to-br 
                        from-primary/30 via-transparent 
                        to-primary/10 blur-2xl animate-pulse"
                        />
                        <div className="relative glass rounded-3xl p-2 glow-border">
                            <img 
                            src="/profile-photo.png" 
                            alt="Tylor Duong" 
                            className="w-full aspect-[4/5] object-cover rounded-2xl"/>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                                <span className="text-sm font-medium">Available for work</span>
                            </div>
                        </div>
                        {/* Stats Badge */}
                        <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                            <div className="text-2xl font-bold text-primary">{hero.stats.value}</div>
                            <div className="text-xs text-muted-foreground">{hero.stats.label}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Skills Section */}
            <div className="mt-20 animate-fade-in animation-delay-600">
                <p className="text-sm text-muted-foreground mb-6 text-center">Technologies I work with</p>
                <div className="relative overflow-hidden">
                    <div className="flex animate-marquee">
                        {[...skills, ...skills].map((skill, idx) => (
                            <div key={idx} className="flex-shrink-0 px-8 py-4">
                                <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 
      animate-fade-in animation-delay-800"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>

    </section>;
};