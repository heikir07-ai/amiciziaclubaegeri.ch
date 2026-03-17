import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyPublicDirSafely() {
  return {
    name: 'copy-public-safe',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const outDir = path.resolve(__dirname, 'dist');

      function copyDirSafe(src: string, dest: string) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
          const srcPath = path.join(src, entry);
          const destPath = path.join(dest, entry);
          const stat = fs.statSync(srcPath);
          if (stat.isDirectory()) {
            copyDirSafe(srcPath, destPath);
          } else {
            try {
              fs.copyFileSync(srcPath, destPath);
            } catch {
              // skip files that cannot be copied
            }
          }
        }
      }

      copyDirSafe(publicDir, outDir);
    },
  };
}

export default defineConfig({
  plugins: [react(), copyPublicDirSafely()],
  build: {
    copyPublicDir: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
