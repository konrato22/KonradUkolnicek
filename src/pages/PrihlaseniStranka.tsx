import { useState } from 'react'

type Props = {
  onLogin: (user: { id: number; username: string }, token: string) => void
}

export function PrihlaseniStranka({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      onLogin(data.user, data.token)
    } catch {
      setError('Něco se pokazilo, zkuste znova')
    }
  }

  return (
    <div>
      <div>
        <h2>Přihlásit se</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Uživatelské jméno: </label>
            <input type='text' value={username} onChange={event => setUsername(event.target.value)}/>
          </div>
          <div>
            <label>Heslo: </label>
            <input type='password' value={password} onChange={event => setPassword(event.target.value)} placeholder='zadejte heslo'/>
          </div>
          {error && <p>{error}</p>}
          <button type='submit'>Přihlásit se</button>
        </form>
      </div>
    </div>
  )
}