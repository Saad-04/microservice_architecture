const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

module.exports = async() => {

    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
    }
 
};

 
