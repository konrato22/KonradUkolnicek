import { useState, useEffect } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  date: string
}

export function UkolyStranka() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function nactiUkoly() {
      const response = await fetch('/tasks', {
        headers: { Authorization: 'Bearer ' + token }
      })
      const data = await response.json()
      setTasks(data)
    }

    nactiUkoly()
  }, [])

  async function addTask(event: React.FormEvent) {
    event.preventDefault()
    if (!newTitle.trim()) return

    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ title: newTitle, priority })
    })

    const newTask = await response.json()
    setTasks([...tasks, newTask])
    setNewTitle('')
  }

  async function toggleDone(id: number, currentDone: boolean) {
    await fetch('/tasks/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ done: !currentDone })
    })

    setTasks(tasks.map(task => task.id === id ? { ...task, done: !currentDone } : task))
  }

  async function deleteTask(id: number) {
    if (!confirm('Smazat tento úkol?')) return

    await fetch('/tasks/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })

    setTasks(tasks.filter(task => task.id !== id))
  }

  const priorityLabels = {
    low: 'Nizka',
    medium: 'Stredni',
    high: 'Vysoka'
  }

  return (
    <div>
      <h2>Moje úkoly</h2>

      <form onSubmit={addTask}>
        <input type='text'
          value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder='Co potrebujes udelat?'/>
        <select value={priority} onChange={event => setPriority(event.target.value as 'low' | 'medium' | 'high')}>
          <option value='low'>Nízká priorita</option>
          <option value='medium'>Střední priorita</option>
          <option value='high'>Vysoká priorita</option>
        </select>
        <button type='submit'>Přidat</button>
      </form>

      {tasks.length === 0 ? (
        <p>Zatím nemáš žádné úkoly</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <input type='checkbox' checked={task.done} onChange={() => toggleDone(task.id, task.done)}/>
              <span>{task.title}</span>
              <span> {priorityLabels[task.priority]}</span>
              <span>{task.date}</span>
              <button onClick={() => deleteTask(task.id)}>X</button>
            </li>
          ))}
        </ul>
      )}
      <p>Celkem: {tasks.length} úkolů, hotovo: {tasks.filter(task => task.done).length}</p>
    </div>
  )
}