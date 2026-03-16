import { useState, useEffect } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  date: string
}

export function StatistikyStranka() {
  const [tasks, setTasks] = useState<Task[]>([])
  
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

  const total = tasks.length
  const done = tasks.filter(task => task.done).length
  const notDone = total - done
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  const highCount = tasks.filter(task => task.priority === 'high').length
  const mediumCount = tasks.filter(task => task.priority === 'medium').length
  const lowCount = tasks.filter(task => task.priority === 'low').length

  return (
    <div>
      <h2>Statistiky</h2>

      {total === 0 ? (<p>Zatím nemáš žádné úkoly</p>) : (
        <div>
          <div>
            <div>
              <span>Celkem úkolů: </span>
              <span>{total}</span>
            </div>
            <div>
              <span>Hotovo: </span>
              <span>{done}</span>
            </div>
            <div>
              <span>Zbývá: </span>
              <span>{notDone}</span>
            </div>
          </div>
          <div>
            <h3>Pokrok: {percent}%</h3>
            <p>{percent === 100 ? 'Vše hotovo!' : `Zbývá ti ${notDone} úkolů`}</p>
          </div>
          <div>
            <h3>Rozdělení podle priority</h3>
            <div>
              <span>Vysoká: </span>
              <span>{highCount} úkolů</span>
            </div>
            <div>
              <span>Střední: </span>
              <span>{mediumCount} úkolů</span>
            </div>
            <div>
              <span>Nízká: </span>
              <span>{lowCount} úkolů</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}