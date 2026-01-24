import { useState } from 'react'
import { getAssetPath } from '../utils/assetPath'
import './DiceGuessGame.css'

interface DiceGuessGameProps {
  onGameEnd: (score: number) => void
  onClose: () => void
}

export default function DiceGuessGame({ onGameEnd, onClose }: DiceGuessGameProps) {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [gameActive, setGameActive] = useState(true)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [showTopDice, setShowTopDice] = useState(false)
  const [hippoMood, setHippoMood] = useState<'happy' | 'sad'>('happy')

  const maxRounds = 10

  const handleNumberGuess = (guessedNumber: number) => {
    if (isRolling || showResult || !gameActive) return
    
    // Показываем выбранный кубик снизу
    setSelectedNumber(guessedNumber)
    
    // Генерируем случайное число
    const newNumber = Math.floor(Math.random() * 6) + 1
    setTargetNumber(newNumber)
    
    // Запускаем анимацию сверху
    setIsRolling(true)
    setShowTopDice(true)
    
    setTimeout(() => {
      // Останавливаем анимацию и показываем результат
      setIsRolling(false)
      
      setTimeout(() => {
        // Показываем результат
        const correct = guessedNumber === newNumber
        setShowResult(true)
        
        // Меняем настроение бегемотика
        setHippoMood(correct ? 'happy' : 'sad')
        
        if (correct) {
          setScore(prev => prev + 10)
        }

        setTimeout(() => {
          // Сбрасываем состояние
          setShowResult(false)
          setShowTopDice(false)
          setSelectedNumber(null)
          setHippoMood('happy') // Возвращаем веселого бегемотика
          
          if (round >= maxRounds) {
            setGameActive(false)
            setTimeout(() => {
              onGameEnd(score + (correct ? 10 : 0))
              onClose()
            }, 500)
          } else {
            setRound(prev => prev + 1)
          }
        }, 1500)
      }, 100)
    }, 1500)
  }

  const handleClose = () => {
    setGameActive(false)
    onGameEnd(score)
    onClose()
  }

  return (
    <div className="dice-game">
      <div className="dice-game-header">
        <div className="title-banner">
          <img src={getAssetPath("/models/models/icons/games/Guess/guess_number.png")} alt="title" className="title-img" />
        </div>
        <button className="close-button-dice" onClick={handleClose}>✕</button>
      </div>

      <div className="dice-game-content">
        <div className="stats-row">
          <div className="stat-badge">
            <img src={getAssetPath("/models/models/icons/games/Guess/score_board.png")} alt="score" className="stat-bg" />
            <span className="stat-text">Очки: {score}</span>
          </div>
          <div className="stat-badge">
            <img src={getAssetPath("/models/models/icons/games/Guess/goal_board.png")} alt="round" className="stat-bg" />
            <span className="stat-text">Раунд: {round}/{maxRounds}</span>
          </div>
        </div>

        <div className="top-dice-area">
          <div className={`top-dice ${isRolling ? 'rolling' : ''}`}>
            {!showTopDice ? (
              <img 
                src={getAssetPath("/models/models/icons/games/Guess/example_square.png")} 
                alt="default dice"
                className="dice-img"
              />
            ) : (
              <img 
                src={`/models/models/icons/games/Guess/square${targetNumber}.png`} 
                alt={`dice ${targetNumber}`}
                className="dice-img"
              />
            )}
          </div>
        </div>

        <div className="question-banner">
          <img src={getAssetPath("/models/models/icons/games/Guess/which_number.png")} alt="question" className="question-img" />
        </div>

        <div className="game-area">
          <div className="hippo-character">
            <img 
              src={`/models/models/icons/games/Guess/${hippoMood}_hippo.png`}
              alt="hippo" 
              className="hippo-img" 
            />
          </div>

          <div className="bottom-area">
            <div className="selected-dice-area">
              {selectedNumber && (
                <img 
                  src={`/models/models/icons/games/Guess/square${selectedNumber}.png`} 
                  alt={`selected ${selectedNumber}`}
                  className="selected-dice-img"
                />
              )}
            </div>

            <div className="numbers-buttons">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  className="number-button"
                  onClick={() => handleNumberGuess(num)}
                  disabled={isRolling || showResult || !gameActive}
                >
                  <img 
                    src={`/models/models/icons/games/Guess/button${num}.png`}
                    alt={`${num}`}
                    className="number-btn-img"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>

      {!gameActive && round >= maxRounds && (
        <div className="game-over-overlay-dice">
          <div className="game-over-content-dice">
            <h2 className="game-over-title-dice">Игра окончена!</h2>
            <p className="game-over-score-dice">Итоговый счет: {score}</p>
          </div>
        </div>
      )}
    </div>
  )
}
