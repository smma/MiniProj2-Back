const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertSchema = new Schema({
    name: String,
    profession: String,
    yearsOfExperience: {
        type: Number,
        default: 0
    },
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert, expertSchema);