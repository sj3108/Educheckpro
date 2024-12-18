import express from "express";
import cors from 'cors'
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import roomsRoutes from './routes/rooms.js'
import usersRoutes from './routes/users.js'
import coursRoutes from './routes/cours.js'
import chapitresRoutes from './routes/chapitres.js'
import dotenv from 'dotenv'

// import dotenv from ""
//__dirname and __filename aren’t shared either, but import.meta.url is dans ES MODULE
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

// const uploadFile = require('./middleware/checker.js');
dotenv.config();

app.use('/uploads/themes', express.static(__dirname + '/uploads/themes'));
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.use(cors())
app.use(morgan('tiny'))
//====
app.use('/uploads', express.static('uploads'))
//*************************************** */ 
app.use('/cours', coursRoutes);
app.use('/rooms', roomsRoutes);
app.use('/users', usersRoutes);
//*************************************** */
app.use('/chapitres', chapitresRoutes);

// mongodb connect
const MONGOOSE_URL = process.env.MONGOOSE_URL

const PORT = process.env.PORT || 5000;





mongoose.set("strictQuery", false);
mongoose.connect(MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running from port ${PORT}`)))
    .catch((err) => console.log(err.message))





// until here we make sure that we 're not getting any message warning in console 