// Утилита для правильной загрузки ассетов на GitHub Pages
export function getAssetPath(path: string): string {
  if (typeof window !== 'undefined' && window.getAssetPath) {
    return window.getAssetPath(path);
  }
  // Fallback
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
}
