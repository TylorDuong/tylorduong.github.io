import React from 'react'

export default function About() {
  return (
    <section className="prose max-w-none">
      <h1>About me</h1>
      <p>Hi, I'm Tylor. I enjoy building software that solves real problems and looks clean under the hood.</p>
      <ul>
        <li>Location: Your City, Country</li>
        <li>Focus: Full‑stack development</li>
        <li>Interests: Open source, tooling, and developer experience</li>
      </ul>
      <h2>Skills</h2>
      <ul>
        <li>Languages: JavaScript/TypeScript, Python, [add yours]</li>
        <li>Frameworks: React, Node.js/Express, [add yours]</li>
        <li>Tools: Git/GitHub, Docker, CI/CD, VS Code</li>
      </ul>
    </section>
  )
}
