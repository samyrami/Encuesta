#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Sustainability Assessment App...');

// Ensure we're in the correct directory
process.chdir(__dirname);

// Get port from environment or default to 3000
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

console.log(`📡 Starting server on ${host}:${port}`);

// Start the Vite preview server
const command = `npx vite preview --host ${host} --port ${port}`;

const child = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error starting server: ${error.message}`);
    process.exit(1);
  }
  if (stderr && !stderr.includes('warning')) {
    console.error(`⚠️ Server stderr: ${stderr}`);
  }
});

child.stdout.on('data', (data) => {
  console.log(`📊 ${data}`);
});

child.stderr.on('data', (data) => {
  if (!data.includes('warning') && !data.includes('npm warn')) {
    console.error(`🔍 ${data}`);
  }
});

child.on('close', (code) => {
  console.log(`🔚 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  child.kill();
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  child.kill();
});