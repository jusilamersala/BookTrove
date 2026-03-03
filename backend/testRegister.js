const http = require('http');

// require server to start it in same process
require('./server');

setTimeout(() => {
  const data = JSON.stringify({
    username: 'debuguser',
    email: 'debuguser@example.com',
    password: 'password123',
    role: 'user'
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
    console.log('status', res.statusCode);
    res.on('data', chunk => process.stdout.write(chunk));
    res.on('end', () => {
      console.log('response end');
      // keep process alive a bit to capture server logs
      setTimeout(() => process.exit(0), 4000);
    });
  });

  req.on('error', (e) => {
    console.error('request error', e);
    setTimeout(() => process.exit(1), 1000);
  });

  req.write(data);
  req.end();
}, 2000);
