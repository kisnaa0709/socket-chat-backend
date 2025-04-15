require('dotenv').config();
const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        const dbURI = process.env.MONGODB_URI; // Load from environment variables
        if (!dbURI) {
            console.error('MongoDB URI is missing!');
            process.exit(1); // Exit the process if the URI is missing
        }
        console.log("Connecting to MongoDB with URI:", dbURI);
        await mongoose.connect(dbURI, {
            connectTimeoutMS: 200000,
            socketTimeoutMS: 2000000,
            useNewUrlParser: true,
            dbName: process.env.DB_NAME,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = { connectToDatabase };
