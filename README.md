# Narrative Journey Portfolio

A responsive, scroll-driven React developer portfolio designed to tell a story rather than just list projects. Built with Vite, React, Tailwind CSS, and Framer Motion.

## Features
- **Narrative Timeline**: The core feature is a vertical timeline detailing the developer's journey, built entirely from a data structure (`journey.js`).
- **Subtle 3D Hero**: Uses React Three Fiber for a lightweight, non-distracting starry background.
- **Formspree Integration**: Serverless contact form handling out of the box.
- **Scroll Animations**: Smooth entrance animations powered by Framer Motion.
- **Fully Responsive**: Collapsing timeline and mobile-friendly navigation.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Three Fiber / Drei
- React Scroll & React Icons

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your Formspree endpoint:
   ```env
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Personalize the Content:**
   Search for `[FILL IN]` and `[MyName]` across the codebase, specifically in:
   - `src/components/Hero.jsx`
   - `src/components/Navbar.jsx`
   - `src/constants/journey.js`
   - `src/constants/projects.js`

## Deployment (Vercel / Netlify)
This Vite project is ready to be deployed instantly:
1. Push your code to a GitHub repository.
2. Import the repository in Vercel or Netlify.
3. Add your `VITE_FORMSPREE_ENDPOINT` to the Environment Variables settings in your deployment dashboard.
4. Deploy! The build command is `npm run build` and the output directory is `dist`.
