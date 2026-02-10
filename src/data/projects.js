const defaultLinks = {
  link: "https://github.com/TylorDuong",
  github: "https://github.com/TylorDuong",
};

const projects = [
  {
    title: "MoveRight",
    description:
      "AI-powered fitness web app with real-time form correction using webcam input. Integrated CV models (YOLOv8, ViTPose++) through FastAPI and built responsive UI in React (Next.js) + Tailwind.",
    image: "/projects/moveright.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "FastAPI", "YOLOv8"],
    link: "https://github.com/MoveRightRepo/MoveRight",
    github:"https://github.com/MoveRightRepo/MoveRight",
  },
  {
    title: "AssembliSim",
    description:
      "Factory layout scanning + simulation tool built for DevilsInvent Honeywell. Supports image upload, webcam capture, real-time preview, and responsive UI with React + Tailwind + TypeScript.",
    image: "/projects/assemblisim.jpg",
    tags: ["React", "TypeScript", "Tailwind CSS", "Unity2D"],
    link: "https://docs.google.com/presentation/d/1Gslpy-Woiyh7mWuhrddabi2MkOElpCHZ0_Is534DKYw/edit?usp=sharing",
    github: "https://github.com/TylorDuong/factory-sim.git",
  },
  {
    title: "Oratori",
    description:
      "Unity2D Tamagotchi-like daily speaking companion. Uses Vosk for speech-to-text and Gemini API for curated, engaging responses.",
    image: "/projects/oratori.jpg",
    tags: ["Unity2D", "C#", "Vosk", "Gemini API"],
    link: "https://devpost.com/software/oratori",
    github: "https://github.com/TylorDuong/oratori",
  },
  {
    title: "Fit2U",
    description:
      "Personalized fashion assistant to organize wardrobes, generate outfits, and support sustainable choices with recommendations tailored to weather, body type, and preferences.",
    image: "/projects/fit2u.jpg",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    link:"https://devpost.com/software/fit2u",
    github:"https://github.com/TylorDuong/Fit2U",
  },
  {
    title: "V.I.B.E (Virtual Immersion and Bright Engagement)",
    description:
      "VR training demo in Unity3D for defect detection in aerospace parts, featuring interactive models and real-time accuracy assessment.",
    image: "/projects/project5.jpg",
    tags: ["Unity3D", "C#", "VR"],
    link: "https://docs.google.com/presentation/d/1-QUQ3TvcscBQ_hd2bauCshCZwlxvg0JW/edit?usp=sharing&ouid=105218856044816269278&rtpof=true&sd=true",
    github: "https://github.com/TylorDuong/aerospace-sample",
  },
  {
    title: "Visualizing a SIR Model",
    description:
      "Science fair project (HISEF first place, AZSEF participant): simulated pandemic outcomes under different interventions using a custom Unity2D simulation.",
    image: "/projects/sirmodel.jpg",
    tags: ["Unity2D", "Simulation", "Research"],
    link: "https://underscoreturt.itch.io/pandemic-simulation-sir-model",
    github: "https://github.com/TylorDuong"
  },
  {
    title: "MUD: Multi User Dungeon",
    description:
      "Text-based dungeon game with interactable items, player progression, combat system, and randomly spawning mobs; collaborated via GitHub to implement a map system.",
    image: "/projects/mud.jpg",
    tags: ["C", "C#", "OOP", "Git"],
    link: "https://github.com/etrickel/mud_spring25",
    github: "https://github.com/etrickel/mud_spring25",
  },
];

export default projects;
