// Content lifted from TylorDuong/tylorduong.github.io + 2026 resume additions.
// Image paths point at /public (served from the site root by Vite).
export const projects = [
  {
    id: "YB-01",
    kind: "personal",
    accent: "#16b364",
    title: "Yber",
    category: "AI / EDTECH",
    year: "2026",
    description:
      "Gamified, neuroinclusive education platform empowering the next generation to develop and practice social skills and build real projects for the future job market. Scaled and deployed through a partnership with Chandler Unified School District (40,000+ students), powered by a multi-layer agentic architecture that autonomously grades student submissions, delivers precise feedback, creates lessons, and announces student milestones on social media.",
    summary: "Gamified neuroinclusive learning for 40,000+ students.",
    image: "/projects/yber.png",
    tags: ["React", "Node.js", "Supabase", "GCP", "Gemini Agents", "n8n", "OpenRouter", "Vercel"],
    link: "https://yber.ai",
    github: "https://github.com/TylorDuong",
    featured: true,
  },
  {
    id: "SS-02",
    kind: "personal",
    accent: "#22c55e",
    title: "ShelfSmart",
    category: "IOT / AI",
    year: "2026",
    description:
      "Lightweight, AI-powered hardware + software ecosystem for automated restaurant inventory tracking. Real-time predictive forecasting models designed to cut food waste by an estimated 40% and combat $3B in annual industry losses—reducing manual labor, eliminating human ordering errors, and protecting venue profit margins.",
    summary: "AI inventory hardware that cuts restaurant food waste.",
    image: "/projects/shelfsmart.png",
    tags: ["React", "Next.js", "Node.js", "Python", "OpenCV", "IoT Sensors", "Supabase", "Vercel"],
    link: "https://github.com/TylorDuong",
    github: "https://github.com/TylorDuong",
    featured: true,
  },
  {
    id: "WP-03",
    kind: "enterprise",
    accent: "#2563eb",
    title: "Enterprise Wi-Fi Portal",
    category: "DATA / DASHBOARD",
    year: "2026",
    description:
      "1st Place, Process Improvement (Yazaki). A Wi-Fi reporting portal and real-time data-visualization dashboard that lets IT instantly locate and resolve network bottlenecks for 2,000+ office users.",
    summary: "Real-time Wi-Fi dashboard for 2,000+ office users.",
    image: "/projects/wifi-portal.png",
    tags: ["Python", "Power Platform", "Power BI", "SQL", "Azure", "SharePoint"],
    link: "https://github.com/TylorDuong",
    github: "https://github.com/TylorDuong",
    featured: true,
  },
  {
    id: "QE-04",
    kind: "enterprise",
    accent: "#0284c7",
    title: "Automated Quotation Engine",
    category: "AUTOMATION / LLM",
    year: "2026",
    description:
      "Automated quotation engine built at Yazaki by migrating legacy documents into a centralized database, then parsing customer specifications to precisely calculate labor, cost, and factory-layout requirements.",
    summary: "Parses specs to auto-calculate labor, cost & layout.",
    image: "/projects/quotation-engine.png",
    tags: ["Python", "LLMs", "SQL", "Azure", "Power Platform", "SharePoint"],
    link: "https://github.com/TylorDuong",
    github: "https://github.com/TylorDuong",
    featured: false,
  },
  {
    id: "MR-05",
    kind: "personal",
    accent: "#f97316",
    title: "MoveRight",
    category: "AI / COMPUTER VISION",
    year: "2025",
    description:
      "AI fitness coach offering real-time exercise tracking and form correction from webcam input. Built a custom data-annotation tool and dataset of human exercises for more accurate models, integrating CV models (YOLOv8, ViTPose++) through FastAPI with a responsive React (Next.js) + Tailwind UI.",
    summary: "Corrects your workout form in real time using AI.",
    image: "/projects/moveright.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "React Webcam", "FastAPI", "YOLOv8", "ViTPose++"],
    link: "https://github.com/MoveRightRepo/MoveRight",
    github: "https://github.com/MoveRightRepo/MoveRight",
    featured: true,
  },
  {
    id: "AS-06",
    kind: "personal",
    accent: "#0d9488",
    title: "AssembliSim",
    category: "SIMULATION",
    year: "2025",
    description:
      "Digital-twin factory simulation built for DevilsInvent Honeywell to optimize layouts and manufacturing processes and maximize machine + labor efficiency. Users scan existing factory environments via camera to create an interactive space for editing, modifying, and monitoring layout discrepancies in real time.",
    summary: "Turns factory photos into live defect simulations.",
    image: "/projects/assemblisim.jpg",
    tags: ["Unity2D", "React", "TypeScript", "Tailwind CSS", "Hardware Sensors"],
    link: "https://docs.google.com/presentation/d/1Gslpy-Woiyh7mWuhrddabi2MkOElpCHZ0_Is534DKYw/edit?usp=sharing",
    github: "https://github.com/TylorDuong/factory-sim.git",
    featured: true,
  },
  {
    id: "OR-07",
    kind: "personal",
    accent: "#7c3aed",
    title: "Oratori",
    category: "GAME / SPEECH",
    year: "2025",
    description:
      "Unity2D daily speaking companion—users interact with an evolving, customizable companion to practice public speaking. Integrates speech-to-text processing and generative AI to retrieve curated, engaging responses and error feedback.",
    summary: "A daily speaking companion powered by AI.",
    image: "/projects/oratori.jpg",
    tags: ["Unity2D", "C#", "Vosk", "Gemini API", "AI Agent", "Blender"],
    link: "https://devpost.com/software/oratori",
    github: "https://github.com/TylorDuong/oratori",
    featured: false,
  },
  {
    id: "FT-08",
    kind: "personal",
    accent: "#db2777",
    title: "Fit2U",
    category: "WEB APP",
    year: "2025",
    description:
      "Sustainable digital-closet ecosystem designed to refresh dull wardrobes and promote accessible fashion. Connects to local donation centers and other users and offers secondhand alternatives for any clothing item, with recommendations tailored to weather and preferences.",
    summary: "Sustainable digital closet for a refreshed wardrobe.",
    image: "/projects/fit2u.jpg",
    tags: ["React", "Tailwind CSS", "Weather APIs", "SQL"],
    link: "https://devpost.com/software/fit2u",
    github: "https://github.com/TylorDuong/Fit2U",
    featured: false,
  },
  {
    id: "VB-09",
    kind: "personal",
    accent: "#4f46e5",
    title: "V.I.B.E",
    category: "VR TRAINING",
    year: "2024",
    description:
      "Immersive VR training demonstration simulating real-world aerospace failures to train employees to spot dangerous scenarios. Fully interactive 3D models paired with a real-time accuracy assessment system that scores trainee performance.",
    summary: "VR training for spotting aerospace defects.",
    image: "/projects/project5.jpg",
    tags: ["Unity3D", "C#", "VR", "AR", "Blender"],
    link: "https://github.com/TylorDuong/aerospace-sample",
    github: "https://github.com/TylorDuong/aerospace-sample",
    featured: false,
  },
  {
    id: "SR-10",
    kind: "personal",
    accent: "#dc2626",
    title: "SIR Model Visualizer",
    category: "RESEARCH",
    year: "2023",
    description:
      "Science fair project (HISEF first place, AZSEF participant): simulated pandemic outcomes under different interventions using a custom Unity2D simulation.",
    summary: "Simulates pandemic spread under real interventions.",
    image: "/projects/sirmodel.jpg",
    tags: ["Unity2D", "Simulation", "Research"],
    link: "https://underscoreturt.itch.io/pandemic-simulation-sir-model",
    github: "https://github.com/TylorDuong",
    featured: false,
  },
  {
    id: "MD-11",
    kind: "personal",
    accent: "#b45309",
    title: "MUD: Multi User Dungeon",
    category: "SYSTEMS / GAME",
    year: "2025",
    description:
      "Text-based dungeon game with interactable items, player progression, combat system, and randomly spawning mobs; collaborated via GitHub to implement a map system.",
    summary: "Text-based dungeon game with combat and progression.",
    image: "/projects/mud.jpg",
    tags: ["C", "C#", "OOP", "Git"],
    link: "https://github.com/etrickel/mud_spring25",
    github: "https://github.com/etrickel/mud_spring25",
    featured: false,
  },
];

