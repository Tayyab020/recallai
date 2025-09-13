const { createServer } = require('@vercel/node');
const app = require('../server/server'); // path to your refactored express app

module.exports = createServer(app);
