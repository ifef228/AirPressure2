#!/usr/bin/env node

/**
 * Скрипт для определения локального IP адреса
 * Использование: node scripts/get-local-ip.js
 */

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Пропускаем внутренние и не-IPv4 адреса
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name: name,
          address: iface.address
        });
      }
    }
  }

  return addresses;
}

const ips = getLocalIP();

if (ips.length === 0) {
  console.log('❌ Локальный IP адрес не найден');
  process.exit(1);
}

console.log('🌐 Найденные локальные IP адреса:');
console.log('');
ips.forEach((ip, index) => {
  console.log(`  ${index + 1}. ${ip.name}: ${ip.address}`);
});

console.log('');
console.log('📋 Используйте один из этих IP для настройки бэкенда:');
console.log('');
console.log('1. Обновите atmosphere-calculator/src/main.tsx:');
console.log(`   const backendUrl = 'http://${ips[0].address}:8080';`);
console.log('');
console.log('2. Или установите через localStorage в браузере:');
console.log(`   localStorage.setItem('backend_url', 'http://${ips[0].address}:8080');`);
console.log('   location.reload();');
console.log('');

// Выводим первый найденный IP как рекомендуемый
console.log(`✅ Рекомендуемый IP: ${ips[0].address}`);
console.log(`   Backend URL: http://${ips[0].address}:8080`);



