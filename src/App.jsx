import { useMemo, useState } from 'react'
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

  const canDraw = names.length >= MIN_PLAYERS
  const currentPair = useMemo(() => pairs[currentIndex], [pairs, currentIndex])

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
        <p className="eyebrow">Organiza tu amigo invisible</p>
        <h1>Reparto secreto sin cruces dobles</h1>
        <p className="lead">
          Agrega los participantes, genera el reparto y deja que cada persona vea solo a quien le regala.
        </p>
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
    </main>
  )
}

export default App
