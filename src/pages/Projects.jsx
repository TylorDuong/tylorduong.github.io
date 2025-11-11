import React from 'react'

function ProjectCard({ title, desc, links = [] }) {
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600">{desc}</p>
      <div className="mt-2 flex gap-3 text-sm">
        {links.map(({ label, href }) => (
          <a key={label} className="text-blue-600" href={href} target="_blank" rel="noreferrer">{label} →</a>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const projects = [
    { title: 'Project One', desc: 'Short description of the project/problem.', links: [{label:'Repo', href:'#'}, {label:'Demo', href:'#'}] },
    { title: 'Project Two', desc: 'Short description goes here.', links: [{label:'Repo', href:'#'}] },
  ]

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map(p => <ProjectCard key={p.title} {...p} />)}
      </div>
      <p className="text-sm text-slate-600">More on my GitHub: <a className="text-blue-600" href="https://github.com/TylorDuong" target="_blank" rel="noreferrer">@TylorDuong</a></p>
    </section>
  )
}
