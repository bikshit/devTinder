const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:38mXZ20vbgUz81Nz@namastenode.88eki.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
