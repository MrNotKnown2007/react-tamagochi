import { useCallback, useEffect, useRef, useState } from 'react'
import { getAssetPath } from '../utils/assetPath'
import './FlappyHippo.css'

interface Pipe {
  id: number
  x: number
  gapY: number
  passed: boolean
}

interface FlappyHippoProps {
  onGameEnd: (score: number) => void
  onClose: () => void
}

const GRAVITY = 0.2
const JUMP_STRENGTH = -6
const PIPE_WIDTH = 80
const PIPE_GAP = 220
const PIPE_SPEED = 2.5
const HIPPO_SIZE = 60

export default function FlappyHippo({ onGameEnd, onClose }: FlappyHippoProps) {
  const [hippoY, setHippoY] = useState(250)
  const [hippoVelocity, setHippoVelocity] = useState(0)
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const nextPipeId = useRef(0)
  const gameLoopRef = useRef<number>()

  const createPipe = useCallback(() => {
    const gapY = Math.random() * 250 + 150
    const newPipe: Pipe = {
      id: nextPipeId.current++,
      x: window.innerWidth,
      gapY,
      passed: false
    }
    setPipes(prev => [...prev, newPipe])
  }, [])

  const jump = useCallback(() => {
    if (!gameActive) return
    if (!gameStarted) {
      setGameStarted(true)
    }
    setHippoVelocity(JUMP_STRENGTH)
  }, [gameActive, gameStarted])

  useEffect(() => {
    if (!gameStarted) return

    const pipeInterval = setInterval(() => {
      createPipe()
    }, 1000)

    return () => {
      clearInterval(pipeInterval)
    }
  }, [gameStarted, createPipe])

  useEffect(() => {
    if (!gameActive || !gameStarted) return

    const gameLoop = () => {
      setHippoY(prev => {
        const newY = prev + hippoVelocity
        if (newY < 0 || newY > window.innerHeight - HIPPO_SIZE) {
          setGameActive(false)
          return prev
        }
        return newY
      })

      setHippoVelocity(prev => prev + GRAVITY)

      setPipes(prev => {
        const updated = prev
          .map(pipe => {
            const newX = pipe.x - PIPE_SPEED
            return { ...pipe, x: newX }
          })
          .filter(pipe => pipe.x > -PIPE_WIDTH)

        const hippoX = window.innerWidth / 2 - HIPPO_SIZE / 2
        const hippoRight = hippoX + HIPPO_SIZE
        const hippoBottom = hippoY + HIPPO_SIZE

        for (const pipe of updated) {
          // Начисляем очко только один раз, когда бегемот полностью пролетел трубу
          if (!pipe.passed && hippoX > pipe.x + PIPE_WIDTH) {
            pipe.passed = true
            setScore(s => s + 1)
          }

          // Проверка столкновения
          if (
            hippoRight > pipe.x &&
            hippoX < pipe.x + PIPE_WIDTH &&
            (hippoY < pipe.gapY || hippoBottom > pipe.gapY + PIPE_GAP)
          ) {
            setGameActive(false)
            break
          }
        }

        return updated
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameActive, gameStarted, hippoVelocity, hippoY])

  const handleRestart = () => {
    setHippoY(250)
    setHippoVelocity(0)
    setPipes([])
    setScore(0)
    setGameActive(true)
    setGameStarted(false)
    nextPipeId.current = 0
  }

  const handleClose = () => {
    setGameActive(false)
    onGameEnd(score)
    onClose()
  }

  return (
    <div className="flappy-hippo" onClick={jump}>
      <div className="flappy-header">
        <div className="flappy-score">{score}</div>
        <button className="close-button-game" onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}>✕</button>
      </div>

      {!gameStarted && (
        <div className="start-message">
          Нажми, чтобы начать!
        </div>
      )}

      <div
        className="hippo-player"
        style={{
          top: `${hippoY}px`,
          transform: `rotate(${Math.min(Math.max(hippoVelocity * 3, -30), 30)}deg)`
        }}
      >
        <img
          src={getAssetPath('/models/models/baby/casual/default.png')}
          alt="hippo"
          className="hippo-img"
        />
      </div>

      {pipes.map(pipe => (
        <div key={pipe.id}>
          <div
            className="pipe pipe-top"
            style={{
              left: `${pipe.x}px`,
              height: `${pipe.gapY}px`
            }}
          />
          <div
            className="pipe pipe-bottom"
            style={{
              left: `${pipe.x}px`,
              top: `${pipe.gapY + PIPE_GAP}px`,
              height: `${window.innerHeight - pipe.gapY - PIPE_GAP}px`
            }}
          />
        </div>
      ))}

      {!gameActive && gameStarted && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2 className="game-over-title">Игра окончена!</h2>
            <p className="game-over-stats">Очки: {score}</p>
            <p className="game-over-stats reward">
              <img src={getAssetPath("/models/models/icons/stats/money.png")} alt="coins" className="coin-icon-result" />
              Награда: {score * 2} монет
            </p>
            <div className="result-buttons">
              <button className="result-btn" onClick={(e) => {
                e.stopPropagation()
                handleRestart()
              }}>
                <img src={getAssetPath("/models/models/icons/games/restart.png")} alt="restart" className="result-btn-img" />
              </button>
              <button className="result-btn menu-btn" onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}>
                <img src={getAssetPath("/models/models/icons/games/home.png")} alt="menu" className="result-btn-img" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
