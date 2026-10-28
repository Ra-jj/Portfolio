export const journey = [
  {
    id: 1,
    date: "Aug 2022 - July 2026",
    title: "The Engineering Foundation",
    description: "Graduated with a B.Tech in Electronics and Communication Engineering from Dr. BC Roy Engineering College, Durgapur. This is where I laid my foundations in hardware, logic, and problem-solving before discovering my passion for software engineering.",
    skillsLearned: ["Python", "C++", "Data Structures"],
    project: null,
  },
  {
    id: 2,
    date: "2025",
    title: "Building with AI & Full Stack",
    description: "Built an AI-powered Resume Analyzer that parses uploaded PDFs with PDF.js and returns ATS scores, grammar feedback, keyword suggestions, and recommended job roles, in an analytics dashboard powered by Puter.js AI.",
    skillsLearned: ["React", "Vite", "PDF.js", "Puter.js AI", "REST APIs"],
    projects: [
      {
        name: "AI Resume Analyzer",
        link: "https://github.com/Ra-jj/AI-Resume-Analyzer.git",
        liveLink: "https://ai-resume-analyzer-rajcodes.vercel.app/",
      }
    ],
  },
  {
    id: 3,
    date: "June 2025 - July 2025",
    title: "Bridging Hardware & Software",
    description: "Embedded Systems & IoT Intern at the IC Design and Fabrication Center, Dept. of ECE, Jadavpur University, Kolkata. Programmed Arduino microcontrollers to interface with sensors and transmit data over IoT protocols, building end-to-end hardware-software pipelines. Delivered a complete real-time IoT project within two months and received official certification.",
    skillsLearned: ["Arduino", "IoT Protocols", "Firmware Development"],
    project: null,
  },
  {
    id: 4,
    date: "2026",
    title: "Mastering Real-Time Systems",
    description: "Built Chatify, a production-ready real-time chat application. Engineered a scalable database layer with cursor-based pagination and implemented bidirectional data synchronization across concurrent users.",
    skillsLearned: ["Socket.io", "Zustand", "TailwindCSS"],
    projects: [
      {
        name: "Chatify",
        link: "https://github.com/Ra-jj/chatify.git",
        liveLink: "https://rajcodes-chatify.onrender.com",
      }
    ],
  },
  {
    id: 5,
    date: "2026",
    title: "Engineering for Impact",
    description: "Built Donor, a real-time blood donation platform that matches compatible donors within 15 km of a hospital using MongoDB geospatial queries, with Socket.io and Web Push alerts and in-app chat. Secured it with JWT in HTTP-only cookies, shipped it as an installable PWA, and gated every deploy on 300+ Jest/Supertest tests in GitHub Actions CI.",
    skillsLearned: ["Node.js", "Express", "MongoDB", "Jest", "GitHub Actions"],
    projects: [
      {
        name: "Donor",
        link: "https://github.com/Ra-jj/Donor.git",
        liveLink: "https://rajcodes-donor.onrender.com",
      }
    ],
  },
];
