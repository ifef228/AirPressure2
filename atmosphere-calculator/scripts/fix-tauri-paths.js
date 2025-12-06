#!/usr/bin/env node

/**
 * Скрипт для исправления путей в dist/index.html для Tauri
 * Заменяет абсолютные пути на относительные
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(distIndexPath)) {
  console.error('❌ Файл dist/index.html не найден!');
  process.exit(1);
}

console.log('🔧 Исправление путей в dist/index.html для Tauri...');

let content = fs.readFileSync(distIndexPath, 'utf8');

// Заменяем абсолютные пути на относительные
// /assets/... -> ./assets/...
// /manifest.json -> ./manifest.json
// /logo.svg -> ./logo.svg
// /logo192.png -> ./logo192.png

content = content.replace(/href="\/([^"]+)"/g, (match, path) => {
  // Пропускаем пути, которые уже относительные или абсолютные URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('./') || path.startsWith('../')) {
    return match;
  }
  return `href="./${path}"`;
});

content = content.replace(/src="\/([^"]+)"/g, (match, path) => {
  // Пропускаем пути, которые уже относительные или абсолютные URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('./') || path.startsWith('../')) {
    return match;
  }
  return `src="./${path}"`;
});

fs.writeFileSync(distIndexPath, content, 'utf8');

console.log('✅ Пути исправлены!');
console.log('📝 Обновленный файл:', distIndexPath);
