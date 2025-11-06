require("dotenv").config();

const server = require("./api/server.js");

const port = process.env.DEV_PORT || 5075;
server.listen(port, '0.0.0.0', () => console.log(`\n** Running on port ${port} **\n`));