export const experiences = [
  {
    period: "APR 2026 — PRESENT",
    role: "Founder, CEO & Lead Engineer",
    company: "ShelfSmart",
    description:
      "Founded an IoT startup building lightweight, AI-powered hardware + software ecosystems for automated restaurant inventory tracking. Engineered real-time predictive forecasting designed to cut food waste ~40% and combat $3B in annual industry losses, while reducing manual labor and eliminating ordering errors to protect venue margins.",
    technologies: ["React", "Next.js", "Node.js", "Python", "OpenCV", "IoT Sensors", "Vercel", "Supabase"],
    current: true,
  },
  {
    period: "MAY 2026 — PRESENT",
    role: "Application Developer",
    company: "LeadYouth Education Plus LLC — Yber",
    description:
      "Developed Yber, a gamified neuroinclusive education platform that helps the new generation practice social skills and build portfolio projects. Scaled and deployed through a partnership with Chandler Unified School District (40,000+ students), with a multi-layer agentic architecture that autonomously grades submissions, gives feedback, creates lessons, and announces student milestones on social media.",
    technologies: ["GCP", "Gemini Agents", "React", "Node.js", "Supabase", "Vercel", "n8n", "OpenRouter"],
    current: true,
  },
  {
    period: "APR 2026 — AUG 2026",
    role: "Computer Engineering Intern",
    company: "Yazaki Innovations, Inc.",
    description:
      "Built an automated quotation engine by migrating legacy documents into a centralized database to parse customer specifications and calculate labor, cost, and factory-layout requirements. Won 1st Place in Process Improvement for a Wi-Fi reporting portal and real-time visualization dashboard that let IT instantly resolve network bottlenecks for 2,000+ office users.",
    technologies: ["Python", "LLMs", "SQL", "Azure", "Power Platform", "SharePoint"],
    current: false,
  },
  {
    period: "JAN 2025 — PRESENT",
    role: "Frontend Team Lead + AI Team Member",
    company: "EPICS @ ASU — AI Fitness Coach",
    description:
      "Developing MoveRight, a responsive AI-powered fitness web app with real-time exercise tracking and form correction. Built the UI with React (Next.js) + Tailwind, used React Webcam, and integrated CV models (YOLOv8, ViTPose++) via FastAPI. Created a dataset annotation tool for custom model training.",
    technologies: ["React", "Next.js", "Tailwind CSS", "React Webcam", "FastAPI", "YOLOv8", "ViTPose++"],
    current: true,
  },
  {
    period: "SEP 2025",
    role: "Unity Developer",
    company: "Devhacks — Oratori",
    description:
      "Built a Unity2D daily speaking companion to practice speaking out loud. Used Vosk for speech-to-text and the Gemini API for curated responses.",
    technologies: ["Unity2D", "C#", "Vosk", "Gemini API", "Blender"],
    current: false,
  },
  {
    period: "APR 2025",
    role: "Unity Developer",
    company: "DevilsInvent x Honeywell — AssembliSim",
    description:
      "Created a system that turns factory layout images into a simulation for monitoring discrepancies. Built a responsive React + Tailwind + TypeScript interface supporting image upload, webcam capture, and real-time preview.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Unity2D"],
    current: false,
  },
  {
    period: "MAR 2025",
    role: "Frontend Developer",
    company: "Devhacks x Strategy — Fit2U",
    description:
      "Built a sustainable digital-closet ecosystem to organize wardrobes, generate outfits, and connect users with local donation centers and secondhand alternatives.",
    technologies: ["React", "Tailwind CSS", "Weather APIs", "SQL"],
    current: false,
  },
  {
    period: "MAR 2025",
    role: "Participant",
    company: "SODA Code Challenge XI",
    description:
      "Competed as part of a 3-person team, solving algorithmic/programming challenges in Java under time constraints.",
    technologies: ["Java", "Problem Solving"],
    current: false,
  },
  {
    period: "NOV 2024",
    role: "VR Developer",
    company: "DevilsInvent x Honeywell — VR Aerospace Training",
    description:
      "Created a Unity3D VR training demo for defect detection in aerospace parts with interactive models and real-time accuracy assessment.",
    technologies: ["Unity3D", "C#", "VR", "Blender"],
    current: false,
  },
  {
    period: "SEP 2024",
    role: "Developer",
    company: "Sunhacks — Post Pals",
    description:
      "Built an AI Adobe plugin concept to enhance design workflows with design analysis, font pairing suggestions, clip art recommendations, and theme-based enhancements.",
    technologies: ["Hackathon", "AI", "Design Tools"],
    current: false,
  },
];

