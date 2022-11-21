import {usersCollection, sessionCollection, entriesCollections} from "../database/db.js"
import dayjs from "dayjs";
import { entrySchema } from "../index.js";


export async function getEntries (req, res){
    
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);

  const session = await sessionCollection.findOne({ token });
            
  if (!session) {
      return res.sendStatus(401);
  }

  try{
    const entries = await entriesCollections.find({userId: token}).toArray()
		res.send(entries);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
		
};

  export async function newEntry (req, res){
    
    const { authorization } = req.headers; 
    const {valor, descricao, tipo} = req.body

        
    const { error } = entrySchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
  
    const token = authorization?.replace("Bearer ", "");
  
    if (!token) {
      return res.sendStatus(401);
    }
  
  try {
    const session = await sessionCollection.findOne({ token });
  
    const user = await usersCollection.findOne({ _id: session?.userId });
    if (!user) {
      return res.sendStatus(401);
    }

    await entriesCollections.insertOne({
      valor: Number(valor).toFixed(2),
      descricao,
      tipo,
      data: dayjs().format("DD/MM/YYYY"),
      userId: token
    });

    res.status(201).send("Transação criada com sucesso");

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};