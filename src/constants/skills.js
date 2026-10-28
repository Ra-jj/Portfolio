/**
 * Skills, as the bands of a radio dial scale (design-plan 7.5, user decision
 * 0.9): five bands of four stations. A station's position on its band means
 * category, never level, so there are no proficiency numbers here and none
 * may be added.
 *
 * Every skill comes from the resume (public/Monodip_Bhattacharya_Resume.pdf)
 * or from this file's earlier content. Names must stay short enough to fit
 * one station (about 120 px at 14 px on a 320 px phone).
 */
export const skillGroups = [
  {
    title: "The Foundation",
    description: "The core languages and technologies I use.",
    skills: ["JavaScript", "TypeScript", "Python", "HTML5 & CSS3"],
  },
  {
    title: "The Modern Stack",
    description: "My primary tools for building interactive frontends.",
    skills: ["React.js", "Tailwind CSS", "DaisyUI", "Zustand"],
  },
  {
    title: "Backend & Data",
    description: "Navigating servers, real-time systems, and databases.",
    skills: ["Node.js", "Express.js", "MongoDB", "Socket.io"],
  },
  {
    title: "Tools & Hardware",
    description: "Version control, APIs, databases, and IoT.",
    skills: ["REST APIs", "MySQL", "Git & GitHub", "Arduino / IoT"],
  },
  {
    title: "Testing & Security",
    description: "Automated tests, CI, authentication, and installable web apps.",
    skills: ["Jest", "GitHub Actions", "JWT auth", "PWA"],
  },
];
