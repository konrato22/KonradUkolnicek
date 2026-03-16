import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = 3000
const JWT_SECRET = 'tajny-klic-123'

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

type User = {
  id: number
  username: string
  password: string
}

type Task = {
  id: number
  userId: number
  title: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  date: string
}

let users: User[] = []
let tasks: Task[] = []
let userId = 1
let taskId = 1

function checkToken(req: any): number | null {
  const header = req.headers.authorization
  if (!header) return null

  const token = header.split(' ')[1]

  try {
    const data = jwt.verify(token, JWT_SECRET) as { userId: number }
    return data.userId
  } catch {
    return null
  }
}

// registrace
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ error: 'Zadej username a heslo' })
    return
  }

  if (password.length < 4) {
    res.status(400).json({ error: 'Heslo musi mit aspon 4 znaky' })
    return
  }

  const exists = users.find(user => user.username === username)
  if (exists) {
    res.status(400).json({ error: 'Toto jmeno je uz obsazene' })
    return
  }

  const newUser: User = {
    id: userId++,
    username,
    password
  }
  users.push(newUser)

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' })

  res.json({
    token,
    user: { id: newUser.id, username: newUser.username }
  })
})

// prihlaseni
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ error: 'Zadej username a heslo' })
    return
  }

  const foundUser = users.find(user => user.username === username)
  if (!foundUser) {
    res.status(401).json({ error: 'Spatne jmeno nebo heslo' })
    return
  }

  if (foundUser.password !== password) {
    res.status(401).json({ error: 'Spatne jmeno nebo heslo' })
    return
  }

  const token = jwt.sign({ userId: foundUser.id }, JWT_SECRET, { expiresIn: '24h' })

  res.json({
    token,
    user: { id: foundUser.id, username: foundUser.username }
  })
})

// overeni tokenu
app.get('/auth/me', (req, res) => {
  const currentUserId = checkToken(req)
  if (!currentUserId) {
    res.status(401).json({ error: 'Nejsi prihlaseny' })
    return
  }

  const foundUser = users.find(user => user.id === currentUserId)
  if (!foundUser) {
    res.status(404).json({ error: 'Uzivatel nenalezen' })
    return
  }

  res.json({ id: foundUser.id, username: foundUser.username })
})

// nacteni ukolu
app.get('/tasks', (req, res) => {
  const currentUserId = checkToken(req)
  if (!currentUserId) {
    res.status(401).json({ error: 'Nejsi prihlaseny' })
    return
  }

  const myTasks = tasks.filter(task => task.userId === currentUserId)
  res.json(myTasks)
})

// pridani ukolu
app.post('/tasks', (req, res) => {
  const currentUserId = checkToken(req)
  if (!currentUserId) {
    res.status(401).json({ error: 'Nejsi prihlaseny' })
    return
  }

  const { title, priority } = req.body

  if (!title) {
    res.status(400).json({ error: 'Zadej nazev ukolu' })
    return
  }

  const newTask: Task = {
    id: taskId++,
    userId: currentUserId,
    title,
    done: false,
    priority: priority || 'medium',
    date: new Date().toLocaleDateString('cs-CZ')
  }

  tasks.push(newTask)
  res.json(newTask)
})

// zmena stavu ukolu
app.patch('/tasks/:id', (req, res) => {
  const currentUserId = checkToken(req)
  if (!currentUserId) {
    res.status(401).json({ error: 'Nejsi prihlaseny' })
    return
  }

  const id = Number(req.params.id)
  const task = tasks.find(task => task.id === id && task.userId === currentUserId)

  if (!task) {
    res.status(404).json({ error: 'Ukol nenalezen' })
    return
  }

  if (req.body.done !== undefined) task.done = req.body.done
  if (req.body.title) task.title = req.body.title

  res.json(task)
})

// smazani ukolu
app.delete('/tasks/:id', (req, res) => {
  const currentUserId = checkToken(req)
  if (!currentUserId) {
    res.status(401).json({ error: 'Nejsi prihlaseny' })
    return
  }

  const id = Number(req.params.id)
  const index = tasks.findIndex(task => task.id === id && task.userId === currentUserId)

  if (index === -1) {
    res.status(404).json({ error: 'Ukol nenalezen' })
    return
  }
  tasks.splice(index, 1)
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log('Server bezi na http://localhost:' + PORT)
})