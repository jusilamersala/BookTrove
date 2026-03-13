const http = require('http');

// require server to start it in same process
require('./server');

setTimeout(() => {
  const data = JSON.stringify({
    username: 'booktroveemployee',
    email: 'employee@booktrove.com',
    password: 'EmployeePassword123',
    role: 'employee'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    res.on('data', chunk => process.stdout.write(chunk));
    res.on('end', () => {
      console.log('\n✅ Employee user creation response complete');
      setTimeout(() => process.exit(0), 4000);
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e);
    setTimeout(() => process.exit(1), 1000);
  });

  req.write(data);
  req.end();
}, 2000);
