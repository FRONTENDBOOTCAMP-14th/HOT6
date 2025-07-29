import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findAllHtmlFiles(directory) {
  const htmlFiles = {};
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.html')) {
        // key는 파일명만 사용 (about.html -> about)
        const key = path.basename(file, '.html');
        htmlFiles[key] = filePath;
      }
    }
  }
  scanDirectory(directory);
  return htmlFiles;
}

export default defineConfig({
  // 기존 설정 유지
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, '/v1'),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        ...findAllHtmlFiles(path.resolve(__dirname, 'src')),
      },
    },
  },
  appType: 'mpa',
});

const filesMap = findAllHtmlFiles(path.resolve(__dirname, 'src'));
console.log('filesMap:', filesMap);
