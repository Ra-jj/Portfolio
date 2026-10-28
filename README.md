# Monodip Bhattacharya: Portfolio

> A developer portfolio built as one light-grey instrument: a calculator that navigates, a receipt printer that tells the journey, rack modules for projects, a radio band scale for skills, and an "=" panel for getting in touch.

**[View live](https://monodip-portfolio.vercel.app)**

---

## What's Inside

- **Calculator hero.** The calculator's keys are the site navigation: journey, projects, skills, resume, GitHub, LinkedIn, `ac` and `= let's talk`. Its 20x2 character LCD types `MONODIP.PORTFOLIO`, cycles real taglines, and previews where each key goes on hover or focus. A `hold` switch pauses the display.
- **Keyboard shortcuts.** J, P, S, R, G, L, C and `=`, with a `shortcuts` switch to turn them off. They never fire while you type in a field.
- **Sticky key bar.** Once the calculator scrolls away, a compact bar takes over with a mini LCD, a lit LED on the section you are reading, and "Back to calculator".
- **Receipt-printer journey.** Each milestone prints on thermal paper that feeds out of a printer docked to the bottom of the screen as you scroll (native scroll and `position: sticky`, no scroll listeners).
- **Rack-module projects.** Real screenshots in screen bezels, with the stack and keycap links to the source code and live demo.
- **Band-scale skills.** Each skill group is a band on a radio tuning dial; position means category, never level.
- **"=" contact panel.** A Formspree form whose 16x2 LCD reports its real state (ready, fields to check, sending, sent, not sent), with an error summary, inline errors and announced results.
- **Accessible and responsive.** Real links and buttons, a skip link, visible focus, reduced-motion support, and layouts checked from 320 px up.

## Featured Projects

| Project | Description | Stack | Links |
|---------|-------------|-------|-------|
| **AI Resume Analyzer** | AI-powered resume analysis with ATS scoring | React, Vite, PDF.js, Puter.js AI, REST APIs | [Source code](https://github.com/Ra-jj/AI-Resume-Analyzer) · [Live demo](https://ai-resume-analyzer-rajcodes.vercel.app) |
| **Donor** | Blood donation platform with geospatial donor matching | React.js, Node.js, Express, MongoDB, Socket.io, TailwindCSS, Zustand, Jest, GitHub Actions | [Source code](https://github.com/Ra-jj/Donor) · [Live demo](https://rajcodes-donor.onrender.com) |
| **Chatify** | Real-time chat app with Socket.io and cursor-based pagination | React.js, Node.js, Express, MongoDB, Socket.io, TailwindCSS, Zustand | [Source code](https://github.com/Ra-jj/chatify) · [Live demo](https://rajcodes-chatify.onrender.com) |

## Built With

- **React 19** and **Vite**
- **Tailwind CSS**
- **Fontsource**, self-hosted: Archivo (silkscreen and text), Martian Mono (the receipt), Doto (the dot-matrix LCDs)
- **react-icons**, Phosphor Bold
- **Formspree** for the contact form

The calculator, LCDs, receipt and keycaps are HTML and CSS. There is no three.js, GSAP, Framer Motion or border-beam: motion is CSS transitions, native scrolling and IntersectionObserver.

## Architecture

```
src/
├── main.jsx              # Entry: fonts, styles, React root
├── App.jsx               # Page order, skip link, sticky bar, footer
├── index.css             # Design tokens and the instrument's component styles
├── assets/               # Project screenshots (WebP)
├── components/
│   ├── Hero.jsx          # Name, intro and the calculator
│   ├── StickyBar.jsx     # Key bar after the hero, with a mini LCD
│   ├── Timeline.jsx      # Journey: the receipt and its printer
│   ├── Projects.jsx      # Rack modules
│   ├── Skills.jsx        # Radio band scale
│   ├── Contact.jsx       # "=" panel: form, status LCD, links
│   ├── Footer.jsx        # Base strip: links and "Back to calculator"
│   ├── calculator/       # Calculator, LCD and its script, keycaps, LEDs, switches
│   ├── receipt/          # Printer and receipt entries
│   └── contact/          # Contact LCD
├── constants/
│   ├── navigation.js     # Key map: every label, URL, section id, shortcut and key LCD message
│   ├── journey.js        # Journey milestones
│   ├── projects.js       # Featured projects
│   └── skills.js         # Skill bands
├── context/              # Shared navigation, LCD messages and the shortcuts switch
├── hooks/                # Section navigation, shortcuts, active section, in-view,
│                         # key press hold, LCD font loading, page visibility, reduced motion
└── lib/                  # Shared utilities (class-name helper)

public/                   # Resume PDF, favicon, social preview image
```

> Projects, journey, skills and every navigation label, URL and key message on the LCDs live in `src/constants/`; headings and section copy are in the components.

## Run it locally

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

The contact form sends through Formspree. Set `VITE_FORMSPREE_ENDPOINT` to your form's endpoint (for example in `.env.local`) before building; without it, the form tells visitors to message on LinkedIn instead.

## Connect

- **GitHub**: [Ra-jj](https://github.com/Ra-jj)
- **LinkedIn**: [Monodip Bhattacharya](https://www.linkedin.com/in/monodip-bhattacharya-b31768327/)

---

*Designed & built by Monodip Bhattacharya.*
