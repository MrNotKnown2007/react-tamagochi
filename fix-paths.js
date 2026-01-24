// Скрипт для исправления путей к изображениям на GitHub Pages
(function() {
  const BASE_PATH = '/react-tamagochi';
  
  // Исправляем все img src
  function fixImagePaths() {
    const images = document.querySelectorAll('img[src^="/"]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/') && !src.startsWith(BASE_PATH)) {
        img.setAttribute('src', BASE_PATH + src);
      }
    });
  }
  
  // Исправляем background-image в стилях
  function fixBackgroundImages() {
    const elements = document.querySelectorAll('[style*="background-image"]');
    elements.forEach(el => {
      const style = el.getAttribute('style');
      if (style && style.includes('url("/')) {
        const newStyle = style.replace(/url\("\/(?!react-tamagochi)/g, `url("${BASE_PATH}/`);
        el.setAttribute('style', newStyle);
      }
    });
  }
  
  // Запускаем при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixImagePaths();
      fixBackgroundImages();
    });
  } else {
    fixImagePaths();
    fixBackgroundImages();
  }
  
  // Наблюдаем за изменениями DOM
  const observer = new MutationObserver(() => {
    fixImagePaths();
    fixBackgroundImages();
  });
  
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
