# Monodip Bhattacharya — Portfolio

> A scroll-driven, story-first developer portfolio that walks through my journey from electronics engineering to building production-grade full-stack applications.

🔗 **[View Live](https://monodip-portfolio.vercel.app)**

---

## What's Inside

- **Narrative Timeline** — A vertical timeline that tells the story of how I got here, driven by a single data file.
- **3D Starfield Hero** — A lightweight React Three Fiber canvas with animated stars.
- **Animated Navigation** — A collapsible pill-style navbar that responds to scroll direction.
- **Border Beam Effects** — Glowing animated borders on project cards and timeline items.
- **Custom Cursor & Web Strings** — Interactive visual effects for a premium feel.
- **Contact Form** — Serverless form handling via Formspree.
- **Fully Responsive** — Mobile-first design with adaptive layouts across all breakpoints.

## Featured Projects

| Project | Description | Links |
|---------|-------------|-------|
| **Chatify** | Real-time chat app with Socket.io & cursor-based pagination | [Code](https://github.com/Ra-jj/chatify) · [Live](https://rajcodes-chatify.onrender.com) |
| **AI Resume Analyzer** | AI-powered resume analysis with ATS scoring | [Code](https://github.com/Ra-jj/AI-Resume-Analyzer) · [Live](https://ai-resume-analyzer-rajcodes.vercel.app) |
| **Donor** | Blood donation coordination with geospatial donor matching | [Code](https://github.com/Ra-jj/Donor) · [Live](https://rajcodes-donor.onrender.com) |

## Built With

`React 19` · `Vite` · `Tailwind CSS` · `Framer Motion` · `GSAP` · `React Three Fiber` · `Zustand` · `Socket.io` · `border-beam`

## Architecture

```
src/
├── components/       # UI sections (Hero, Timeline, Skills, Projects, Contact)
│   └── ui/           # Reusable primitives (AnimatedNav, Cursor, FlowButton, WebStrings)
├── constants/        # All portfolio content as data files
│   ├── journey.js    # Timeline milestones
│   ├── projects.js   # Featured project cards
│   └── skills.js     # Skills gained section
└── lib/              # Shared utilities
```

> All content is data-driven. Update `src/constants/` to personalize — no component code changes needed.

## Connect

- **GitHub**: [Ra-jj](https://github.com/Ra-jj)
- **LinkedIn**: [Monodip Bhattacharya](https://www.linkedin.com/in/monodip-bhattacharya-b31768327/)

---

*Designed & built by Monodip Bhattacharya.*
