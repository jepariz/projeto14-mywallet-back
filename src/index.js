import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import usersRouters from "./routes/usersRoutes.js"
import entryRoutes from "./routes/entryRoutes.js"

//SCHEMAS   -------------------------------------------------------------

export const userSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string().min(3).required(),
  password: joi.string().alphanum().min(6).required()
})

export const entrySchema = joi.object({
  valor: joi.number().required(),
  descricao: joi.string().required().min(1),
  tipo: joi.string().valid("entrada", "saída")
})

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(usersRouters)
app.use(entryRoutes)



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
