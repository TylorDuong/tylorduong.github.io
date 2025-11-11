import React from 'react'

export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Hi, I'm Tylor 👋</h1>
      <p className="text-lg max-w-prose">I build software with a focus on clarity, performance, and developer experience. This portfolio showcases some of my work and ways to connect.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-md shadow-sm">
          <h2 className="font-semibold mb-1">Featured Project</h2>
          <p className="text-sm text-slate-600">Brief highlight of a project you want recruiters to see first.</p>
          <a href="#" className="text-blue-600 text-sm mt-2 inline-block">View more →</a>
        </div>
        <div className="p-4 border rounded-md shadow-sm">
          <h2 className="font-semibold mb-1">Tech Stack</h2>
          <p className="text-sm text-slate-600">React, TypeScript, Node.js, Tailwind CSS, Docker, CI/CD.</p>
        </div>
      </div>
    </section>
  )
}