// Combined-impact metrics for the hero count-up ticker.
// peopleHelped = 40,000 (Yber / Chandler USD) + 2,000 (Yazaki Wi-Fi) + 459 across other projects.
export const metrics = {
  peopleHelped: 42459,
  moneySaved: 200000, // annual operational savings, Yazaki office
  peopleHelpedBreakdown: [
    { label: "Yber.ai", value: "40,000 users" },
    { label: "Wi-Fi Tracking Portal (Yazaki)", value: "2,000 users" },
    { label: "Other Projects (9)", value: "459 users" },
  ],
  moneySavedBreakdown: [
    { label: "Yazaki Wi-Fi Reporting Portal + Quotation Engine", value: "$200,000 / yr" },
  ],
};

export const testimonials = [
  {
    quote:
      "Tylor is a hardworking, goal driven person who always strives to push the boundaries of his comfort zone and deepen his knowledge on the topics he's interested in.",
    author: "Dominic Castagna",
    role: "2024 Flinn Scholar",
    avatar: "/avatars/dom.jpg",
  },
  {
    quote:
      "Working with Tylor is a breeze—he anticipates edge cases and ships features quickly without sacrificing quality.",
    author: "Olivia Ji",
    role: "Student Researcher, ASU",
    avatar: "/avatars/olivia.jpg",
  },
  {
    quote:
      "Collaborating with Tylor on projects is a rewarding experience. He consistently demonstrates a strong work ethic, a willingness to learn, and an ability to contribute meaningfully to the team's success.",
    author: "Arnav Singh",
    role: "Engineering Student, ASU",
    avatar: "/avatars/arnav.jpg",
  },
];

