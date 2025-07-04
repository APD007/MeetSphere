import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
app.set("port", process.env.PORT || 8000);
app.set("dbUrl", process.env.ATLASDB_URL);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

const start = async (req, res) => {
  try {
    const connection = await mongoose.connect(app.get("dbUrl"));
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server running on http://localhost:${app.get("port")}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

start();
