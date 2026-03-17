const http = require('http');

const loginData = JSON.stringify({
  email: 'admin@booktrove.com',
  password: 'AdminPassword123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    const token = data.token;
    console.log('Logged in, token length:', token?.length);

    const employeesOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/employees',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const empReq = http.request(employeesOptions, (res2) => {
      let empBody = '';
      res2.on('data', (chunk) => empBody += chunk);
      res2.on('end', () => {
        console.log('Employees status', res2.statusCode);
        console.log(empBody);
      });
    });

    empReq.on('error', (e) => console.error('Error fetching employees', e));
    empReq.end();
  });
});

loginReq.on('error', (e) => console.error('Login error', e));
loginReq.write(loginData);
loginReq.end();
