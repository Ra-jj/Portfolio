// WebP copies of the original captures, at most 1600 px wide (Chatify
// 2878x1624 and Donor 2880x1626 were scaled down; AI Resume stays 1280x860).
// width/height are the files' own sizes; the 16:10 frame crops them
// (src/index.css, .rack-screen).
import chatifyImg from "../assets/chatify.webp";
import resumeImg from "../assets/ai-resume.webp";
import donorImg from "../assets/donor.webp";

export const projects = [
  {
    id: 1,
    title: "AI Resume Analyzer",
    description: "An AI-powered resume analysis tool that parses uploaded PDFs with PDF.js and returns ATS scores, grammar feedback, keyword suggestions, and recommended job roles in an analytics dashboard powered by Puter.js AI.",
    tags: ["React", "Vite", "PDF.js", "Puter.js AI", "REST APIs"],
    sourceCode: "https://github.com/Ra-jj/AI-Resume-Analyzer.git",
    liveDemo: "https://ai-resume-analyzer-rajcodes.vercel.app/",
    image: resumeImg,
    alt: "AI Resume Analyzer upload screen",
    width: 1280,
    height: 860,
  },
  {
    id: 2,
    title: "Donor",
    description: "A real-time blood donation platform that matches compatible donors within 15 km of a hospital using MongoDB geospatial queries, with Socket.io and Web Push alerts and in-app chat. An installable PWA secured with JWT in HTTP-only cookies, Zod validation and a strict Content Security Policy; 300+ Jest/Supertest tests in GitHub Actions CI gate every deploy to Render.",
    tags: ["React.js", "Node.js", "Express", "MongoDB", "Socket.io", "TailwindCSS", "Zustand", "Jest", "GitHub Actions"],
    sourceCode: "https://github.com/Ra-jj/Donor.git",
    liveDemo: "https://rajcodes-donor.onrender.com",
    image: donorImg,
    alt: "Donor landing page",
    width: 1600,
    height: 903,
  },
  {
    id: 3,
    title: "Chatify",
    description: "A production-ready real-time chat application handling bidirectional data synchronization and live messaging across concurrent users. Engineered with a scalable MongoDB/Mongoose layer with cursor-based pagination and JWT HTTP-only cookie authentication.",
    tags: ["React.js", "Node.js", "Express", "MongoDB", "Socket.io", "TailwindCSS", "Zustand"],
    sourceCode: "https://github.com/Ra-jj/chatify.git",
    liveDemo: "https://rajcodes-chatify.onrender.com",
    image: chatifyImg,
    alt: "Chatify sign-in screen with a live chat preview",
    width: 1600,
    height: 903,
    // The capture is wider than the 16:10 frame; keep the sign-in form in view.
    objectPosition: "15% top",
  },
];
