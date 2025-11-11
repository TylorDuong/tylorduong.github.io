import React from 'react'

export default function Contact() {
  return (
    <section className="prose max-w-none">
      <h1>Contact</h1>
      <ul>
        <li>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></li>
        <li>GitHub: <a href="https://github.com/TylorDuong" target="_blank" rel="noreferrer">@TylorDuong</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noreferrer">your-handle</a></li>
      </ul>
      <p>Want a contact form? I can wire Formspree, Netlify Forms, or a serverless endpoint.</p>
    </section>
  )
}
