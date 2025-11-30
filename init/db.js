module.exports = (app, callback) => {
    const CONFIG = require('../config/config');
    //Connect to DB
    const mongoose = require('mongoose');
    // Mongoose 8.x handles reconnection automatically
    // Deprecated options removed: reconnectTries, autoReconnect, useNewUrlParser, useUnifiedTopology, useFindAndModify
    global.mongoConnection = mongoose.createConnection(CONFIG.mongodb.uri, {
        serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    
    global.mongoConnection.on('connected', () => {
        console.log('---Connected to DB');
        callback();
    });
    
    global.mongoConnection.on('error', (error) => {
        console.error('---DB Connection Error:', error.message);
        throw error;
    });
    
    // Handle connection timeout
    setTimeout(() => {
        if (global.mongoConnection.readyState !== 1) {
            console.error('---DB Connection timeout. Is MongoDB running on', CONFIG.mongodb.uri, '?');
            process.exit(1);
        }
    }, 10000); // 10 second timeout
}