require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db();
        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
