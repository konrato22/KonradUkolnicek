import { Link } from 'react-router-dom'

type Props = {
  user: { id: number; username: string } | null
  onLogout: () => void
}

export function Navbar({ user, onLogout }: Props) {
  return (
    <nav>
      <Link to='/'>Domů</Link>

      <div>
        {user ? (
          <div>
            <Link to='/tasks'>Ukoly </Link>
            <Link to='/statistics'>Statistiky </Link>
            <span>{user.username} </span>
            <button onClick={onLogout}>Odhlásit se</button>
          </div>
        ) : (
          <div>
            <Link to='/prihlaseni'>Přihlásit se </Link>
            <Link to='/registrace'>Zaregistrovat se</Link>
          </div>
        )}
      </div>
    </nav>
  )
}