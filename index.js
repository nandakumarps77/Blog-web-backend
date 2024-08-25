import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js';
import authanticationRouter from './router/authanticationRouter.js';
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import blogRouter from './router/blogRoter.js';
import cors from "cors"


const app = express();


dotenv.config();


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log(("connected to mongoDB database"));
    } catch (e) {
        console.log("failed to connect", e);
    }
};

app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials:true}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("files"));
app.use(fileUpload({uriDecodeFileNames: true,}))
app.use("/images", express.static("images"))



app.use("/api/user",userRouter);
app.use("/api/log",authanticationRouter);
app.use("/api/blog",blogRouter);


app.listen(process.env.PORT, () => {
    connect();
    console.log("server is running");
})