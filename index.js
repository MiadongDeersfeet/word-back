const dns = require('dns');
dns.setServers(['8.8.8.8']); 

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const wordRoutes = require("./routes/wordRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGINS ||
  "http://127.0.0.1:5173,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalhostOrigin(origin) {
  try {
    const parsed = new URL(origin);
    return (
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
      (parsed.protocol === "http:" || parsed.protocol === "https:")
    );
  } catch (error) {
    return false;
  }
}

function isVercelOrigin(origin) {
  try {
    const parsed = new URL(origin);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".vercel.app");
  } catch (error) {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin (e.g. Postman/curl)
      if (
        !origin ||
        CLIENT_ORIGINS.includes(origin) ||
        isLocalhostOrigin(origin) ||
        isVercelOrigin(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS 허용되지 않은 출처입니다."));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/words", wordRoutes);

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI가 .env 파일에 설정되지 않았습니다.");
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB 연결 성공: 연결 성공");
  console.log(`연결 DB: ${mongoose.connection.name} @ ${mongoose.connection.host}`);
};

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
};

startServer();
