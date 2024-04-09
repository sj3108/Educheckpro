import express from "express";

import { getRoomsByIdUser ,createRoom, RejoindreRoom, getRoomsById, getRoomsBySearch,addChapitre, noticeChapitreConsultee, deleteEtudiants, ask_new_codeRoom, addComments, getComments, deleteComment, deleteComments_ByIdChapitre, addSubmission , getSubmission, getSubmissionById ,updateSubmissionMark } from "../controllers/rooms.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/uploadFile.js";

const router = express.Router();

router.get('/getRoom/:id',auth, getRoomsById)
router.get('/:userId',auth, getRoomsByIdUser)
router.post('/createRoom', createRoom)
router.post('/rejoindre', RejoindreRoom)

router.get('/getRooms/search', getRoomsBySearch)
router.post('/addChapitre',upload.single('file') , addChapitre)

router.post('/consulter', noticeChapitreConsultee)

router.post('/deleteEtudiants', deleteEtudiants)

router.patch('/askfor_new_codeRoom', ask_new_codeRoom)

//pour les commentaires du chapitre du room
router.post('/addSubmission', upload.single('file') , addSubmission)
router.get('/getSubmission/:id', getSubmission)
router.get('/getSubmissionById/:id', getSubmissionById)
router.put('/updateSubmission/:id',updateSubmissionMark)
router.post('/addComment', addComments)
router.get('/getComments/:id', getComments)
router.delete('/deleteComment/:id', deleteComment)

router.delete('/deleteComments/:id', deleteComments_ByIdChapitre)
export default router 