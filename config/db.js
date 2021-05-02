const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connectDB = async () => {
    const conn = await mongoose.connect('mongodb://localhost:27017/mongoose_masterclass', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
