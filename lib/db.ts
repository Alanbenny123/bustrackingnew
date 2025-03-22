import mongoose from "mongoose";

let client: typeof mongoose | null = null;

async function connectDB() {
  if (!client) {
    client = await mongoose.connect(process.env.MONGODB_URI as string);
  }
  return client;
}

export default connectDB;
