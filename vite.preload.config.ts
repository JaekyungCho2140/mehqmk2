import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Lessons Learned: 기본값 index.js는 main과 충돌하므로 명시 필수
        entryFileNames: 'preload.js',
      },
      external: ['electron'],
    },
  },
});
