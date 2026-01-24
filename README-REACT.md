# Tamagotchi - React версия

Это переписанная версия проекта на чистом React (без React Native/Expo).

## Установка и запуск

### 1. Установите зависимости

```bash
# Сначала переименуйте package-react.json в package.json
mv package-react.json package.json

# Установите зависимости
npm install
```

### 2. Запустите проект

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранной версии
npm run preview
```

### 3. Деплой на GitHub Pages

```bash
npm run deploy
```

## Структура проекта

```
src/
├── context/          # React Context (HippoContext)
├── pages/            # Страницы приложения
│   ├── HomePage.tsx
│   ├── OnboardingPage.tsx
│   ├── TabsLayout.tsx
│   ├── ExplorePage.tsx
│   ├── GamesPage.tsx
│   ├── ShopPage.tsx
│   └── StatsPage.tsx
├── types/            # TypeScript типы
├── utils/            # Утилиты (storage)
├── App.tsx           # Главный компонент с роутингом
├── main.tsx          # Точка входа
└── index.css         # Глобальные стили
```

## Основные изменения

### Что было заменено:

1. **Expo Router** → **React Router DOM**
2. **React Native компоненты** → **HTML элементы**
   - `View` → `div`
   - `Text` → `span`, `p`, `h1`, etc.
   - `TouchableOpacity` → `button`
   - `TextInput` → `input`
   - `Image` → `img`
   - `ImageBackground` → `div` с `background-image`
   - `Modal` → кастомный модальный компонент
3. **AsyncStorage** → **localStorage**
4. **Expo Font** → обычные веб-шрифты
5. **React Native StyleSheet** → **CSS файлы**

### Что нужно доработать:

1. Добавить компонент HippoView (визуализация бегемотика)
2. Реализовать мини-игры
3. Добавить магазин с одеждой
4. Скопировать изображения из папки `assets/` и `screens/`
5. Добавить анимации (можно использовать CSS или библиотеки типа Framer Motion)

## Технологии

- React 18
- TypeScript
- React Router DOM
- Vite
- CSS Modules

## Браузерная совместимость

Проект работает во всех современных браузерах (Chrome, Firefox, Safari, Edge).
