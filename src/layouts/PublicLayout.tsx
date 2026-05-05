import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from 'antd'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Blog' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
]

export function PublicLayout() {
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const nav = (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `px-2 py-3 text-sm font-medium ${isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-950'}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold tracking-normal text-slate-950">
            Sam Lee
          </Link>
          <nav className="hidden items-center gap-6 md:flex">{nav}</nav>
          <div className="hidden items-center gap-2 md:flex">
            {isAdmin ? (
              <Link to="/admin">
                <Button type="primary">进入后台</Button>
              </Link>
            ) : null}
            {user ? (
              <Button onClick={() => void logout()}>{user.nickname}</Button>
            ) : (
              <Link to="/login">
                <Button type="primary">进入博客</Button>
              </Link>
            )}
          </div>
          <button className="md:hidden" aria-label="打开导航" onClick={() => setOpen((next) => !next)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
            <nav className="grid">{nav}</nav>
            <div className="mt-3 flex gap-2">
              {isAdmin ? (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  <Button type="primary">后台</Button>
                </Link>
              ) : null}
              {user ? <Button onClick={() => void logout()}>退出</Button> : <Link to="/login">登录</Link>}
            </div>
          </div>
        ) : null}
      </header>
      <Outlet />
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <strong className="text-slate-950">Sam Lee</strong>
          <span>© 2026 Sam Lee. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
