import  express from 'express';
import {createServer} from "node:http";

import mongoose from 'mongoose';
import { connectToSocket } from './src/controllers/SocketManager.js';
import router from './src/routes/usersRoutes.js';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = createServer(app);                
const io = connectToSocket(server);

app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit : "40kb", extended: true}));
app.use("/api/v1/user", router); 

const port = process.env.PORT || 3002;
const URL = process.env.MONGO_URL;
const start = async () => {
  const connectionToDB = await mongoose.connect(`${URL}`);

        console.log("host of the DB : " + connectionToDB.connection.host);
        console.log("DB is connected successfully");
    
    server.listen(port, () => {
    console.log(`server is running on the port ${port}`)
});
}

start();
