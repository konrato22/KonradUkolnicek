import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { UvodniStranka } from './pages/UvodniStranka'
import { PrihlaseniStranka } from './pages/PrihlaseniStranka'
import { RegistraceStranka } from './pages/RegistraceStranka'
import { UkolyStranka } from './pages/UkolyStranka'
import { StatistikyStranka } from './pages/StatistikyStranka'

type User = {
  id: number
  username: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    fetch('/auth/me', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(response => response.json())
      .then(data => {
        if (data.id) {
          setUser(data)
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch(() => localStorage.removeItem('token'))
  }, [])

  function handleLogin(newUser: User, token: string) {
    localStorage.setItem('token', token)
    setUser(newUser)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <div>
        <Routes>
          <Route path='/' element={<UvodniStranka />} />
          <Route
            path='/prihlaseni'
            element={user ? <Navigate to='/tasks' /> : <PrihlaseniStranka onLogin={handleLogin} />}
          />
          <Route
            path='/registrace'
            element={user ? <Navigate to='/tasks' /> : <RegistraceStranka onRegister={handleLogin} />}
          />
          <Route
            path='/tasks'
            element={user ? <UkolyStranka/> : <Navigate to='/prihlaseni' />}
          />
          <Route
            path='/statistics'
            element={user ? <StatistikyStranka/> : <Navigate to='/prihlaseni' />}
          />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App