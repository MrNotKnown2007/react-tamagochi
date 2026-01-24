import { useHippo } from '../context/HippoContext'
import './StatsPage.css'

export default function StatsPage() {
  const { hippo } = useHippo()

  if (!hippo) return null

  return (
    <div className="stats-page">
      <h1>📊 Статистика</h1>
      
      <div className="stats-section">
        <h2>Характеристики</h2>
        <div className="stat-item">
          <span>❤️ Здоровье:</span>
          <span>{Math.round(hippo.stats.health)}%</span>
        </div>
        <div className="stat-item">
          <span>🍔 Сытость:</span>
          <span>{Math.round(hippo.stats.satiety)}%</span>
        </div>
        <div className="stat-item">
          <span>😊 Счастье:</span>
          <span>{Math.round(hippo.stats.happiness)}%</span>
        </div>
        <div className="stat-item">
          <span>🛁 Чистота:</span>
          <span>{Math.round(hippo.stats.cleanliness)}%</span>
        </div>
        <div className="stat-item">
          <span>⚡ Энергия:</span>
          <span>{Math.round(hippo.stats.energy)}%</span>
        </div>
        <div className="stat-item">
          <span>💧 Жажда:</span>
          <span>{Math.round(hippo.stats.thirst)}%</span>
        </div>
      </div>

      <div className="stats-section">
        <h2>Действия</h2>
        <div className="stat-item">
          <span>🍔 Покормлен:</span>
          <span>{hippo.feedCount} раз</span>
        </div>
        <div className="stat-item">
          <span>🛁 Помыт:</span>
          <span>{hippo.cleanCount} раз</span>
        </div>
        <div className="stat-item">
          <span>🎮 Игр:</span>
          <span>{hippo.playCount} раз</span>
        </div>
        <div className="stat-item">
          <span>😴 Спал:</span>
          <span>{hippo.sleepCount} раз</span>
        </div>
        <div className="stat-item">
          <span>💧 Напоен:</span>
          <span>{hippo.waterCount} раз</span>
        </div>
      </div>

      <div className="stats-section">
        <h2>Игры</h2>
        <div className="stat-item">
          <span>🎮 Всего игр:</span>
          <span>{hippo.gameStats.totalGamePlays}</span>
        </div>
        <div className="stat-item">
          <span>💰 Заработано монет:</span>
          <span>{hippo.gameStats.totalCoinsEarned}</span>
        </div>
      </div>
    </div>
  )
}
