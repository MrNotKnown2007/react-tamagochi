import { useEffect, useState } from 'react'
import { useHippo } from '../context/HippoContext'
import { getAssetPath } from '../utils/assetPath'
import './MemoryGame.css'

interface Card {
  id: number
  value: number
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onGameEnd: (score: number) => void
  onClose: () => void
}

const CARD_IMAGES = [
  getAssetPath('/models/models/icons/games/cards/card1 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card2 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card3 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card4 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card5 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card6 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card7 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card8 (1).png'),
  getAssetPath('/models/models/icons/games/cards/card9.png'),
  getAssetPath('/models/models/icons/games/cards/card10.png'),
]

const CARD_BACK = getAssetPath('/models/models/icons/games/cards/back.png')

export default function MemoryGame({ onGameEnd, onClose }: MemoryGameProps) {
  const { updateGameStats } = useHippo()
  const [cards, setCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameActive, setGameActive] = useState(true)
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [canFlip, setCanFlip] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (!gameActive || gameCompleted) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleGameOver()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, gameCompleted])

  const initializeGame = () => {
    const selectedCards = CARD_IMAGES.slice(0, 10)
    const cardPairs = [...selectedCards, ...selectedCards]
    
    // Fisher-Yates shuffle algorithm для более рандомного перемешивания
    const shuffled = cardPairs.map((value, index) => ({
      id: index,
      value: selectedCards.indexOf(value),
      isFlipped: false,
      isMatched: false,
    }))
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      // Обновляем id после перемешивания
      shuffled[i].id = i
      shuffled[j].id = j
    }
    
    setCards(shuffled)
    setMoves(0)
    setMatches(0)
    setTimeLeft(120)
    setFlippedCards([])
    setCanFlip(true)
    setGameActive(true)
    setGameCompleted(false)
  }

  const handleCardClick = (cardId: number) => {
    if (!canFlip || !gameActive || gameCompleted) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    if (newFlipped.length === 2) {
      setCanFlip(false)
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlipped
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ))
          setMatches(prev => {
            const newMatches = prev + 1
            if (newMatches === 10) {
              handleGameWin()
            }
            return newMatches
          })
          setFlippedCards([])
          setCanFlip(true)
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ))
          setFlippedCards([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  const handleGameWin = () => {
    setGameCompleted(true)
    setGameActive(false)
    const score = Math.max(0, 1000 - (moves * 10) + (timeLeft * 5))
    updateGameStats('memory', score)
    // Не закрываем автоматически - ждем действия пользователя
  }

  const handleGameOver = () => {
    setGameActive(false)
    updateGameStats('memory', 0)
    // Не закрываем автоматически - ждем действия пользователя
  }

  const handleClose = () => {
    setGameActive(false)
    onGameEnd(matches * 100)
    onClose()
  }

  const handleRestart = () => {
    initializeGame()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="memory-game">
      <div className="memory-game-header">
        <button className="back-btn-memory" onClick={handleClose}>
          <img src={getAssetPath("/models/models/icons/games/back_arrow.png")} alt="back" className="back-icon-memory" />
        </button>
        
        <div className="title-memory">
          <img src={getAssetPath("/models/models/icons/games/brain.png")} alt="brain" className="brain-icon-header" />
          <span className="title-text-memory">Игра на память</span>
        </div>

        <div className="timer-memory">
          <span className="timer-text-memory">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="memory-game-content">
        <div className="cards-grid">
          {cards.map(card => (
            <button
              key={card.id}
              className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={!canFlip || card.isFlipped || card.isMatched}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img src={CARD_BACK} alt="card back" className="card-img" />
                </div>
                <div className="card-back">
                  <img src={CARD_IMAGES[card.value]} alt="card" className="card-img" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="restart-btn-container">
          <button className="restart-btn-memory" onClick={initializeGame}>
            <img src={getAssetPath("/models/models/icons/games/restart.png")} alt="restart" className="restart-icon" />
          </button>
        </div>
      </div>

      {gameCompleted && (
        <div className="win-overlay">
          <div className="win-content">
            <img src={getAssetPath("/models/models/icons/stats/win.png")} alt="win" className="win-img" />
            <p className="win-stats">Найдено пар: {matches}/10</p>
            <p className="win-stats">Ходов сделано: {moves}</p>
            <p className="win-stats">Время осталось: {formatTime(timeLeft)}</p>
            <p className="win-stats score">Итоговый счет: {Math.max(0, 1000 - (moves * 10) + (timeLeft * 5))} очков</p>
            <p className="win-stats reward">
              <img src={getAssetPath("/models/models/icons/stats/money.png")} alt="coins" className="coin-icon-result" />
              Награда: {Math.floor((Math.max(0, 1000 - (moves * 10) + (timeLeft * 5))) / 20)} дополнительных монет
            </p>
            <div className="result-buttons">
              <button className="result-btn" onClick={handleRestart}>
                <img src={getAssetPath("/models/models/icons/games/restart.png")} alt="restart" className="result-btn-img" />
              </button>
              <button className="result-btn menu-btn" onClick={handleClose}>
                <img src={getAssetPath("/models/models/icons/games/home.png")} alt="menu" className="result-btn-img" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!gameActive && !gameCompleted && timeLeft === 0 && (
        <div className="game-over-overlay-memory">
          <div className="game-over-content-memory">
            <h2 className="game-over-title-memory">Время вышло!</h2>
            <p className="game-over-text-memory">Найдено пар: {matches}/10</p>
            <p className="game-over-text-memory">Ходов сделано: {moves}</p>
            <div className="result-buttons">
              <button className="result-btn" onClick={handleRestart}>
                <img src={getAssetPath("/models/models/icons/games/restart.png")} alt="restart" className="result-btn-img" />
              </button>
              <button className="result-btn menu-btn" onClick={handleClose}>
                <img src={getAssetPath("/models/models/icons/games/home.png")} alt="menu" className="result-btn-img" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
