import mongoose from "mongoose";
import Chapitre from "../models/chapitre.js";
import Comment from "../models/comment.js";
import Cour from "../models/cour.js";
import Room from "../models/room.js";
import User from "../models/user.js";
import path from 'path'
import createDirectory from "../middleware/createDir.js";
import Submission from "../models/submission.js";
import submission from "../models/submission.js";
import { uploadFile } from '../middleware/checker.js'

function generate_code_room() {
  var pass = '';
  var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i <= 9; i++) {
    var char = Math.floor(Math.random()
      * str.length + 1);

    pass += str.charAt(char)
  }

  return pass;
}
export const getRoomsByIdUser = async (req, res) => {
  const { userId } = req.params;
  //if(!req.userId) return res.status(404).send(`Not Authentificated`);
  //  if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send(`No user with id: ${userId}`);
  //console.log(req.headers.authorization)

  try {
    const user = await User.findById(userId);
    const isProfesseur = user.isProfesseur;
    // const rooms = []
    if (isProfesseur) {
      // sort post from newest to oldest
      let rooms = await Room.find({ professeur: userId }).sort({ _id: -1 }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')
      res.status(200).json({ rooms })
    }
    else {
      //     //Comme Room est un simple tableau de chaînes, vous pouvez simplement interroger ce champ directement:

      //     //Room.find({ etudiant: userid }, ...);
      let rooms = await Room.find({ etudiants: { $elemMatch: { etudiant: userId } } }).sort({ _id: -1 }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')

      res.status(200).json({ rooms })
    }


  } catch (error) {
    res.status(404).json({ "message": error })
  }
}


export const getRoomsById = async (req, res) => {
  const { id } = req.params;
  //  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
  try {


    // sort post from newest to oldest
    let room = await Room.findById(id).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')
    res.status(200).json({ room })



  } catch (error) {
    res.status(404).json({ "message": error })
  }
}

export const createRoom = async (req, res) => {
  // const {userId , courId , isProfesseur} = req.body ;
  const { title, tags, isProfesseur, userId, description } = req.body;
  createDirectory(title)
  try {
    //generer entier entre 1 et 7 include
    if (isProfesseur) {

      let random = Math.floor(Math.random() * 7) + 1
      let cour = new Cour({
        title: title,
        description: description,
        tags: tags,
        theme: `${process.env.SERVER_URL}/uploads/themes/bg${random}.jpg`,
        createdAt: new Date()
      })
      //  console.log(random)
      const createdCour = await cour.save();
      const courId = createdCour._id;

      let code_room_genere = generate_code_room()
      while (true) {
        const checkedRoom = await Room.findOne({ code_room: code_room_genere })
        if (checkedRoom) code_room_genere = generate_code_room() // if a room with this code exists, generate another code and check again

        else break; //exit the loop

      }

      let NotPopulatedRoom = new Room({
        professeur: userId,
        cour: courId,
        code_room: code_room_genere,
      })
      await NotPopulatedRoom.save();

      const room = await Room.findById(NotPopulatedRoom._id).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')

      res.status(200).json({ room })
      // room =  await room.save();  not working 
      // room=   room.populate('cour').populate('professeur');

    }
    else {
      res.status(403).json({ "message": "You do not have the right to create a class, only teachers" })

    }



  } catch (error) {
    res.status(404).json({ "message": error })
  }


}



export const RejoindreRoom = async (req, res) => {
  const { userId, code_room, isProfesseur } = req.body;
  // if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send(`No student with id: ${userId}`);
  try {
    const room = await Room.findOne({ code_room: code_room })

    if (!room) return res.status(204).json({ roomExists: false })

    if (!isProfesseur) {
      ///The main difference between the == and === operator in javascript is that the == operator does the type conversion of the operands
      // before comparison, whereas the === operator compares the values as well as the data types of the operands.
      const index = room.etudiants.findIndex((elt) => elt.etudiant == String(userId))
      // console.log("!!!!!!!" + room.etudiants[0].etudiant + "!!!!" + userId + "::::"+ index)
      if (index === -1) {

        //    const updatedRoom =  await Room.findByIdAndUpdate({_id : room._id} ,{ $push: { "etudiants": userId } })
        const updatedRoom = await Room.findByIdAndUpdate(room._id, { $push: { "etudiants": { etudiant: userId, chapitresConsultees: [] } } }, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')
        return res.status(200).json({ updatedRoom, deja_Rejoindre: false, roomExists: true })
      }
      else return res.status(208).json({ "message": "you have already registered in this room", deja_Rejoindre: true, roomExists: true })

    }
    else {
      return res.status(403).json({ "message": "You are not allowed to join a class, only students" })

    }



  } catch (error) {
    res.status(404).json({ "message": error })
  }

}

export const getRoomsBySearch = async (req, res) => {
  // recherche by tags or title 

  const { searchQuery, tags, isProfesseur, userId } = req.query
  //const {isProfesseur , userId } = req.body ;
  try {
    const title = RegExp(searchQuery, 'i'); // 
    //   const rooms = await Room.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

    // isProfesseur is a string pas un boolean
    if (isProfesseur === "true")
      var findBy = { professeur: userId }
    else findBy = { etudiants: { $elemMatch: { etudiant: userId } } }

    var populateQuery = [{ path: 'cour', match: { $or: [{ title }, { tags: { $in: tags.split(',') } }] } }, { path: 'professeur' }, { path: 'chapitres' }, { path: 'etudiants.etudiant' }, { path: 'etudiants.chapitresConsultees' }];
    // else
    // var populateQuery = [{path:'cour', match: { $or: [{ title }, { tags: { $in: tags.split(',') } }] }}, {path:'etudiants', match : { $in: [userId]}}];


    var rooms = await Room.find(findBy)
      .populate(populateQuery)
      .then((room_s) => room_s.filter((room => room.cour && room.professeur && room.chapitres != null))) // ihtiyat osafi


    res.status(200).json({ data: rooms })
  } catch (error) {
    res.status(404).json({ "message": error.message })
  }
}



export const addChapitre = async (req, res) => {
  const { idRoom, title, contenu, totalMark } = req.body;
  console.log("AAAAAA", req.file)

  const ext = req.file ? path.extname(req.file.originalname) : ''
  let file = title + ext
  console.log(file)
  let room = await Room.findById(idRoom);
  let cour = await Cour.findById(room.cour);
  const roomtitle = cour.title;
  file = '/uploads/' + roomtitle.toString() + '/' + title + '/' + title + "_" + req.file.originalname


  try {
    const chapitre = new Chapitre({
      title,
      contenu,
      createdAt: new Date(),
      file,
      TotalMarks: totalMark
    })
    await chapitre.save();
    console.log("wwww")
    const updatedRoom = await Room.findByIdAndUpdate(idRoom, { $push: { "chapitres": chapitre._id } }, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')
    return res.status(200).json({ updatedRoom })

  } catch (error) {
    return res.status(400).json({ error })
  }

}


export const noticeChapitreConsultee = async (req, res) => {
  const { chapitreId, idRoom, userId } = req.body;
  // after we create auth middleware we set req.userId so if user is authenticated  that we can use this route
  //if (!req.userId) return res.json({ message: "User is not Authenticated" });
  if (!mongoose.Types.ObjectId.isValid(chapitreId)) return res.status(404).send(`No chapitre with id: ${chapitreId}`);
  try {

    const room = await Room.findById(idRoom)
    // console.log(room)
    // pas besoin de verifier si userId is profeseur car si le cas room ne change pas
    // here we want user to be able to like once a post
    //findIndex is function of js pas mongobd 

    // e.etudiant._id ? car on a utilise populate sinon on utilise seulement e.etudiant
    const indexEtud = room.etudiants.findIndex((e) => e.etudiant == userId)
    const index = room.etudiants.findIndex((e) => e.etudiant == userId && e.chapitresConsultees.includes(chapitreId))
    // console.log(index)
    // console.log(indexEtud)
    if (index === -1) {
      // like 
      room.etudiants[indexEtud].chapitresConsultees.push(chapitreId);

    }

    const updatedRoom = await Room.findByIdAndUpdate(idRoom, room, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees');

    return res.json({ updatedRoom });
  } catch (error) {
    return res.status(400).json({ error })
  }
}

export const deleteEtudiants = async (req, res) => {
  // vous devez envoyser from front id of etudiants pas etudiant car c'est mieux
  const { arrayIds, idRoom } = req.body;

  try {

    for (let i = 0; i < arrayIds.length; i++) {
      var updatedRoom = await Room.findByIdAndUpdate(idRoom, { $pull: { etudiants: { _id: arrayIds[i] } } }, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')

    }
    return res.status(200).json({ updatedRoom })



  } catch (error) {
    return res.status(400).json({ error })
  }

}

// fonction update code room when clic on stylo par ex dans expanded card in active_cour

export const ask_new_codeRoom = async (req, res) => {
  // vous devez envoyser from front id of etudiants pas etudiant car c'est mieux
  const { idRoom } = req.body;

  try {
    let code_room_genere = generate_code_room()
    while (true) {
      const checkedRoom = await Room.findOne({ code_room: code_room_genere })
      if (checkedRoom) code_room_genere = generate_code_room() // si une room avec ce code existe genere autre code et verifier encore

      else break; //exit the loop

    }
    const updatedRoom = await Room.findByIdAndUpdate(idRoom, { code_room: code_room_genere }, { new: true }).populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees')
    return res.status(200).json({ updatedRoom })



  } catch (error) {
    return res.status(400).json({ error })
  }

}


export const addComments = async (req, res) => {
  const { idRoom, idChapitre, content, idUser } = req.body;

  try {
    const NotPopulatedcomment = new Comment({
      chapitre: idChapitre,
      content,
      owner: idUser
    })
    await NotPopulatedcomment.save();
    await Room.findByIdAndUpdate(idRoom, { $push: { comments: NotPopulatedcomment._id } }, { new: true })//.populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees').populate('comments')
    const comment = await Comment.findById(NotPopulatedcomment._id).populate('owner')
    return res.status(200).json({ comment })

  } catch (error) {
    return res.status(400).json({ error })
  }

}


export const getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ chapitre: id }).populate('owner');
    return res.status(200).json({ comments })



  } catch (error) {
    return res.status(400).json({ error })
  }

}

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);
    return res.status(200).json({ comment })



  } catch (error) {
    return res.status(400).json({ error })
  }

}

