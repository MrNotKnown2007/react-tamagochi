import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '../components/CircularProgress'
import HippoView from '../components/HippoView'
import { useHippo } from '../context/HippoContext'
import { getAssetPath } from '../utils/assetPath'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { hippo, feed, clean, sleep, giveWater, resetHippo } = useHippo()
  const [hippoName, setHippoName] = useState('Бегемотик')
  const [editingName, setEditingName] = useState('')
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [hippoMood, setHippoMood] = useState<'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water'>('default')
  const [backgroundImage, setBackgroundImage] = useState(getAssetPath('/screens/screens/Main/real_fon.png'))

  const getBackgroundByTime = useCallback(() => {
    const now = new Date()
    const hours = now.getHours()
    if (hours >= 5 && hours < 17) {
      return getAssetPath('/screens/screens/Main/real_fon.png')
    }
    if (hours >= 17 && hours < 22) {
      return getAssetPath('/screens/screens/Main/evening_fon.png')
    }
    return getAssetPath('/screens/screens/Main/night_fon.png')
  }, [])

  useEffect(() => {
    setBackgroundImage(getBackgroundByTime())
    const interval = setInterval(() => {
      setBackgroundImage(getBackgroundByTime())
    }, 60000)
    return () => clearInterval(interval)
  }, [getBackgroundByTime])

  useEffect(() => {
    if (hippo?.name) {
      setHippoName(hippo.name)
      setEditingName(hippo.name)
    }
  }, [hippo])

  const setTemporaryMood = useCallback((mood: 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water') => {
    setHippoMood(mood)
    const timeout = mood === 'sleep' ? 20000 : 5000
    setTimeout(() => {
      setHippoMood('default')
    }, timeout)
  }, [])

  const handleOpenSettings = () => {
    setEditingName(hippoName)
    setSettingsModalVisible(true)
  }

  const handleSaveName = async () => {
    if (!editingName.trim()) {
      alert('Имя не может быть пустым')
      return
    }
    setHippoName(editingName.trim())
    setSettingsModalVisible(false)
  }

  const handleResetHippo = () => {
    if (window.confirm('Вы уверены? Это удалит текущего бегемотика и все его данные.')) {
      resetHippo()
      navigate('/onboarding')
    }
  }

  const handlePlay = () => {
    navigate('/tabs/games')
  }

  const handleFeed = () => {
    setTemporaryMood('hunger')
    feed()
  }

  const handleClean = () => {
    setTemporaryMood('bath')
    clean()
  }

  const handleSleep = () => {
    setTemporaryMood('sleep')
    sleep()
  }

  const handleWater = () => {
    setTemporaryMood('water')
    giveWater()
  }

  return (
    <div className="home-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button className="settings-button" onClick={handleOpenSettings}>
        ⚙️
      </button>

      <div className="coin-container">
        <img src={getAssetPath('/models/models/icons/stats/money.png')} alt="coins" className="coin-icon-img" />
        <span className="coin-text">{hippo?.coins || 0}</span>
      </div>

      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">{hippoName}</h1>
        </div>

        <div className="hippo-container">
          {hippo && (
            <HippoView 
              mood={hippoMood}
              size="medium"
              age={hippo.age}
              gender={hippo.gender}
              costume={hippo.outfit?.costume}
              head={hippo.outfit?.head}
              upper={hippo.outfit?.upper}
            />
          )}
        </div>

        <div className="action-buttons-container">
          <div className="button-with-stats">
            <CircularProgress value={hippo?.stats.satiety || 0} color="#FF9800" size={50} />
            <button className="circle-button" onClick={handleFeed}>
              <img src={getAssetPath('/assets/images/eat_button.png')} alt="feed" className="button-image" />
            </button>
          </div>

          <div className="button-with-stats">
            <CircularProgress value={hippo?.stats.cleanliness || 0} color="#2196F3" size={50} />
            <button className="circle-button" onClick={handleClean}>
              <img src={getAssetPath('/assets/images/bath_button.png')} alt="clean" className="button-image" />
            </button>
          </div>

          <div className="button-with-stats">
            <CircularProgress value={hippo?.stats.happiness || 0} color="#E91E63" size={50} />
            <button className="circle-button" onClick={handlePlay}>
              <img src={getAssetPath('/assets/images/talk_button.png')} alt="play" className="button-image" />
            </button>
          </div>

          <div className="button-with-stats">
            <CircularProgress value={hippo?.stats.energy || 0} color="#9C27B0" size={50} />
            <button className="circle-button" onClick={handleSleep}>
              <img src={getAssetPath('/assets/images/sleep_button.png')} alt="sleep" className="button-image" />
            </button>
          </div>

          <div className="button-with-stats">
            <CircularProgress value={hippo?.stats.thirst || 0} color="#00BCD4" size={50} />
            <button className="circle-button" onClick={handleWater}>
              <img src={getAssetPath('/assets/images/water_button.png')} alt="water" className="button-image" />
            </button>
          </div>
        </div>
      </div>

      {settingsModalVisible && (
        <div className="modal-overlay" onClick={() => setSettingsModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Настройки</h2>
            <div className="setting-section">
              <label className="setting-label">Имя бегемотика:</label>
              <input
                className="setting-input"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                maxLength={20}
                placeholder="Введите имя"
              />
            </div>
            <div className="button-row">
              <button className="modal-button" onClick={() => setSettingsModalVisible(false)}>
                Отмена
              </button>
              <button className="modal-button save-button" onClick={handleSaveName}>
                Сохранить
              </button>
            </div>
            <button className="reset-button" onClick={handleResetHippo}>
              🔄 Сбросить бегемотика
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
