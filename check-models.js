const https = require('https');
const options = {
  hostname: 'api.cerebras.ai',
  port: 443,
  path: '/v1/models',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + process.env.CEREBRAS_API_KEY
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});
req.on('error', error => {
  console.error(error);
});
req.end();
