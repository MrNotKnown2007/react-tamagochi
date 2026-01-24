/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // добавьте другие env переменные здесь
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
