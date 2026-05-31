import mongoose from "mongoose";

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const connectDB = async () => {
  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);

      console.log("MongoDB Connected");
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.log(error);
        process.exit(1);
      }

      console.log(
        `MongoDB connection failed. Retrying ${attempt}/${maxAttempts}`
      );
      await wait(2000);
    }
  }
};

export default connectDB;
