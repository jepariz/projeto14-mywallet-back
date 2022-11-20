import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import usersRouters from "./routes/usersRoutes.js"

//SCHEMAS   -------------------------------------------------------------

export const userSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string().min(3).required(),
  password: joi.string().alphanum().min(6).required()
})

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(usersRouters)



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
