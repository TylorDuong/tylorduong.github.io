import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <NavBar />
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-slate-500 py-6 border-t mt-8">
        © {new Date().getFullYear()} Tylor Duong. Built with React + Tailwind.
      </footer>
    </div>
  )
}
