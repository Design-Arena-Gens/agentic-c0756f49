'use client'

import { useState, useEffect } from 'react'

interface Workout {
  id: string
  name: string
  sets: string
  reps: string
  completed: boolean
}

interface DaySchedule {
  day: string
  isRestDay: boolean
  workouts: Workout[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    day: 'Monday',
    isRestDay: false,
    workouts: [
      { id: '1', name: 'Push-ups', sets: '3', reps: '15', completed: false },
      { id: '2', name: 'Squats', sets: '3', reps: '20', completed: false },
      { id: '3', name: 'Plank', sets: '3', reps: '30s', completed: false },
    ]
  },
  {
    day: 'Tuesday',
    isRestDay: false,
    workouts: [
      { id: '4', name: 'Pull-ups', sets: '3', reps: '8', completed: false },
      { id: '5', name: 'Lunges', sets: '3', reps: '12', completed: false },
      { id: '6', name: 'Bicycle Crunches', sets: '3', reps: '20', completed: false },
    ]
  },
  {
    day: 'Wednesday',
    isRestDay: true,
    workouts: []
  },
  {
    day: 'Thursday',
    isRestDay: false,
    workouts: [
      { id: '7', name: 'Dumbbell Press', sets: '4', reps: '10', completed: false },
      { id: '8', name: 'Deadlifts', sets: '4', reps: '8', completed: false },
      { id: '9', name: 'Mountain Climbers', sets: '3', reps: '15', completed: false },
    ]
  },
  {
    day: 'Friday',
    isRestDay: false,
    workouts: [
      { id: '10', name: 'Dips', sets: '3', reps: '12', completed: false },
      { id: '11', name: 'Leg Press', sets: '4', reps: '12', completed: false },
      { id: '12', name: 'Russian Twists', sets: '3', reps: '20', completed: false },
    ]
  },
  {
    day: 'Saturday',
    isRestDay: false,
    workouts: [
      { id: '13', name: 'Running', sets: '1', reps: '30min', completed: false },
      { id: '14', name: 'Jump Rope', sets: '3', reps: '2min', completed: false },
    ]
  },
  {
    day: 'Sunday',
    isRestDay: true,
    workouts: []
  }
]

export default function Home() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE)
  const [currentDay, setCurrentDay] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [newWorkout, setNewWorkout] = useState({ name: '', sets: '', reps: '' })

  useEffect(() => {
    const saved = localStorage.getItem('workoutSchedule')
    if (saved) {
      setSchedule(JSON.parse(saved))
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    setCurrentDay(today)
  }, [])

  useEffect(() => {
    localStorage.setItem('workoutSchedule', JSON.stringify(schedule))
  }, [schedule])

  const toggleWorkout = (dayIndex: number, workoutId: string) => {
    setSchedule(prev => {
      const newSchedule = [...prev]
      const workout = newSchedule[dayIndex].workouts.find(w => w.id === workoutId)
      if (workout) {
        workout.completed = !workout.completed
      }
      return newSchedule
    })
  }

  const addWorkout = () => {
    if (!newWorkout.name || !newWorkout.sets || !newWorkout.reps) return

    const dayIndex = schedule.findIndex(d => d.day === selectedDay)
    if (dayIndex === -1) return

    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      sets: newWorkout.sets,
      reps: newWorkout.reps,
      completed: false
    }

    setSchedule(prev => {
      const newSchedule = [...prev]
      newSchedule[dayIndex].workouts.push(workout)
      return newSchedule
    })

    setNewWorkout({ name: '', sets: '', reps: '' })
    setShowModal(false)
  }

  const openAddWorkout = (day: string) => {
    setSelectedDay(day)
    setShowModal(true)
  }

  const getTotalWorkouts = () => {
    return schedule.reduce((total, day) => total + day.workouts.length, 0)
  }

  const getCompletedWorkouts = () => {
    return schedule.reduce((total, day) => {
      return total + day.workouts.filter(w => w.completed).length
    }, 0)
  }

  const getWorkoutDays = () => {
    return schedule.filter(day => !day.isRestDay).length
  }

  return (
    <div className="container">
      <div className="header">
        <h1>💪 Workout Planner</h1>
        <p>Your weekly fitness schedule</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{getCompletedWorkouts()}/{getTotalWorkouts()}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getWorkoutDays()}</div>
          <div className="stat-label">Workout Days</div>
        </div>
      </div>

      <div className="week-view">
        {schedule.map((day, dayIndex) => (
          <div
            key={day.day}
            className={`day-card ${day.day === currentDay ? 'active' : ''}`}
          >
            <div className="day-header">
              <div className="day-name">{day.day}</div>
              <div className={`day-badge ${day.isRestDay ? 'rest-day' : 'workout-day'}`}>
                {day.isRestDay ? 'Rest Day' : `${day.workouts.length} exercises`}
              </div>
            </div>

            {day.isRestDay ? (
              <div className="rest-message">Recovery day - your muscles need rest! 🧘</div>
            ) : (
              <>
                <div className="workout-list">
                  {day.workouts.map(workout => (
                    <div key={workout.id} className="workout-item">
                      <div
                        className={`workout-checkbox ${workout.completed ? 'checked' : ''}`}
                        onClick={() => toggleWorkout(dayIndex, workout.id)}
                      />
                      <div className="workout-details">
                        <div className="workout-name">{workout.name}</div>
                        <div className="workout-info">
                          {workout.sets} sets × {workout.reps} reps
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="add-workout-btn"
                  onClick={() => openAddWorkout(day.day)}
                >
                  + Add Exercise
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Add Exercise to {selectedDay}</div>

            <div className="form-group">
              <label className="form-label">Exercise Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Push-ups"
                value={newWorkout.name}
                onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sets</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 3"
                value={newWorkout.sets}
                onChange={e => setNewWorkout({ ...newWorkout, sets: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reps</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 15 or 30s"
                value={newWorkout.reps}
                onChange={e => setNewWorkout({ ...newWorkout, reps: e.target.value })}
              />
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addWorkout}>
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
