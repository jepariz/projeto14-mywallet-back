import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

//SCHEMAS   -------------------------------------------------------------

const userSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string().min(3).required(),
  password: joi.string().alphanum().min(6).required()
})

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("myWallet");
} catch (err) {
  console.log(err);
}

const usersCollection = db.collection("users")

app.post("/registro", async (req, res) => {
  const user = req.body;

  try {
    const userExists = await usersCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Esse email já existe" });
    }
    
    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const hashPassword = bcrypt.hashSync(user.password, 10);

    await usersCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const sessionCollection = db.collection("sessions")

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const user = await usersCollection.findOne({ email });

  const passwordOk = bcrypt.compareSync(password, user.password)

  if(user && passwordOk) {
      const token = uuid();
      
      await sessionCollection.insertOne({
        userId: user._id,
        token
      })
      res.send(token);
  }
  
  if(!password || !user){
    return res.sendStatus(401)
  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
