// src/layouts/MainLayout.jsx
import Sidebar from '../layouts/Sidebar'
import Navbar from '../layouts/Navbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64">
        <Navbar />
        <main className="mt-16 p-6 bg-zinc-900 min-h-screen text-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
