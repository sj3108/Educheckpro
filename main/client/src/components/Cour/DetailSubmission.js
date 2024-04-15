import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useRef , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getChapitreById, getSubmissionById } from '../../actions/chapitres'
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
import PopupDoc from './PopupDoc'
import { addSubmissionToRoom, getRoom } from '../../actions/rooms'
import ListSubmission from './ListSubmission'
import DetailChapitre from './DetailChapitre'
import axios from 'axios'
import './css/Loader.css'
function DetailSubmission() {
    const navigate = useNavigate()
    const { id } = useParams()
    // console.log("IIIIIIID", id)
    const dispatch = useDispatch()
    const [ obtainedMarks, setObtainerMarks]= useState(null)
    const [obtainedMarksRender, setObtainedMarksRender] = useState(null);
    const activeRoom = secureLocalStorage.getItem('activeRoom')
    const currentSubmissions = secureLocalStorage.getItem('CurrentSubmission')
    
    const user = getUserFromJWT()
    // const { chapitre, isLoading, comments , submissions } = useSelector(state => state.roomReducers)
    const { chapitre, isLoading , curr} = useSelector(state => state.roomReducers)
    console.log("FFFFFFFFFFFFFF",curr)
    console.log("AAAAAA",currentSubmissions)
    const reportTemplateRef = useRef(null);
    const handlePrint = useReactToPrint({
        content : ()=>reportTemplateRef.current,
        documentTitle : `${chapitre?.title}` || "document",
        
    });
    let marks
    const handleSend= async()=>{
        try{
          marks = await axios.put(`http://localhost:3000/rooms/updateSubmission/${currentSubmissions._id}`,{ObtainedMarks: obtainedMarks } )
         console.log("GGGGGGGGG", marks.data)
        //  setObtainedMarksRender(marks.data.ObtainedMarks);
        }catch(error){
            console.log("error", error)
        }
    }
    useEffect(() => {
        if (!user) navigate('/auth')
        dispatch(getChapitreById(currentSubmissions.chapitre))
        // dispatch(getSubmissionById(currentSubmissions._id))
        // dispatch(fetchComments(id))
        // dispatch(fetchSubmission(id))
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

    // const uri = chapitre.file;
    // const parts = uri.split('/');
    
    // const fileDetail = [
    //     { 
    //         uri: "http://localhost:3000"+chapitre.file ,
    //         fileType:  parts[parts.length - 1].split('.')[1] ,
    //         fileName: parts[parts.length - 1]
    
    //     } 
        
    // ];
//  heelo to send assignment
    // const handleSend = async () => {
    //     let uname= user.firstName +'_'+user.lastName
    //     dispatch(addSubmissionToRoom({ idRoom: activeRoom._id, idChapitre: chapitre._id, idUser: user._id , title: chapitre.title,isProfesseur: user.isProfesseur , username: uname,  file: file   }))

    // // }
    const uri = currentSubmissions.file;
    const parts = uri.split('/');
    

    const fileDetailSubmission = [
        { 
            uri: "http://localhost:3000"+currentSubmissions.file ,
            fileType:  parts[parts.length - 1].split('.')[1] ,
            fileName: parts[parts.length - 1]
    
        } 
        
    ];


    // 
    const uri1 = chapitre.file;
    const parts1 = uri1.split('/')
    
    const fileDetail = [
        { 
            uri: "http://localhost:3000"+chapitre.file ,
            fileType:  parts1[parts1.length - 1].split('.')[1] ,
            fileName: parts1[parts1.length - 1]
        } 
        
    ];
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
          
          {user?.isProfesseur? (    
             <>   
            <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden' , marginTop:'20px' }}>
                <div>
                    <div style={{ borderRadius: '20px', margin: '5px', flex: 1 }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div>
                                {/* <Typography sx={{ wordBreak: 'break-word' }} variant="h4" component="h2" fontFamily='Nunito'>{chapitre.title}</Typography> */}
                                <Typography  sx={{ wordBreak: 'break-word' }} variant="h6" fontFamily='Nunito' >{ user.firstName+" "+ user.lastName } </Typography>
                                <Typography variant="body1">{moment(chapitre?.createdAt).fromNow()}</Typography>
                            </div>
                            <Button variant='contained' sx={{ maxHeight: 40 }} startIcon={<FileDownloadIcon />} onClick={handlePrint}> Generer PDF</Button>
                        </div>
                            <Divider style={{ margin: '20px 0' }} />
                        {/* <div style={{ wordBreak: 'break-word',padding:20 }} variant="h6" fontFamily='Nunito' >{}</div> */}
                        {/* this is pdf component */}
                        <PopupDoc uri={fileDetailSubmission}/>
                    </div>
                               
                </div>

                <div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            
                    <div style={{ wordBreak: 'break-word',padding:20 }} ref={reportTemplateRef}>
                        
                        <input type='number' onChange={(e)=> setObtainerMarks(e.target.value)}/>
                        <button onClick={handleSend}> ADD</button>
                    </div>
                    <div>
                        ObtainedMarks:{marks?.data.ObtainedMarks}
                    </div>
                    
               </div>
                </div>
            </Paper>
             <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden' , marginTop:'20px' }}>
                
             <div>
                {currentSubmissions.ExternalPlagrism[0]?.comparedUrlResult.length > 0 ?
                <>
                <Typography variant="body1">GrammerErrorPercent :{currentSubmissions.GrammerErrorPercent}</Typography>
                <Typography variant="body1">GrammerErrorCount :{currentSubmissions.GrammerErrorCount}</Typography>
                <table className="compared-urls-table">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubmissions.ExternalPlagrism[0].comparedUrlResult.map((item, index) => (
                      <tr key={index}>
                        <td>{item.url}</td>
                        <td>{item.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </>:
                <>
                  <div class="loader-container">
                    <div class="loader"></div>
                    <div class="loader-text">Loading...</div>
                  </div>
                </>
                 }
             </div>
             </Paper>
            
             
             </>
             ):
             (
              <>
              {/* ASSIGNMENT DETAIL  FOR STUDENT*/}
              
              {/* SUBMISSION DETAIL FOR STUDENT */}
              <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden' , marginTop: '15px'}}>
                <div>
                    <div style={{ borderRadius: '20px', margin: '5px', flex: 1 }}>
                    <Typography  variant="h6" fontFamily='Nunito'>Submission</Typography>
                        <PopupDoc uri={fileDetailSubmission}/>
                    </div>
                </div>
            </Paper>
              </>
             )
           }
            {/* comment section */}
            {/* <Box sx={{ ...CustomStyles.commentBox }}>
                <SendCommentBox user={user} idChapitre={id} activeRoom={activeRoom} />
                <Paper style={{ padding: '20px', borderRadius: '15px', overflow: 'hidden' }} elevation={3}>
                    <ListComments comments={comments} />
                </Paper>
            </Box> */}
            {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} 
             style={{ height: 1000 }}
             /> */}
        </>
    )
}

export default DetailSubmission