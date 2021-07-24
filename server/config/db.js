const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const database = await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log(`MongoDB connected: ${process.env.ATLAS_URI}`);
  } catch (error) {
    console.log(process.env.ATLAS_URI, error);
    console.log(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;