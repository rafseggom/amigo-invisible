import { useEffect, useMemo, useState } from 'react'
import './App.css'

const MIN_PLAYERS = 3
const MAX_ATTEMPTS = 500

const shuffle = (list) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const buildAssignments = (names) => {
  if (names.length < MIN_PLAYERS) {
    throw new Error(`Necesitas al menos ${MIN_PLAYERS} participantes`)
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const receivers = shuffle(names)
    const assignments = new Map()
    let valid = true

    for (let i = 0; i < names.length; i += 1) {
      const giver = names[i]
      const receiver = receivers[i]
      if (giver === receiver) {
        valid = false
        break
      }
      assignments.set(giver, receiver)
    }

    if (!valid) continue

    for (const [giver, receiver] of assignments.entries()) {
      if (assignments.get(receiver) === giver) {
        valid = false
        break
      }
    }

    if (valid) {
      return names.map((giver) => ({ giver, receiver: assignments.get(giver) }))
    }
  }

  throw new Error('No se pudo generar un reparto válido, intenta de nuevo')
}

function App() {
  const [names, setNames] = useState([])
  const [input, setInput] = useState('')
  const [pairs, setPairs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('dark')

  const canDraw = names.length >= MIN_PLAYERS
  const currentPair = useMemo(() => pairs[currentIndex], [pairs, currentIndex])

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (names.includes(trimmed)) {
      setError('Ese nombre ya está en la lista')
      return
    }
    setNames((prev) => [...prev, trimmed])
    setInput('')
    setError('')
  }

  const handleRemove = (name) => {
    setNames((prev) => prev.filter((item) => item !== name))
    setError('')
  }

  const handleDraw = () => {
    try {
      const result = buildAssignments(names)
      setPairs(result)
      setCurrentIndex(0)
      setRevealed(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleNext = () => {
    if (currentIndex < pairs.length - 1) {
      setCurrentIndex((idx) => idx + 1)
      setRevealed(false)
    } else {
      handleReset()
    }
  }

  const handleReset = () => {
    setPairs([])
    setCurrentIndex(0)
    setRevealed(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAdd()
    }
  }

  const progressLabel = pairs.length
    ? `${currentIndex + 1} / ${pairs.length}`
    : ''

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Amigo invisible exprés</p>
            <h1>Tu reparto secreto sin spoilers</h1>
            <p className="lead">
              Añade los nombres, crea el sorteo y revela turnos uno a uno. Nadie se empareja consigo mismo ni hay cruces directos.
            </p>
          </div>
          <div className="controls">
            <a
              href="https://github.com/rafseggom/amigo-invisible"
              target="_blank"
              rel="noopener noreferrer"
              className="ghost icon-btn"
              aria-label="Ver en GitHub"
              title="Ver en GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <button
              type="button"
              className="ghost toggle"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </button>
          </div>
        </div>
      </header>

      <section className="panel">
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Añade un nombre y presiona Enter"
          />
          <button type="button" onClick={handleAdd}>
            Añadir
          </button>
        </div>

        {names.length > 0 ? (
          <ul className="pill-list">
            {names.map((name) => (
              <li key={name} className="pill">
                <span>{name}</span>
                <button type="button" className="ghost" onClick={() => handleRemove(name)} aria-label={`Eliminar ${name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="hint">Necesitas al menos {MIN_PLAYERS} nombres. Nadie regalará a sí mismo ni habrá intercambios directos.</p>
        )}

        <div className="actions">
          <button type="button" onClick={() => setNames([])} className="ghost" disabled={names.length === 0}>
            Limpiar lista
          </button>
          <button type="button" onClick={handleDraw} disabled={!canDraw}>
            Generar reparto
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </section>

      {pairs.length > 0 && currentPair && (
        <section className="reveal">
          <div className="card">
            <div className="card-head">
              <span className="badge">Turno</span>
              <span className="progress">{progressLabel}</span>
            </div>
            <h2>{currentPair.giver}</h2>
            <p className="muted">Presiona mostrar para ver a quién regalas.</p>

            <div className="result">
              {revealed ? <p className="target">Regalas a: <strong>{currentPair.receiver}</strong></p> : <p className="hidden">···</p>}
            </div>

            <div className="actions">
              {!revealed ? (
                <button type="button" onClick={() => setRevealed(true)}>
                  Mostrar
                </button>
              ) : (
                <button type="button" onClick={handleNext}>
                  {currentIndex === pairs.length - 1 ? 'Finalizar' : 'Siguiente'}
                </button>
              )}
              <button type="button" className="ghost" onClick={handleReset}>
                Reiniciar reparto
              </button>
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>
          Hecho con 💜 por{' '}
          <a
            href="https://github.com/rafseggom"
            target="_blank"
            rel="noopener noreferrer"
          >
            rafseggom
          </a>
        </p>
      </footer>
    </main>
  )
}

export default App
