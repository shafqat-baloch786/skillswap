const multer = require('multer');

// Using memory storage to handle file buffers
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit 2MB
});

module.exports = upload;