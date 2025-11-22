#!/usr/bin/env node

/**
 * Скрипт для определения названия репозитория из git remote
 * Использование: node scripts/get-repo-name.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function getRepoName() {
  try {
    // Переходим в корень проекта (на уровень выше atmosphere-calculator)
    const projectRoot = path.resolve(__dirname, '../..');
    process.chdir(projectRoot);
    
    // Получаем URL remote репозитория
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    
    // Извлекаем название репозитория из URL
    // Формат: https://github.com/username/repo.git или git@github.com:username/repo.git
    const match = remoteUrl.match(/(?:github\.com[:/])([^/]+)\/([^/]+?)(?:\.git)?$/);
    
    if (match && match[2]) {
      return match[2];
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при определении названия репозитория:', error.message);
    return null;
  }
}

const repoName = getRepoName();

if (repoName) {
  console.log(repoName);
  process.exit(0);
} else {
  console.error('Не удалось определить название репозитория');
  process.exit(1);
}

