import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHippo } from '../context/HippoContext'
import { HippoGender } from '../types/hippo'
import './OnboardingPage.css'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useHippo()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<HippoGender>('male')
  const [age, setAge] = useState<'child' | 'parent'>('child')

  const handleNext = () => {
    if (step === 0 && !name.trim()) {
      alert('Введите имя')
      return
    }
    if (step < 2) {
      setStep(step + 1)
    } else {
      completeOnboarding(name, gender, age)
      navigate('/tabs')
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        {step === 0 && (
          <div className="onboarding-step">
            <h1>Как зовут вашего бегемотика?</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              maxLength={20}
              className="onboarding-input"
            />
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-step">
            <h1>Выберите пол</h1>
            <div className="gender-buttons">
              <button
                className={`gender-button ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                👦 Мальчик
              </button>
              <button
                className={`gender-button ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                👧 Девочка
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h1>Выберите возраст</h1>
            <div className="age-buttons">
              <button
                className={`age-button ${age === 'child' ? 'active' : ''}`}
                onClick={() => setAge('child')}
              >
                👶 Малыш
              </button>
              <button
                className={`age-button ${age === 'parent' ? 'active' : ''}`}
                onClick={() => setAge('parent')}
              >
                👨 Взрослый
              </button>
            </div>
          </div>
        )}

        <button className="next-button" onClick={handleNext}>
          {step === 2 ? 'Начать' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
