# Деплой на GitHub Pages

## Шаги для деплоя:

### 1. Убедись что у тебя есть репозиторий на GitHub
Репозиторий должен называться: `tamagochi`

### 2. Инициализируй git (если еще не сделано)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/mrnotknown2007/tamagochi.git
git push -u origin main
```

### 3. Запусти деплой
```bash
npm run deploy
```

Эта команда:
- Соберет проект для веба (`expo export -p web`)
- Создаст `.nojekyll` файл в папке `dist`
- Загрузит содержимое папки `dist` в ветку `gh-pages`

### 4. Настрой GitHub Pages
1. Зайди в настройки репозитория на GitHub
2. Перейди в раздел **Pages**
3. В разделе **Source** выбери ветку `gh-pages` и папку `/ (root)`
4. Нажми **Save**

### 5. Подожди несколько минут
GitHub Pages обработает твой сайт и он будет доступен по адресу:
**https://mrnotknown2007.github.io/tamagochi**

## Обновление сайта

Когда внесешь изменения в код:
```bash
git add .
git commit -m "Описание изменений"
git push
npm run deploy
```

## Проверка локально

Перед деплоем можешь проверить сборку локально:
```bash
npm run build:web
npx serve dist
```

Затем открой http://localhost:3000/tamagochi в браузере.
