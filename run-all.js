/**
 * Unified Concurrent Process Runner
 * Starts the Express API Gateway (:5000) and the Vite React Frontend (:3000) simultaneously.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('  CareSync: Healthcare Platform & High-Level System Design (HLD)');
console.log('================================================================');
console.log('Starting Express API Gateway (:5000) and Vite React (:3000)...');
console.log('================================================================\n');

// 1. Start Backend Server
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Server
const frontend = spawn('npx', ['vite', '--port', '3000', '--host'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
