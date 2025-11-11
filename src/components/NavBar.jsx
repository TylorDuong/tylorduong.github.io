import React from 'react'
import { NavLink } from 'react-router-dom'

const linkBase = 'px-3 py-2 rounded-md text-sm font-medium'

export default function NavBar() {
  return (
    <nav className="w-full border-b bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <NavLink to="/" className="text-lg font-semibold tracking-tight">Tylor Duong</NavLink>
        <ul className="flex items-center gap-2">
          <li><NavLink end to="/" className={({isActive}) => `${linkBase} ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50'}`}>Home</NavLink></li>
          <li><NavLink to="/about" className={({isActive}) => `${linkBase} ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50'}`}>About</NavLink></li>
          <li><NavLink to="/projects" className={({isActive}) => `${linkBase} ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50'}`}>Projects</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => `${linkBase} ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50'}`}>Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
