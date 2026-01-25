import { useCallback, useEffect, useState } from 'react'
import BubbleGame from '../components/BubbleGame'
import DiceGuessGame from '../components/DiceGuessGame'
import MemoryGame from '../components/MemoryGame'
import { useHippo } from '../context/HippoContext'
import { getAssetPath } from '../utils/assetPath'
import './GamesPage.css'

const GAMES = [
  {
    id: 'bubble',
    title: 'Лопай пузыри',
    icon: getAssetPath('/models/models/icons/games/bubble_icon.png'),
    energyCost: 20,
  },
  {
    id: 'diceGuess',
    title: 'Угадай число',
    icon: getAssetPath('/models/models/icons/games/number icon.png'),
    energyCost: 20,
  },
  {
    id: 'memory',
    title: 'Игра на память',
    icon: getAssetPath('/models/models/icons/games/logic icon.png'),
    energyCost: 20,
  },
  {
    id: 'comingSoon',
    title: 'Скоро...',
    icon: getAssetPath('/models/models/icons/games/coming soon.png'),
    energyCost: 20,
    isComingSoon: true,
  },
]

export default function GamesPage() {
  const { hippo, addCoins, updateStats } = useHippo()
  const [activeGame, setActiveGame] = useState<'memory' | 'bubble' | 'diceGuess' | null>(null)
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [backgroundImage, setBackgroundImage] = useState('/screens/screens/Main/real_fon.png')

  const currentEnergy = hippo?.stats.energy || 0
  const currentGame = GAMES[currentGameIndex]

  const getBackgroundByTime = useCallback(() => {
    const now = new Date()
    const hours = now.getHours()
    if (hours >= 5 && hours < 17) {
      return '/screens/screens/Main/real_fon.png'
    }
    if (hours >= 17 && hours < 22) {
      return '/screens/screens/Main/evening_fon.png'
    }
    return '/screens/screens/Main/night_fon.png'
  }, [])

  useEffect(() => {
    setBackgroundImage(getBackgroundByTime())
    const interval = setInterval(() => {
      setBackgroundImage(getBackgroundByTime())
    }, 60000)
    return () => clearInterval(interval)
  }, [getBackgroundByTime])

  const handleGameStart = () => {
    if (currentEnergy < 20) {
      alert('😴 Бегемотик устал! Нужно 20% энергии для игры')
      return
    }
    if (currentGame.id === 'memory') {
      setActiveGame('memory')
    } else if (currentGame.id === 'bubble') {
      setActiveGame('bubble')
    } else if (currentGame.id === 'diceGuess') {
      setActiveGame('diceGuess')
    }
  }

  const handleGameEnd = (score: number) => {
    setActiveGame(null)
    if (score > 0) {
      updateStats({
        happiness: Math.min(100, (hippo?.stats.happiness || 0) + 10),
        energy: Math.max(0, currentEnergy - 20),
        satiety: Math.max(0, (hippo?.stats.satiety || 0) - 5),
        thirst: Math.max(0, (hippo?.stats.thirst || 0) - 5),
      })
      const coinsBonus = Math.floor(score / 20)
      addCoins(15 + coinsBonus)
    }
  }

  const handleGameClose = () => {
    setActiveGame(null)
  }

  const handlePrevious = () => {
    setCurrentGameIndex((prev) => (prev - 1 + GAMES.length) % GAMES.length)
  }

  const handleNext = () => {
    setCurrentGameIndex((prev) => (prev + 1) % GAMES.length)
  }

  if (activeGame === 'memory') {
    return <MemoryGame onGameEnd={handleGameEnd} onClose={handleGameClose} />
  }

  if (activeGame === 'bubble') {
    return <BubbleGame onGameEnd={handleGameEnd} onClose={handleGameClose} />
  }

  if (activeGame === 'diceGuess') {
    return <DiceGuessGame onGameEnd={handleGameEnd} onClose={handleGameClose} />
  }

  return (
    <div className="games-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="games-header">
        <h1 className="games-title">Мини-игры</h1>
      </div>

      <div className="games-content">
        <div className="energy-bar-card">
          <img src={getAssetPath("/models/models/icons/stats/energy.png")} alt="energy" className="energy-icon" />
          <div className="energy-bar-wrapper">
            <div className="energy-bar-bg">
              <div 
                className="energy-bar-fill" 
                style={{ 
                  width: `${currentEnergy}%`,
                  backgroundColor: currentEnergy >= 50 ? '#4CD964' : currentEnergy >= 20 ? '#FFD60A' : '#FF3B30'
                }}
              />
            </div>
            <span className="energy-text">{Math.round(currentEnergy)} / 100</span>
          </div>
        </div>

        {!currentGame.isComingSoon ? (
          <div className="game-card">
            <div className="game-icon-wrapper">
              <img src={currentGame.icon} alt={currentGame.title} className="game-icon" />
            </div>
            <div className="game-card-content">
              <h2 className="game-title">{currentGame.title}</h2>
              <div className="game-cost">
                <img src={getAssetPath("/models/models/icons/stats/energy.png")} alt="energy" className="cost-icon" />
                <span className="cost-text" style={{ color: currentEnergy >= 20 ? '#4CD964' : '#FF3B30' }}>
                  {currentGame.energyCost} энергии
                </span>
              </div>
              <button 
                className="play-button"
                onClick={handleGameStart}
                disabled={currentEnergy < 20}
              >
                <img 
                  src={currentEnergy >= 20 ? '/models/models/icons/buttons/arrows/green_button.png' : '/models/models/icons/buttons/arrows/grey_button.png'} 
                  alt="play" 
                  className="play-button-img" 
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="game-card coming-soon">
            <div className="game-icon-wrapper">
              <img src={currentGame.icon} alt={currentGame.title} className="game-icon" />
            </div>
            <div className="game-card-content">
              <h2 className="game-title">Скоро...</h2>
              <p className="coming-soon-text">Новая игра уже в разработке!</p>
            </div>
          </div>
        )}

        <div className="indicators">
          {GAMES.map((_, index) => (
            <div 
              key={index} 
              className={`indicator ${index === currentGameIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="navigation-arrows">
        <button className="arrow-button" onClick={handlePrevious}>
          <img src={getAssetPath("/models/models/icons/buttons/arrows/left_extended.png")} alt="previous" className="arrow-img" />
        </button>
        <button className="arrow-button" onClick={handleNext}>
          <img src={getAssetPath("/models/models/icons/buttons/arrows/right_extended.png")} alt="next" className="arrow-img" />
        </button>
      </div>
    </div>
  )
}
