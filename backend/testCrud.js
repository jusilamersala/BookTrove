const axios = require('axios').default;

(async () => {
  try {
    // login
    const loginRes = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@booktrove.com',
      password: 'AdminPassword123'
    }, { withCredentials: true });
    console.log('login response data', loginRes.data);
    // axios stores cookies automatically in node? need axios-cookiejar-support
  } catch (e) {
    console.error('error', e.message, e.response && e.response.data);
  }
})();