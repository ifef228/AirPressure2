#!/usr/bin/env node

/**
 * Скрипт для автоматического определения IP адреса локальной сети
 * Использование: node scripts/detect-ip.js
 */

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  // Приоритет интерфейсов (Wi-Fi обычно en0 на Mac, wlan0 на Linux)
  const priorityInterfaces = ['en0', 'en1', 'wlan0', 'eth0', 'Ethernet'];

  // Сначала ищем по приоритету
  for (const ifaceName of priorityInterfaces) {
    const iface = interfaces[ifaceName];
    if (iface) {
      for (const addr of iface) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return addr.address;
        }
      }
    }
  }

  // Если не нашли, ищем любой IPv4 адрес
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
}

const ip = getLocalIP();
const port = process.env.PORT || '8080';
const apiPath = '/api';

console.log('\n🌐 Обнаружен IP адрес локальной сети:\n');
console.log(`   IP: ${ip}`);
console.log(`   API URL: http://${ip}:${port}${apiPath}`);
console.log(`\n📝 Добавьте в .env.local:\n`);
console.log(`   VITE_API_BASE_URL=http://${ip}:${port}${apiPath}\n`);
console.log('💡 Или для HTTPS:\n');
console.log(`   VITE_API_BASE_URL=https://${ip}:8443${apiPath}\n`);

// Экспортируем для использования в других скриптах
if (require.main === module) {
  process.exit(0);
} else {
  module.exports = { getLocalIP };
}
