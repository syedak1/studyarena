import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import resourcesRoutes from "./routes/resources";

console.log("starting server");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resources", resourcesRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});