export const deleteComments_ByIdChapitre = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.deleteMany({ chapitre: id });
    return res.status(200).json({ comment })

  } catch (error) {
    return res.status(400).json({ error })
  }

}


// submission
export const addSubmission = async (req, res) => {
  const { idRoom, idChapitre, idUser, title } = req.body;
  let file = req.file.originalname
  console.log("HII", file)
  let room = await Room.findById(idRoom);
  let cour = await Cour.findById(room.cour);
  let user = await User.findById(idUser)
  const roomtitle = cour.title;
  let chapitre = await Chapitre.findById(idChapitre)
  file = '/uploads/' + roomtitle.toString() + '/' + chapitre.title + '/' + user.firstName + "_" + user.lastName + "_" + file
  const filePath = 'D://MY OWN PROJECT/classroom/main/server' + file;
  const url2 = 'http://127.0.0.1:5000/upload';
  let gp = 0
  let gc = 0
  await uploadFile(filePath, url2)
    .then(response => {
      gp = response.GrammerAndSpellingErrorPercent
      gc = response.GrammerAndSpellingErrorCount
      console.log('File uploaded successfully', response.GrammerAndSpellingErrorCount, "  ", response.GrammerAndSpellingErrorPercent);
    })
  //   .catch(error => {
  //       console.error('Error uploading file:', error.response.data);
  // });
  try {
    console.log("ppppppppppp", gc, " ", gp)
    const SubmissionObj = new Submission({
      owner: idUser,
      chapitre: idChapitre,
      file,
      GrammerErrorPercent: gp,
      GrammerErrorCount: gc
    })
    await SubmissionObj.save();
    await Room.findByIdAndUpdate(idRoom, { $push: { submissions: SubmissionObj._id } }, { new: true })//.populate('cour').populate('professeur').populate('chapitres').populate('etudiants.etudiant').populate('etudiants.chapitresConsultees').populate('comments')
    const submission = await Submission.findById(SubmissionObj._id).populate('owner')
    return res.status(200).json({ submission })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }

}

export const getSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const submissions = await Submission.find({ chapitre: id }).populate('owner')
    return res.status(200).json({ submissions })
  } catch (error) {
    return res.status(400).json({ error })
  }

}
export const getSubmissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findById(id).populate("owner").populate("chapitre")
    res.setHeader('Content-disposition', 'inline');

    console.log("DDDDDSSSSSS", submission)
    res.status(200).json({ submission })
  } catch (error) {
    res.status(404).json({ "message": error })
  }


}

export const updateSubmissionMark = async (req, res) => {
  const { id } = req.params
  const { ObtainedMarks } = req.body
  console.log("OOOOOOOOOOoObtainedMarks", ObtainedMarks)

  try {
    const submission = await Submission.findByIdAndUpdate(id, { ObtainedMarks }, { new: true })
    const submissionRes = await Submission.findById(id).populate("owner").populate("chapitre")
    res.setHeader('Content-disposition', 'inline');

    console.log("DDDDDSSSSSS", submissionRes)
    res.status(200).json({ submissionRes })

  } catch (error) {
    res.status(404).json({ "message": error })
  }

}