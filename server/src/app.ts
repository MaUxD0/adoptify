import express from "express";
import cors from "cors";

import petsRoutes from "./modules/pets/pets.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pets", petsRoutes);

export default app;