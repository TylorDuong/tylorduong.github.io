import { Code2, Rocket, Users, Lightbulb } from "lucide-react";

const highlights = [
    {
        icon: Code2,
        title: "Clean Code",
        description: "I write clean and maintainable code that follows best practices and industry standards.",
    },
    {
        icon: Rocket,
        title: "Performance",
        description: "I optimize applications to ensure fast load times and smooth interactions.",
    },
    {
        icon: Users,
        title: "Collaboration",
        description: "I am a team player and enjoy collaborating with other developers, designers, and stakeholders to create high-quality software.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "I am always looking for new and innovative ways to solve problems and improve the user experience.",
    },
]

export const About = () =>{
    return <section id="about" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Column */}
                <div className="space-y-8">
                    <div className="animate-fade-in">
                        <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                            About Me
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
                        Building the future,
                        <span className="font-serif italic font-normal text-white"> one component at a time.</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
                        <p>
                            I am a passionate full-stack developer with a knack for crafting high-performance web applications. With a strong foundation in both front-end and back-end technologies, I thrive on creating seamless user experiences and efficient codebases. I am always eager to learn new technologies and stay up-to-date with industry trends to ensure that my projects are not only functional but also innovative and future-proof.
                        </p>
                        <p>
                            My journey in software development has been driven by a desire to solve complex problems and create impactful solutions. I believe that great software is built on a foundation of clean code, thoughtful design, and a deep understanding of user needs. Whether I'm working on a small feature or a large application, I approach every project with the same level of dedication and attention to detail.
                        </p>
                        <p>
                            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or collaborating with other developers to share knowledge and ideas. I am excited about the future of technology and am committed to being a part of shaping it through my work as a developer.
                        </p>
                    </div>
                    <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                        <p className="text-lg font-medium italic text-foreground">
                            "My mission is to create high-quality software that not only meets the needs of users but also pushes the boundaries of what's possible. I am dedicated to continuous learning and growth, and I am always looking for new opportunities to challenge myself and make a positive impact through technology."
                        </p>
                    </div>
                </div>
                {/* Right Column Highlights */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {highlights.map((item, idx) => (
                        <div 
                        key={idx} 
                        style={{animationDelay: `${(idx + 1) * 100}ms`}}
                        className="glass p-6 rounded-2xl group animate-fade-in ">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                                <item.icon className="w-6 h-6 text-primary"/>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </section>;
};