import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaGithub
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiMysql,
  SiSocketdotio
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { FaMicrochip } from "react-icons/fa";
import { Layers } from "lucide-react";

export const skillGroups = [
  {
    title: "The Foundation",
    description: "The core languages and technologies I use.",
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
      { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
      { name: "Python", icon: FaPython, color: "text-blue-400" },
      { name: "HTML5 & CSS3", icon: FaHtml5, color: "text-orange-500" },
    ]
  },
  {
    title: "The Modern Stack",
    description: "My primary tools for building interactive frontends.",
    skills: [
      { name: "React.js", icon: FaReact, color: "text-sky-400" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-teal-400" },
      { name: "DaisyUI", icon: SiTailwindcss, color: "text-purple-400" },
      { name: "Zustand", icon: Layers, color: "text-orange-400" },
    ]
  },
  {
    title: "Backend & Data",
    description: "Navigating servers, real-time systems, and databases.",
    skills: [
      { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
      { name: "Express.js", icon: SiExpress, color: "text-gray-300" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
      { name: "Socket.io", icon: SiSocketdotio, color: "text-white" },
    ]
  },
  {
    title: "Tools & Hardware",
    description: "Version control, APIs, security, and IoT.",
    skills: [
      { name: "REST APIs", icon: TbApi, color: "text-sky-300" },
      { name: "MySQL", icon: SiMysql, color: "text-blue-500" },
      { name: "Git & GitHub", icon: FaGithub, color: "text-white" },
      { name: "Arduino / IoT", icon: FaMicrochip, color: "text-emerald-500" },
    ]
  }
];
