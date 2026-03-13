const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'debug.log');

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, logLine);
  console.log(message); // Also log to console
};

const clearLog = () => {
  fs.writeFileSync(logPath, '');
};

module.exports = { log, clearLog };
