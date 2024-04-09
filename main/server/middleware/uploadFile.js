import path from 'path'
import multer from "multer";
import Room from "../models/room.js";
import Cour from "../models/cour.js";
// import createDirectory from './createDir.js';


// const roomname = async(id , title )=>{
//     let room = await Room.findById(id) 
//     let cour= await Cour.findById(room.cour)
//     const roomtitle = cour.title
//     await createDirectory(roomtitle.toString()+'/'+title)
//     return roomtitle.toString()
// }
// var storage = multer.diskStorage({
//         destination: function(req, file , cb){
//         const { idRoom, title } = req.body
//         roomname(idRoom , title)
//         .then(roomTitle => {
//             console.log(roomTitle+'/'+title)
//             cb(null,'uploads/'+roomTitle+'/'+title)
//         })
//         .catch(error => {
//            console.error(error); // Handle any errors here
//          });
//     },
//     filename: function(req , file , cb){
        
//         let ext= path.extname(file.originalname)
//         cb(null,ext)
       
//         // console.log("AAAAAAAAAAAAA",roomname(idRoom))
//         // console.log(roomname(idRoom))
//         // cb(null,roomname(idRoom)+ ext)
//     }
// })

// var upload = multer({
//     storage : storage,
//     // fileFilter: function(req,file,callback){
//     //     // if(
//     //     //     file.mimetype == ""
//     //     // )
//     // }
// })

// export default upload
import util from 'util';
// import multer from 'multer';
import fs from 'fs';
import user from '../models/user.js';

// const Room = require('./models/Room'); // Assuming you have a model for Room
// const Cour = require('./models/Cour'); // Assuming you have a model for Cour

const createDirectory = util.promisify(fs.mkdir);

const roomname = async (id, title , isProfesseur) => {
    let room = await Room.findById(id);
    let cour = await Cour.findById(room.cour);
    const roomtitle = cour.title;
    const isPro = Boolean(isProfesseur)
    if (isProfesseur == "true"){
        await createDirectory('uploads/' + roomtitle.toString() + '/' + title);
    }
    return roomtitle.toString();
};

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        // console.log("requestt", req)
        try {
            const { idRoom, idUser,  title , isProfesseur } = req.body;
            const roomTitle = await roomname(idRoom, title ,isProfesseur );
            console.log(roomTitle + '/' + title);
            cb(null, 'uploads/' + roomTitle + '/' + title);
        } catch (error) {
            console.error(error); // Handle any errors here
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        console.log(file)
        const {  title , isProfesseur , username } = req.body;
        console.log("FFFFF",username )
        if (isProfesseur == "true"){
            cb(null, title+'_'+file.originalname);
        }else{
            cb(null, username+'_'+file.originalname)
        }
        
    }
});

const upload = multer({ storage: storage });

export default upload;
