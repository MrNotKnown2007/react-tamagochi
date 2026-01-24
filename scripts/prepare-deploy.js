const fs = require('fs');
const path = require('path');

// Пути
const distPath = path.join(__dirname, '..', 'dist');
const nojekyllPath = path.join(distPath, '.nojekyll');
const public404Path = path.join(__dirname, '..', 'public', '404.html');
const dist404Path = path.join(distPath, '404.html');

if (fs.existsSync(distPath)) {
  // Создаем .nojekyll
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ .nojekyll файл создан в dist/');
  
  // Копируем 404.html
  if (fs.existsSync(public404Path)) {
    fs.copyFileSync(public404Path, dist404Path);
    console.log('✅ 404.html скопирован в dist/');
  }
  
  // Исправляем двойной assets путь (баг Expo с basePath)
  const assetsAssetsPath = path.join(distPath, 'assets', 'assets');
  const assetsPath = path.join(distPath, 'assets');
  
  if (fs.existsSync(assetsAssetsPath)) {
    console.log('🔧 Исправляем структуру assets...');
    
    // Копируем содержимое из assets/assets в корень assets
    function copyRecursive(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    // Копируем файлы
    const items = fs.readdirSync(assetsAssetsPath);
    items.forEach(item => {
      const srcPath = path.join(assetsAssetsPath, item);
      const destPath = path.join(assetsPath, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
    
    console.log('✅ Структура assets исправлена');
  }
  
  // Добавляем скрипт для GitHub Pages SPA в HTML файлы
  function addSpaScript(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Добавляем скрипт для GitHub Pages SPA если его еще нет
    if (!content.includes('GitHub Pages SPA redirect hack')) {
      const scriptToAdd = `
    <!-- GitHub Pages SPA redirect hack -->
    <script type="text/javascript">
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>`;
      
      content = content.replace('</head>', scriptToAdd + '\n  </head>');
    }
    
    fs.writeFileSync(filePath, content);
  }
  
  // Обрабатываем все HTML файлы
  function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        addSpaScript(filePath);
        console.log(`✅ Обработан: ${path.relative(distPath, filePath)}`);
      }
    });
  }
  
  processHtmlFiles(distPath);
  
  console.log('✅ Подготовка к деплою завершена!');
} else {
  console.error('❌ Папка dist не найдена. Сначала выполните сборку.');
  process.exit(1);
}
