import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})

//este arquivo visa importar as configuracoes definidas no tsconfig.json nas
//configuracoes do paths, onde tem o '@/*'.