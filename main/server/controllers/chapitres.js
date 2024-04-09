import Chapitre from "../models/chapitre.js";

import Room from "../models/room.js";
import fs from "fs";
import path from "path";

export const getChapitreById = async (req, res) => {
    const {id} = req.params ;
    
    try {    
          const chapitre = await Chapitre.findById(id)

        // //   ------
        // const filePath = '/uploads/'+chapitre.file
        
        res.setHeader('Content-disposition', 'inline');
        // res.setHeader('Content-type', 'text/plain');
        // Check if the file exists
        // fs.access(filePath, fs.constants.F_OK, (err) => {
            // if (err) {
                // console.error(err);
            // }
    
            // Set appropriate headers for file download
    
            // Create a read stream from the file and pipe it to the response
            // const fileStream = fs.createReadStream(filePath);
            // fileStream.pipe(res);
        // });
        // // ------------------
        console.log("DDDDD", chapitre)          
        res.status(200).json({ chapitre })
    } catch (error) {
            res.status(404).json({ "message": error })
        }

}

export const deleteChapitreById = async (req, res) => {
    //il faut aussi idRoom pour supprimer id dans chacun des champs chapitres:[] et etudiants[].chapitresConsultees[]
    // autre approche c'est supprimer par cascade mais je ne le sais pas
    const {id , idRoom} = req.body ;
    try {    
        //if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Chapitre with id: ${id}`);
        const room = await  Room.findById(idRoom)
        //!!!!!!!!!!!!!!!!!!!!!! attention cast necessaire car _id ecrit  new ObjectId("637511178f19b8b4a535c120") pas string pour comparer
       // si vous utilise !==
      //  console.log(room.chapitres.filter((_id) => String(_id) != id)) // pour htiyat
        room.chapitres = room.chapitres.filter((_id) => String(_id) != id)
        
        for(let i = 0; i < room.etudiants.length; i++) {
            
            room.etudiants[i].chapitresConsultees = room.etudiants[i].chapitresConsultees.filter((_id) => String(_id) !== id)
        }
        
        const updatedRoom = await Room.findByIdAndUpdate(idRoom, room, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees');
        await Chapitre.findByIdAndRemove(id);

         res.status(200).json({ updatedRoom })

        // res.status(200).json({ message: "chapter is deleted successfully." });
        } catch (error) {
          res.status(404).json({ "message": error })
        }

}

export const updateChapitre = async (req, res) => {
    const {id,title,content,idRoom} = req.body ;
    try {    
         
         await Chapitre.findByIdAndUpdate(id, { title  ,content } , {new:true})    
           
        const updatedRoom = await Room.findById(idRoom).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees');  
           res.status(200).json({ updatedRoom })
        } catch (error) {
            res.status(404).json({ "message": error })
        }

}
