import chatifyImg from "../assets/Chatify.png";
import resumeImg from "../assets/AI Resume.png";
import donorImg from "../assets/Donor.png";

export const projects = [
  {
    id: 1,
    title: "Chatify",
    description: "A production-ready real-time chat application handling bidirectional data synchronization and live messaging across concurrent users. Engineered with a scalable MongoDB/Mongoose layer with cursor-based pagination and JWT HTTP-only cookie authentication.",
    tags: ["React.js", "Node.js", "Express", "MongoDB", "Socket.io", "TailwindCSS", "Zustand"],
    sourceCode: "https://github.com/Ra-jj/chatify.git",
    liveDemo: "https://rajcodes-chatify.onrender.com",
    image: chatifyImg,
  },
  {
    id: 2,
    title: "AI Resume Analyzer",
    description: "An AI-powered resume analysis tool that parses uploaded PDFs and delivers ATS compatibility scores, grammar feedback, and keyword suggestions via a responsive analytics dashboard powered by Puter.js AI.",
    tags: ["React", "Vite", "PDF.js", "Puter.js AI", "REST APIs"],
    sourceCode: "https://github.com/Ra-jj/AI-Resume-Analyzer.git",
    liveDemo: "https://ai-resume-analyzer-rajcodes.vercel.app/",
    image: resumeImg,
  },
  {
    id: 3,
    title: "Donor",
    description: "A real-time blood donation coordination platform that matches compatible donors within a 15 km radius of hospital emergencies using MongoDB geospatial indexing. Features instant WebSocket notifications, in-app chat, and JWT-secured authentication.",
    tags: ["React.js", "Node.js", "Express", "MongoDB", "Socket.io", "TailwindCSS"],
    sourceCode: "https://github.com/Ra-jj/Donor.git",
    liveDemo: "https://rajcodes-donor.onrender.com",
    image: donorImg,
  },
];

