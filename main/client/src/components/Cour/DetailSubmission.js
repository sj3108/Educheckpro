import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system';
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
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
import { useReactToPrint } from 'react-to-print'
import { getUserFromJWT } from '../../utils/User'
import PopupDoc from './PopupDoc'
import { addSubmissionToRoom, getRoom } from '../../actions/rooms'
import ListSubmission from './ListSubmission'
import DetailChapitre from './DetailChapitre'
import axios from 'axios'
import './css/Loader.css'
import Tooltip from '@mui/material/Tooltip';
import './styles.css'

function DetailSubmission() {
    const navigate = useNavigate()
    const { id } = useParams()
    // console.log("IIIIIIID", id)
    const dispatch = useDispatch()
    const [obtainedMarks, setObtainedMarks] = useState(null)
    const [submissionData, setSubmissionData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const activeRoom = secureLocalStorage.getItem('activeRoom')
    const currentSubmissions = secureLocalStorage.getItem('CurrentSubmission')

    const user = getUserFromJWT()
    // const { chapitre, isLoading, comments , submissions } = useSelector(state => state.roomReducers)
    const { chapitre, isLoading } = useSelector(state => state.roomReducers)
    const reportTemplateRef = useRef(null);

    // console.log("AAAAAA", chapitre.title)
    const handlePrint = useReactToPrint({
        documentTitle: `${chapitre?.title}` || "document",
        content: () => reportTemplateRef.current,
    });

    const handleSend = async () => {
        try {
            await axios.put(`http://localhost:3000/rooms/updateSubmission/${currentSubmissions._id}`, { ObtainedMarks: obtainedMarks })
            setSubmissionData(obtainedMarks);
            //window.location.reload();
            //console.log("GGGGGGGGG", marks.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const fetchSubmissionData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/rooms/getSubmissionById/${currentSubmissions._id}`);
            setSubmissionData(response.data.submission.ObtainedMarks);
        } catch (error) {
            console.log("error", error)
        }
    }


    useEffect(() => {
        if (!user) navigate('/auth')
        dispatch(getChapitreById(currentSubmissions.chapitre))
        dispatch(getRoom(activeRoom._id))
        fetchSubmissionData();
    }, [id, dispatch])

    //console.log(submissionData);

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
            uri: "http://localhost:3000" + currentSubmissions.file,
            fileType: parts[parts.length - 1].split('.')[1],
            fileName: parts[parts.length - 1]
        }
    ];


    // 
    const uri1 = chapitre.file;
    const parts1 = uri1.split('/')

    const fileDetail = [
        {
            uri: "http://localhost:3000" + chapitre.file,
            fileType: parts1[parts1.length - 1].split('.')[1],
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
                                <Typography sx={{ wordBreak: 'break-word', padding: '10px 35px 2px 35px' }} variant="h4" component="h2" fontFamily='Nunito'>{chapitre.title}</Typography>
                                <Typography variant="body1" sx={{ paddingLeft: '39px' }}>{moment(chapitre?.createdAt).fromNow()}</Typography>
                            </div>
                            <Button variant='contained' sx={{ maxHeight: 40, margin: '20px 50px' }} startIcon={<FileDownloadIcon />} onClick={handlePrint}>Generate PDF</Button>
                        </div>
                        <Divider style={{ margin: '20px 0', borderBottomWidth: '2px', borderColor: '#908B8B', borderRadius: '10px' }} />
                        <div ref={reportTemplateRef}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <div style={{ wordBreak: 'break-word', padding: 20 }}>{parse(chapitre.contenu)}</div>
                                {chapitre.TotalMarks ? (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: '10px 35px', padding: '10px 25px', width: '500px' }}>
                                            <div style={{ wordBreak: 'break-word' }} variant="h4" >TOTAL MARKS : {chapitre.TotalMarks}</div>
                                        </div>
                                    </>
                                ) : (<></>)}
                            </div>
                        </div>
                        {/* this is pdf component */}
                        <Button variant="contained" style={{ backgroundColor: 'rgba(0, 180, 0, 0.8)', color: 'white' }} sx={{ margin: '5px 15px' }}>
                            <PopupDoc uri={fileDetail} />
                        </Button>
                        {/* ========== */}
                    </div>
                </div>
            </Paper>

            {user?.isProfesseur ? (
                <>
                    <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden', marginTop: '20px' }}>
                        <div>
                            <div style={{ borderRadius: '20px', margin: '5px', flex: 1 }}>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <div>
                                        {/* <Typography sx={{ wordBreak: 'break-word' }} variant="h4" component="h2" fontFamily='Nunito'>{chapitre.title}</Typography> */}
                                        <Typography sx={{ wordBreak: 'break-word', padding: '10px 35px 2px 20px' }} variant="h6" fontFamily='Nunito' >Student Name : {currentSubmissions.owner.firstName + " " + currentSubmissions.owner.lastName} </Typography>
                                        <Typography variant="body1" sx={{ paddingLeft: '22px' }}>{moment(chapitre?.createdAt).fromNow()}</Typography>
                                    </div>
                                </div>
                                <Divider style={{ margin: '20px 0', borderBottomWidth: '2px', borderColor: '#908B8B', borderRadius: '10px' }} />
                                {/* <div style={{ wordBreak: 'break-word',padding:20 }} variant="h6" fontFamily='Nunito' >{}</div> */}
                                {/* this is pdf component */}
                                <Button variant="contained" style={{ backgroundColor: 'rgba(0, 180, 180, 0.8)', color: 'white' }} sx={{ margin: '20px 20px' }}>
                                    <PopupDoc uri={fileDetailSubmission} />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <div style={{ margin: '20px 30px' }}>
                                    Obtained Marks: {(submissionData) ? (submissionData) : (" Marks not assigned yet")}
                                </div>
                                {!submissionData ? (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px', marginBottom: '30px' }}>
                                            <input
                                                type='number'
                                                placeholder='Enter marks'
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    if (value > chapitre.TotalMarks) {
                                                        setErrorMessage(`Marks cannot exceed ${chapitre.TotalMarks}`);
                                                        setObtainedMarks(null); // Clear the obtained marks if it exceeds the limit
                                                    } else {
                                                        setErrorMessage('');
                                                        setObtainedMarks(value);
                                                    }
                                                }}
                                                style={{
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                    marginRight: '10px',
                                                    width: '150px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {errorMessage ? (
                                                <Tooltip title={errorMessage} placement="top">
                                                    <span>
                                                        <button
                                                            disabled
                                                            style={{
                                                                padding: '10px 20px',
                                                                borderRadius: '5px',
                                                                backgroundColor: '#ccc',
                                                                color: 'white',
                                                                border: 'none',
                                                                cursor: 'not-allowed'
                                                            }}>Submit</button>
                                                    </span>
                                                </Tooltip>
                                            ) : (
                                                <button
                                                    onClick={handleSend}
                                                    disabled={obtainedMarks === null}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '5px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}>Submit</button>
                                            )}
                                        </div>
                                    </>) : (<></>)}
                            </div>
                        </div>
                    </Paper >
                    <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden', marginTop: '20px' }}>
                        <div>
                            {/* {currentSubmissions.ExternalPlagrism[0]?
                <> */}
                            <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '1.2rem' }} sx={{ margin: '10px 15px' }}>Evaluation Overview :</Typography>
                            <Divider style={{ margin: '20px 0', borderBottomWidth: '2px', borderColor: '#908B8B', borderRadius: '10px' }} />
                            <Typography variant="body1" sx={{ margin: '10px 15px' }}>GrammerErrorPercent :{currentSubmissions.GrammerErrorPercent ? currentSubmissions.GrammerErrorPercent : ""}</Typography>
                            <Typography variant="body1" sx={{ margin: '10px 15px' }}>GrammerErrorCount :{currentSubmissions.GrammerErrorCount ? currentSubmissions.GrammerErrorCount : ""}</Typography>
                            <table className="compared-urls-table">
                                <thead>
                                    <tr>
                                        <th>URL</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSubmissions.ExternalPlagrism[0]?.comparedUrlResult.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.url}</td>
                                            <td>{item.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* </>:
                <>
                  <div class="loader-container">
                    <div class="loader"></div>
                    <div class="loader-text">Loading...</div>
                  </div>
                </>
                 } */}
                        </div>
                    </Paper>


                </>
            ) :
                (
                    <>
                        {/* ASSIGNMENT DETAIL  FOR STUDENT*/}
                        {/* SUBMISSION DETAIL FOR STUDENT */}
                        <Paper elevation={6} style={{ padding: '10px', borderRadius: '15px', overflow: 'hidden', marginTop: '15px' }}>
                            <div>
                                <div style={{ borderRadius: '20px', margin: '5px', flex: 1 }}>
                                    <Typography variant="h6" fontFamily='Nunito'>Submission</Typography>
                                    <PopupDoc uri={fileDetailSubmission} />
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