export const skills = [
  "Python", "JavaScript", "TypeScript", "C/C++", "C#", "Java", "SQL", "HTML", "CSS",
  "React", "Next.js", "React Native", "Tailwind CSS", "Styled Components", "Figma",
  "Node.js", "Express.js", "FastAPI", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase",
  "AWS", "GCP", "Azure", "Vercel", "Docker", "Git", "GitHub",
  "PyTorch", "OpenCV", "Pandas", "NumPy", "Gemini API", "OpenRouter", "LLMs",
  "Unity", "Arduino", "Raspberry Pi", "Altium Designer", "AutoCAD", "Blender",
  "Power Platform", "Power BI", "Power Apps", "n8n", "SharePoint",
];

export const highlights = [
  {
    code: "FS",
    title: "Full-Stack + AI Integration",
    description: "Ships responsive products end-to-end with React/Next.js, Node, FastAPI, and multi-layer agentic AI architectures.",
  },
  {
    code: "IOT",
    title: "IoT & Hardware Systems",
    description: "Founder-level work engineering end-to-end IoT ecosystems—sensors, forecasting models, and the software around them.",
  },
  {
    code: "CV",
    title: "AI + Computer Vision",
    description: "Real-time form-correction and tracking pipelines using webcam input and CV models (YOLOv8, ViTPose++, OpenCV).",
  },
  {
    code: "ENT",
    title: "Enterprise Automation",
    description: "Award-winning automation and reporting tooling on Power Platform, Azure, and SharePoint for 2,000+ enterprise users.",
  },
];

export const about = {
  paragraphs: [
    "I'm Tylor Duong, a Computer Science student at Arizona State University and an early graduate specializing in full-stack development, AI integration, and interactive software.",
    "My work spans founding an IoT startup (ShelfSmart), shipping a neuroinclusive edtech platform to 40,000+ students (Yber), and automating enterprise workflows at Yazaki—alongside computer-vision, game, and VR projects. I have a proven ability to rapidly prototype and deploy robust applications from web to VR.",
    "I enjoy shipping features end-to-end and iterating quickly based on real user needs, whether that's a real-time CV pipeline, an agentic grading system, or an enterprise dashboard resolving network bottlenecks instantly.",
  ],
  quote:
    "My mission is to build software that feels great to use—clean UI, solid engineering, and measurable impact.",
};
