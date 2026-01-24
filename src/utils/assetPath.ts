// Утилита для правильной загрузки ассетов на GitHub Pages
const BASE_URL = import.meta.env.BASE_URL || '/';

export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`.replace(/\/+/g, '/');
}
