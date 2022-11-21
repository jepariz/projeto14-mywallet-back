import { userSchema, userLoginSchema} from "../index.js";
import {usersCollection, sessionCollection} from "../database/db.js"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

export async function registerUser (req, res) {
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
  
  };

  export async function userSignIn (req, res) {
    const { email, password } = req.body;

    const { error } = userLoginSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
    
    const user = await usersCollection.findOne({ email });
    console.log(user)
  
    const passwordOk = bcrypt.compareSync(password, user.password)

  
    if(user && passwordOk) {
        const token = uuid();
        const username = user.name
        
        await sessionCollection.insertOne({
          userId: user._id,
          token
        })
        res.send({token, username});
    }
    if(!password || !user){
      return res.sendStatus(401)
    }
  }