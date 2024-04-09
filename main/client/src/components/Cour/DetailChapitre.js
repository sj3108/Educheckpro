import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useRef , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getChapitreById } from '../../actions/chapitres'
import parse from 'html-react-parser'
import SendCommentBox from './SendCommentBox'
import ListComments from './ListComments'
import * as CustomStyles from './styles'
import { fetchComments, fetchSubmission } from '../../actions/comments'
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from 'react-secure-storage'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useReactToPrint} from 'react-to-print'
import { getUserFromJWT } from '../../utils/User'
import axios from "axios";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import PopupDoc from './PopupDoc'
import { addSubmissionToRoom, getRoom } from '../../actions/rooms'
import ListSubmission from './ListSubmission'
import Submission from './Submission'
// import DOCXViewer from './DocxView'
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
function DetailChapitre() {
    const navigate = useNavigate()
    const { id } = useParams()
    const dispatch = useDispatch()
    const activeRoom = secureLocalStorage.getItem('activeRoom')
    const user = getUserFromJWT()
    
    const { chapitre, isLoading, comments , submissions } = useSelector(state => state.roomReducers)
    const reportTemplateRef = useRef(null);
    const [file, setFile]= useState()


    
    const handlePrint = useReactToPrint({
        content : ()=>reportTemplateRef.current,
        documentTitle : `${chapitre?.title}` || "document",
        
    });
    // console.log("HHHHHHHH ", submissions.length)
    
    //


    
    useEffect(() => {
        if (!user) navigate('/auth')
        dispatch(getChapitreById(id))
        dispatch(fetchComments(id))
        dispatch(fetchSubmission(id))
        dispatch(getRoom(activeRoom._id))
}, [id, dispatch])
    

if (isLoading) {
    return <Paper sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderRadius: '15px',
        height: '39vh',
    }} elevation={6}>
            <CircularProgress size="7em" />
        </Paper>
    }
    if (!chapitre /* && !isLoading*/) {
        return (
            <Paper elevation={6} sx={{ padding: '20px', pt: '60px', pb: '60px', borderRadius: '15px' }}>

                <div style={{ borderRadius: '20px', margin: '10px', flex: 1, alignItems: "center", display: 'flex' }}>
                    <CloseIcon color='error' sx={{ fontSize: 70 }} />
                    <Typography variant="h3" component="h2" sx={{ fontFamily: 'Nunito', alignItems: "center" }}>chapitre introuvable</Typography>
                </div>
            </Paper>
        )
        
    } //ou redirect vers /active_Room

    const uri = chapitre.file;
    const parts = uri.split('/')
    
    const fileDetail = [
        { 
            uri: "http://localhost:3000"+chapitre.file ,
            fileType:  parts[parts.length - 1].split('.')[1] ,
            fileName: parts[parts.length - 1]
        } 
        
    ];
    // ===
//  heelo to send assignment
    const handleSend = async () => {
        let uname= user.firstName +'_'+user.lastName
         dispatch(addSubmissionToRoom({ idRoom: activeRoom._id, idChapitre: chapitre._id, idUser: user._id , title: chapitre.title,isProfesseur: user.isProfesseur , username: uname,  file: file   }))
        // Reload the current window
       

        const currentSubmissions = secureLocalStorage.getItem('CurrentSubmission')
        navigate(`/active_cour/chaptire/submission/${currentSubmissions._id}`)
    }
    // // CHECK IF STUDENT HAS SUBMITTED THE ASSIGNMENT AT STUDENT SIDEs
    let isSubmitted=false
    let mySubmission
    
    if (submissions?.length > 0){
        for ( let i=0 ; i< submissions.length ; i++){
            if(submissions[i].owner._id == user._id)
            {
                isSubmitted = true
                mySubmission = submissions[i]
            }
        }
    }
    console.log("isSubmitted ", isSubmitted )
    let fileDetail1
    if (isSubmitted){
        const uri1 = mySubmission?.file;
        const parts1 = uri1?.split('/')
        
         fileDetail1 = [
            { 
                uri: "http://localhost:3000"+mySubmission.file ,
                fileType:  parts1[parts1.length - 1].split('.')[1] ,
                fileName: parts1[parts1.length - 1]
            } 
            
        ];
    }
    return (
        <>
            <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden' }}>
                <div>
                    <div style={{ borderRadius: '20px', margin: '5px', flex: 1 }} >
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div>
                                <Typography sx={{ wordBreak: 'break-word' }} variant="h4" component="h2" fontFamily='Nunito'>{chapitre.title}</Typography>
                                <Typography variant="body1">{moment(chapitre?.createdAt).fromNow()}</Typography>
                            </div>
                            <Button variant='contained' sx={{ maxHeight: 40 }} startIcon={<FileDownloadIcon />} onClick={handlePrint}> Generer PDF</Button>
                        </div>
                        <Divider style={{ margin: '20px 0' }} />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            
                            <div style={{ wordBreak: 'break-word',padding:20 }} ref={reportTemplateRef}>{parse(chapitre.contenu)}</div>
                             <div style={{ wordBreak: 'break-word',padding:20 }} sx={{ maxHeight: 40 }} ref={reportTemplateRef}  variant="h4" >TOTAL MARKS : {chapitre.TotalMarks}</div>
                    
                        </div>
                        {/* this is pdf component */}
                        <PopupDoc uri={fileDetail}/>
                        
                        {/* ========== */}
                    </div>
                </div>
            </Paper>
            {/* TO SUBMIT ASSIGNMENT */}
            {user.isProfesseur ? (
               <>
                {/* New section visible to teacher only */}
                <Paper style={{ padding: '20px', margin : '20px', borderRadius: '15px', overflow: 'hidden', height:"500px" }} elevation={6}>
                <Box sx={{ ...CustomStyles.commentBox }}>
                    <ListSubmission submissions={submissions}/>
                    <h1>   TOTAL SUBMISSION  {submissions?.length}TOTAL STUDENT  { activeRoom.etudiants?.length}</h1>
                </Box>
                </Paper>
               </>
            ):(
               <div>
                { isSubmitted ?  (
                  <>
                  <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden'  , marginTop:"20px"}}>
                  <Typography  variant="h8" fontFamily='Nunito'>Submission</Typography>
                    <PopupDoc uri={fileDetail1}/>
                    <p>GrammerErrorCount:{mySubmission.GrammerErrorCount? mySubmission.GrammerErrorCount : ''}</p>

                    <p>GrammerErrorPercent:{mySubmission.GrammerErrorPercent? mySubmission.GrammerErrorPercent : ''}</p>
                    <p>ObtainedMarks:{mySubmission.ObtainedMarks? mySubmission.ObtainedMarks : ''}</p>
                
                
                   </Paper>

                  </>
                ):(
                <> 
                    <input type='file' onChange={(e)=> setFile(e.target.files[0])}/>
                    <button onClick={handleSend}> SUBMIT</button> 
                </>
                )
                } 
               </div>
            )} 
            
            {/* comment section */}
            <Box sx={{ ...CustomStyles.commentBox }}>
                <SendCommentBox user={user} idChapitre={id} activeRoom={activeRoom} />
                <Paper style={{ padding: '20px', borderRadius: '15px', overflow: 'hidden' }} elevation={3}>
                    <ListComments comments={comments} />
                </Paper>
            </Box>

            
            

            {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} 
             style={{ height: 1000 }}
             /> */}
        </>
    )
}

export default DetailChapitre