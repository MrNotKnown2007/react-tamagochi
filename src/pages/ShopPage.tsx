import { useState } from 'react'
import HippoView from '../components/HippoView'
import { useHippo } from '../context/HippoContext'
import './ShopPage.css'

const categories = [
  { id: 'head', name: 'Головной убор', icon: '/models/models/icons/shop/head.png' },
  { id: 'upper', name: 'Верх', icon: '/models/models/icons/shop/body.png' },
  { id: 'lower', name: 'Низ', icon: '/models/models/icons/shop/pants.png' },
  { id: 'feet', name: 'Обувь', icon: '/models/models/icons/shop/shoes.png' },
  { id: 'costume', name: 'Костюмы', icon: '/models/models/icons/shop/costumes.png' },
]

export default function ShopPage() {
  const { hippo, buyItem, equipItem, unequipItem, getAvailableItems } = useHippo()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentItemIndex(0)
  }

  const handleCloseModal = () => {
    setSelectedCategory(null)
    setCurrentItemIndex(0)
  }

  const items = selectedCategory 
    ? getAvailableItems().filter(item => {
        if (item.category !== selectedCategory) return false
        if (item.ageRestriction && item.ageRestriction !== hippo?.age) return false
        return true
      })
    : []

  const currentItem = items[currentItemIndex]
  const currentOutfit = hippo?.outfit || {}
  const isEquipped = currentItem && currentOutfit[selectedCategory as keyof typeof currentOutfit] === currentItem.id
  const isUnlocked = currentItem?.unlocked

  const handleBuyItem = () => {
    if (!currentItem) return
    if ((hippo?.coins || 0) < currentItem.price) {
      alert(`Недостаточно монет! Нужно еще ${currentItem.price - (hippo?.coins || 0)} монет`)
      return
    }
    buyItem(currentItem.id)
  }

  const handleEquipItem = () => {
    if (!currentItem) return
    if (isEquipped) {
      unequipItem(selectedCategory as any)
    } else {
      equipItem(currentItem.id)
    }
  }

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  const handleNextItem = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    }
  }

  return (
    <div className="shop-page">
      <button className="back-button" onClick={() => window.history.back()}>
        <img src="/models/models/icons/buttons/arrows/left_casual.png" alt="back" className="back-icon" />
      </button>

      <div className="coin-display">
        <img src="/models/models/icons/stats/money.png" alt="coins" className="coin-icon" />
        <span className="coin-amount">{hippo?.coins || 0}</span>
      </div>

      <div className="wardrobe-container">
        <div className="hippo-display">
          {hippo && (
            <HippoView 
              mood="default"
              size="medium"
              age={hippo.age}
              gender={hippo.gender}
              costume={hippo.outfit?.costume}
              head={hippo.outfit?.head}
              upper={hippo.outfit?.upper}
            />
          )}
        </div>

        <div className="categories-panel">
          {categories.map((category) => (
            <button
              key={category.id}
              className="category-button"
              onClick={() => handleCategoryClick(category.id)}
            >
              <img src={category.icon} alt={category.name} className="category-icon" />
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {items.length > 0 ? (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <button className="close-button" onClick={handleCloseModal}>✕</button>
                </div>

                <div className="item-display">
                  <div className="item-icon-large">
                    {typeof currentItem?.icon === 'string' && currentItem.icon.startsWith('/') ? (
                      <img src={currentItem.icon} alt={currentItem.name} className="item-img" />
                    ) : (
                      <span className="item-emoji">{currentItem?.icon}</span>
                    )}
                  </div>
                  <h3 className="item-name">{currentItem?.name}</h3>
                  <p className="item-description">{currentItem?.description}</p>

                  {isUnlocked ? (
                    <div className="status-badge unlocked">✓ Куплено</div>
                  ) : (
                    <div className="status-badge price">
                      <img src="/models/models/icons/stats/money.png" alt="price" className="price-icon" />
                      <span>{currentItem?.price}</span>
                    </div>
                  )}
                </div>

                <div className="navigation-container">
                  <button
                    className="nav-arrow"
                    onClick={handlePrevItem}
                    disabled={currentItemIndex === 0}
                  >
                    ←
                  </button>
                  <span className="item-counter">
                    {currentItemIndex + 1} / {items.length}
                  </span>
                  <button
                    className="nav-arrow"
                    onClick={handleNextItem}
                    disabled={currentItemIndex === items.length - 1}
                  >
                    →
                  </button>
                </div>

                <div className="action-buttons">
                  {isUnlocked ? (
                    <button
                      className={`action-btn ${isEquipped ? 'remove-btn' : 'equip-btn'}`}
                      onClick={handleEquipItem}
                    >
                      {isEquipped ? '❌ Снять' : '✅ Надеть'}
                    </button>
                  ) : (
                    <button
                      className="action-btn buy-btn"
                      onClick={handleBuyItem}
                      disabled={(hippo?.coins || 0) < currentItem.price}
                    >
                      🛒 Купить
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Нет предметов</h2>
                  <button className="close-button" onClick={handleCloseModal}>✕</button>
                </div>
                <p className="empty-message">
                  В этой категории нет предметов для вашего возраста
                </p>
                <button className="action-btn" onClick={handleCloseModal}>
                  Закрыть
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
