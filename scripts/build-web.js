const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

console.log('🚀 Building web version...');

// Удаляем старую папку docs если есть
if (fs.existsSync('docs')) {
  fs.removeSync('docs');
}

// Запускаем сборку
try {
  execSync('npx expo export -p web', { stdio: 'inherit' });
  
  // Переименовываем dist в docs
  if (fs.existsSync('dist')) {
    fs.moveSync('dist', 'docs');
    console.log('✅ dist переименован в docs');
  }
  
  // Создаем .nojekyll файл (важно для GitHub Pages)
  fs.writeFileSync('docs/.nojekyll', '');
  console.log('✅ Создан .nojekyll файл');
  
} catch (error) {
  console.error('❌ Ошибка сборки:', error);
  process.exit(1);
}