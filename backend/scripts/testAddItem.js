const axios = require('axios');
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

async function run() {
  const jar = new tough.CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  try {
    const login = await client.post('http://localhost:5000/api/users/login', {
      email: 'admin@booktrove.com',
      password: 'AdminPassword123'
    });
    console.log('login ok', login.data);

    const add = await client.post('http://localhost:5000/api/items', {
      titulli: 'Test Script Book',
      autori: 'Script Author',
      cmimi: 5.99,
      kategoria: 'Fantazi',
      imazhi: 'https://via.placeholder.com/150'
    });
    console.log('added item', add.data);

    const list = await client.get('http://localhost:5000/api/items');
    console.log('items now', list.data);
  } catch (err) {
    console.error('error', err.response ? err.response.data : err.message);
  }
}

run();
