// Утилита для правильной загрузки ассетов на GitHub Pages
export function getAssetPath(path: string): string {
  // Для веба с basePath
  if (typeof window !== 'undefined') {
    // Убираем начальный слеш если есть
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Используем import.meta.env.BASE_URL из Vite
    const base = import.meta.env.BASE_URL || '/';
    return `${base}${cleanPath}`.replace(/\/+/g, '/');
  }
  // Для нативных платформ используем require
  return path;
}

// Для использования с require
export function getAssetSource(requirePath: any): any {
  return requirePath;
}
