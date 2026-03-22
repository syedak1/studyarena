import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import resourcesRoutes from "./routes/resources";
import quizRoutes from "./routes/quizzes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resources", resourcesRoutes);
app.use("/api/quiz", quizRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});