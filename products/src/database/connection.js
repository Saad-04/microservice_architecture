const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose
      .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((data) => {
        console.log(`database connected to ${data.connection.host}`);
      });
  } catch (error) {
    console.log(error.message);
  }
};

// export const connectDb = async () => {
//   try {
//       await mongoose.connect(dbUrl).then((data: any) => {
//           console.log(`database connected to ${data.connection.host}`)
//       })
//   } catch (error: any) {
//       console.log(error.message);
//       setTimeout(connectDb, 2000);
//   }
