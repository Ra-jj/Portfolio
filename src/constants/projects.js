import chatifyImg from "../assets/Chatify.png";
import resumeImg from "../assets/AI Resume.png";
import thumbImg from "../assets/AI Thumbnail.png";

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
    title: "AI Thumbnail Generator (Thumbfy)",
    description: "A full-stack AI thumbnail generation platform serving end-to-end image creation workflows. Implemented JWT-based authentication and bcrypt password hashing via RESTful Express.js APIs backed by MongoDB.",
    tags: ["MERN Stack", "JWT", "bcrypt", "REST APIs"],
    sourceCode: "https://github.com/Ra-jj/AI-Thumbnail-Generator.git",
    liveDemo: null,
    image: thumbImg,
  },
];
