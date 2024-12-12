import express from "express";
import ConnectDB from "./database/db.js";
import dotenv from "dotenv";
import auth_routes from "./routes/user-routes.js";
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api", auth_routes);
app.listen(3000, () => {
  console.log("Server is running on the port 3000");
  ConnectDB();
});
