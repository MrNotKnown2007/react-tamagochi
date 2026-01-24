import { useCallback, useEffect, useState } from 'react'
import './BubbleGame.css'

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  speed: number
  type: number
  popping?: boolean
}

interface BubbleGameProps {
  onGameEnd: (score: number) => void
  onClose: () => void
}

const BUBBLE_TYPES = 6

export default function BubbleGame({ onGameEnd, onClose }: BubbleGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(true)
  // @ts-ignore - используется через setNextBubbleId
  const [nextBubbleId, setNextBubbleId] = useState(0)

  const createBubble = useCallback(() => {
    setNextBubbleId(prev => {
      const newBubble: Bubble = {
        id: prev,
        x: Math.random() * 80 + 10,
        y: -10,
        size: Math.random() * 40 + 50,
        speed: Math.random() * 0.8 + 0.4, // Скорость от 0.4 до 1.2
        type: Math.floor(Math.random() * BUBBLE_TYPES) + 1
      }
      setBubbles(current => [...current, newBubble])
      return prev + 1
    })
  }, [])

  useEffect(() => {
    // Создаем начальные шарики
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        createBubble()
      }, i * 120)
    }
  }, [createBubble])

  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  useEffect(() => {
    if (!gameActive) return

    let processedBubbles = new Set<number>()

    const interval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev.filter(bubble => {
          const newY = bubble.y + bubble.speed
          
          if (newY > 110 && !processedBubbles.has(bubble.id)) {
            processedBubbles.add(bubble.id)
            
            setLives(currentLives => {
              const newLives = Math.max(0, currentLives - 1)
              if (newLives <= 0) {
                setTimeout(() => setGameActive(false), 0)
              }
              return newLives
            })
            
            return false
          }
          
          return true
        }).map(bubble => ({
          ...bubble,
          y: bubble.y + bubble.speed
        }))

        return updated
      })
    }, 50)

    return () => {
      clearInterval(interval)
      processedBubbles.clear()
    }
  }, [gameActive])

  // Отдельный эффект для спавна новых шариков
  useEffect(() => {
    if (!gameActive) return

    const spawnInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < 14) {
          createBubble()
        }
        return prev
      })
    }, 900) // Спавним новый шарик каждые 0.9 секунды

    return () => clearInterval(spawnInterval)
  }, [gameActive, createBubble])

  const handleBubbleClick = (bubbleId: number) => {
    if (!gameActive) return
    
    // Добавляем класс анимации
    setBubbles(prev => prev.map(b => 
      b.id === bubbleId ? { ...b, popping: true } : b
    ))
    
    // Удаляем шарик после анимации
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubbleId))
      setScore(prev => prev + 10)
    }, 300)
  }

  const handleClose = () => {
    setGameActive(false)
    onGameEnd(score)
    onClose()
  }

  const handleRestart = () => {
    setBubbles([])
    setScore(0)
    setLives(3)
    setTimeLeft(30)
    setGameActive(true)
    setNextBubbleId(0)
    
    // Создаем начальные шарики
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          createBubble()
        }, i * 120)
      }
    }, 100)
  }

  return (
    <div className="bubble-game">
      <div className="bubble-game-header">
        <div className="lives-container">
          {Array.from({ length: 3 }).map((_, i) => (
            <img
              key={i}
              src={i < lives ? '/models/models/icons/games/hearts/red_heart.png' : '/models/models/icons/games/hearts/grey_heart.png'}
              alt="life"
              className="life-heart"
            />
          ))}
        </div>

        <div className="score-display">
          <span className="score-value">{timeLeft}</span>
          <span className="score-label">СЕК</span>
        </div>

        <div className="points-display">
          <span className="points-value">{score}</span>
          <span className="points-label">ОЧКОВ</span>
        </div>

        <button className="close-button-game" onClick={handleClose}>✕</button>
      </div>

      <div className="bubbles-container">
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            className={`bubble ${bubble.popping ? 'popping' : ''}`}
            style={{
              left: `${bubble.x}%`,
              bottom: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            onClick={() => handleBubbleClick(bubble.id)}
            disabled={bubble.popping}
          >
            <img
              src={`/models/models/icons/games/bubbles/bubble${bubble.type}.png`}
              alt="bubble"
              className="bubble-img"
            />
          </button>
        ))}
      </div>

      {!gameActive && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            {timeLeft === 0 ? (
              <>
                <img src="/models/models/icons/stats/win.png" alt="win" className="game-over-img" />
                <p className="game-over-stats">Очки: {score}</p>
                <p className="game-over-stats">Время: {30 - timeLeft} сек</p>
                <p className="game-over-stats reward">
                  <img src="/models/models/icons/stats/money.png" alt="coins" className="coin-icon-result" />
                  Награда: {Math.floor(score / 2)} монет
                </p>
              </>
            ) : (
              <>
                <h2 className="game-over-title">Поражение!</h2>
                <p className="game-over-stats">Очки: {score}</p>
                <p className="game-over-stats">Время: {30 - timeLeft} сек</p>
                <p className="game-over-stats">Жизни закончились</p>
              </>
            )}
            <div className="result-buttons">
              <button className="result-btn" onClick={handleRestart}>
                <img src="/models/models/icons/games/restart.png" alt="restart" className="result-btn-img" />
              </button>
              <button className="result-btn menu-btn" onClick={handleClose}>
                <img src="/models/models/icons/games/home.png" alt="menu" className="result-btn-img" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
