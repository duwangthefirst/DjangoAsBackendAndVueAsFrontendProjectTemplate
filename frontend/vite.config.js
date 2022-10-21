import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // add the following for integration with django
    publicDir: "../backend/staticfiles/frontend",
    build: {
        emptyOutDir: false,
        rollupOptions: {
            output: {
                dir: "../backend/staticfiles/frontend"
            }
        }
    }
})
